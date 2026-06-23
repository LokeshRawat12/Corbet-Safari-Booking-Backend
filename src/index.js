import 'dotenv/config'
import mongoose from 'mongoose'
import app from './app.js'

const port = Number(process.env.PORT ?? 4000)
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/corbett_safari'

mongoose.connect(mongoUri)
  .then(() => console.log('🍃 Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err))

app.listen(port, () => {
  console.log(`🦁 Corbet Booking backend listening on http://localhost:${port}`)
})
