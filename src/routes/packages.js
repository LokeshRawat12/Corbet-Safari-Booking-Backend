import { Router } from 'express'
import Package from '../models/Package.js'

const router = Router()

// Get all packages
router.get('/packages', async (req, res, next) => {
  try {
    const packages = await Package.find().sort({ title: 1 })
    res.json(packages)
  } catch (error) {
    next(error)
  }
})

// Get single package
router.get('/packages/:slug', async (req, res, next) => {
  try {
    const pkg = await Package.findOne({ slug: req.params.slug })
    if (!pkg) return res.status(404).json({ error: 'Package not found' })
    res.json(pkg)
  } catch (error) {
    next(error)
  }
})

// Create package
router.post('/packages', async (req, res, next) => {
  try {
    const pkg = new Package(req.body)
    await pkg.save()
    res.status(201).json(pkg)
  } catch (error) {
    next(error)
  }
})

// Update package
router.put('/packages/:id', async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!pkg) return res.status(404).json({ error: 'Package not found' })
    res.json(pkg)
  } catch (error) {
    next(error)
  }
})

// Delete package
router.delete('/packages/:id', async (req, res, next) => {
  try {
    await Package.findByIdAndDelete(req.params.id)
    res.json({ message: 'Package deleted' })
  } catch (error) {
    next(error)
  }
})

export default router
