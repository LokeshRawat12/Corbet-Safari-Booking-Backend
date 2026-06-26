import { Router } from 'express'
import TicketPrice from '../models/TicketPrice.js'

const router = Router()

// Get all ticket prices
router.get('/ticket-prices', async (req, res, next) => {
  try {
    const prices = await TicketPrice.find().sort({ order: 1 })
    res.json(prices)
  } catch (error) {
    next(error)
  }
})

// Create ticket price
router.post('/ticket-prices', async (req, res, next) => {
  try {
    const price = new TicketPrice(req.body)
    await price.save()
    res.status(201).json(price)
  } catch (error) {
    next(error)
  }
})

// Update ticket price
router.put('/ticket-prices/:id', async (req, res, next) => {
  try {
    const price = await TicketPrice.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' })
    if (!price) return res.status(404).json({ error: 'Ticket price not found' })
    res.json(price)
  } catch (error) {
    next(error)
  }
})

// Delete ticket price
router.delete('/ticket-prices/:id', async (req, res, next) => {
  try {
    await TicketPrice.findByIdAndDelete(req.params.id)
    res.json({ message: 'Ticket price deleted' })
  } catch (error) {
    next(error)
  }
})

export default router
