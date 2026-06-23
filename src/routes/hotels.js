import { Router } from 'express'
import Hotel from '../models/Hotel.js'

const router = Router()

// Get all hotels
router.get('/hotels', async (req, res, next) => {
  try {
    const hotels = await Hotel.find().sort({ name: 1 })
    res.json(hotels)
  } catch (error) {
    next(error)
  }
})

// Get single hotel
router.get('/hotels/:id', async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
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
    res.status(201).json(hotel)
  } catch (error) {
    next(error)
  }
})

// Update hotel
router.put('/hotels/:id', async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!hotel) return res.status(404).json({ error: 'Hotel not found' })
    res.json(hotel)
  } catch (error) {
    next(error)
  }
})

// Delete hotel
router.delete('/hotels/:id', async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id)
    res.json({ message: 'Hotel deleted' })
  } catch (error) {
    next(error)
  }
})

export default router
