import { Router } from 'express'
import Zone from '../models/Zone.js'

const router = Router()
const zoneCache = new Map()
const ZONE_CACHE_TTL = 60 * 1000

function getCachedZones() {
  const cached = zoneCache.get('all-zones')
  if (cached && Date.now() - cached.time < ZONE_CACHE_TTL) {
    return cached.data
  }
  return null
}

function setCachedZones(data) {
  zoneCache.set('all-zones', { data, time: Date.now() })
}

function clearZoneCache() {
  zoneCache.clear()
}

// Get all zones
router.get('/zones', async (req, res, next) => {
  try {
    const cached = getCachedZones()
    if (cached) {
      return res.json(cached)
    }

    const zones = await Zone.find({}).sort({ title: 1 }).lean()
    setCachedZones(zones)
    res.json(zones)
  } catch (error) {
    next(error)
  }
})

// Get single zone by slug
router.get('/zones/:slug', async (req, res, next) => {
  try {
    const zone = await Zone.findOne({ slug: req.params.slug }).lean()

    if (!zone) {
      return res.status(404).json({ error: 'Zone not found' })
    }

    res.json(zone)
  } catch (error) {
    next(error)
  }
})

// Update zone
router.put('/zones/:slug', async (req, res, next) => {
  try {
    const zone = await Zone.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { returnDocument: 'after', upsert: true }
    )
    clearZoneCache()
    res.json(zone)
  } catch (error) {
    next(error)
  }
})

// Create zone
router.post('/zones', async (req, res, next) => {
  try {
    const zone = await Zone.create(req.body)
    clearZoneCache()
    res.status(201).json(zone)
  } catch (error) {
    next(error)
  }
})

// Bulk seed zones (upserts all provided zones)
router.post('/zones/seed', async (req, res, next) => {
  try {
    const { zones } = req.body
    if (!Array.isArray(zones)) return res.status(400).json({ error: 'zones array required' })

    const results = []
    for (const z of zones) {
      const zone = await Zone.findOneAndUpdate(
        { slug: z.slug },
        z,
        { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true }
      )
      results.push(zone)
    }
    clearZoneCache()
    res.json(results)
  } catch (error) {
    next(error)
  }
})

// Delete zone
router.delete('/zones/:slug', async (req, res, next) => {
  try {
    const zone = await Zone.findOneAndDelete({ slug: req.params.slug })
    if (!zone) return res.status(404).json({ error: 'Zone not found' })
    clearZoneCache()
    res.json({ message: 'Zone deleted' })
  } catch (error) {
    next(error)
  }
})

export default router

