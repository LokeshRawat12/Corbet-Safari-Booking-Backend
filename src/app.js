import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import config from './config/default.js'
import zonesRouter from './routes/zones.js'
import bookingsRouter from './routes/bookings.js'
import contactRouter from './routes/contact.js'
import hotelsRouter from './routes/hotels.js'
import ticketPricesRouter from './routes/ticketPrices.js'
import packagesRouter from './routes/packages.js'


const app = express()

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('tiny'))

const corsOptions = {
  origin: true, // Allow all origins in development for easier setup
  credentials: true,
}

app.use(cors(corsOptions))

app.use(config.apiPrefix, zonesRouter)
app.use(config.apiPrefix, bookingsRouter)
app.use(config.apiPrefix, contactRouter)
app.use(config.apiPrefix, hotelsRouter)
app.use(config.apiPrefix, ticketPricesRouter)
app.use(config.apiPrefix, packagesRouter)


app.get('/', (req, res) => {
  res.json({
    name: 'Corbet Booking Backend',
    version: process.env.npm_package_version || '0.0.0',
    uptime: process.uptime(),
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// error handler
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

export default app
