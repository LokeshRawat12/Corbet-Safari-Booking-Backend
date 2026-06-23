import dotenv from 'dotenv'

dotenv.config()

const PORT = Number(process.env.PORT ?? 4000)

export default {
  port: PORT,
  apiPrefix: process.env.API_PREFIX ?? '/api',
  allowedOrigins: [
    process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173',
    'http://localhost:3000',
  ],
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/corbett_safari',
}
