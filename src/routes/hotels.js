import { Router } from 'express'
import Hotel from '../models/Hotel.js'

const router = Router()
const hotelCache = new Map()
const HOTEL_CACHE_TTL = 60 * 1000

function getCachedHotels() {
  const cached = hotelCache.get('all-hotels')
  if (cached && Date.now() - cached.time < HOTEL_CACHE_TTL) {
    return cached.data
  }
  return null
}

function setCachedHotels(data) {
  hotelCache.set('all-hotels', { data, time: Date.now() })
}

function clearHotelCache() {
  hotelCache.clear()
}

// Get all hotels
router.get('/hotels', async (req, res, next) => {
  try {
    const cached = getCachedHotels()
    if (cached) {
      return res.json(cached)
    }

    const hotels = await Hotel.find({ isActive: true }).sort({ name: 1 }).lean()
    setCachedHotels(hotels)
    res.json(hotels)
  } catch (error) {
    next(error)
  }
})

// Get single hotel
router.get('/hotels/:id', async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id).lean()
    if (!hotel) return res.status(404).json({ error: 'Hotel not found' })
    res.json(hotel)
  } catch (error) {
    next(error)
  }
})

// Create hotel
router.post('/hotels', async (req, res, next) => {
  try {
    const hotel = new Hotel(req.body)
    await hotel.save()
    clearHotelCache()
    res.status(201).json(hotel)
  } catch (error) {
    next(error)
  }
})

// Update hotel
router.put('/hotels/:id', async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' })
    if (!hotel) return res.status(404).json({ error: 'Hotel not found' })
    clearHotelCache()
    res.json(hotel)
  } catch (error) {
    next(error)
  }
})

// Delete hotel
router.delete('/hotels/:id', async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id)
    clearHotelCache()
    res.json({ message: 'Hotel deleted' })
  } catch (error) {
    next(error)
  }
})

export default router
