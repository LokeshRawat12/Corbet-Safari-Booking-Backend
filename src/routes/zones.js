import { Router } from 'express'
import Zone from '../models/Zone.js'

const router = Router()

// Get all zones
router.get('/zones', async (req, res, next) => {
  try {
    const zones = await Zone.find().sort({ title: 1 })
    res.json(zones)
  } catch (error) {
    next(error)
  }
})

// Get single zone by slug
router.get('/zones/:slug', async (req, res, next) => {
  try {
    const zone = await Zone.findOne({ slug: req.params.slug })

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
      { new: true, upsert: true }
    )
    res.json(zone)
  } catch (error) {
    next(error)
  }
})

// Delete zone
router.delete('/zones/:slug', async (req, res, next) => {
  try {
    const zone = await Zone.findOneAndDelete({ slug: req.params.slug })
    if (!zone) return res.status(404).json({ error: 'Zone not found' })
    res.json({ message: 'Zone deleted' })
  } catch (error) {
    next(error)
  }
})

export default router

