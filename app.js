import express from 'express'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import rateLimit from 'express-rate-limit'

import connectDB from './util/db.js'
import AppError from './util/appError.js'
import globalErrorHandler from './controllers/errorController.js'
import homeRoute from './routes/home.js'
import menuRoutes from './routes/menuRoutes.js'
import reservationRoutes from './routes/reservationsRoutes.js'


const app = express()

app.set('trust proxy', 1)

// 1) Seguridad y utilidades globales
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

const limiter = rateLimit({
  limit: 100,
  windowMs: 15 * 60 * 1000,
  message: { status: 'fail', message: 'Too many requests from this IP, please try again in 15 minutes' }
})
app.use('/api', limiter)

app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

// 2) Conexión a la base de datos (necesario en entornos serverless como Vercel)
app.use('/api', async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (err) {
    console.error('DB connection error', err.message)
    res.status(503).json({ status: 'error', message: 'Service temporarily unavailable, please try again' })
  }
})

// 3) Rutas
app.use('/', homeRoute)
app.use('/api/v1/menu', menuRoutes)
app.use('/api/v1/reservations', reservationRoutes)


// 4) Rutas inexistentes y manejo de errores
app.use((req, res, next) => next(new AppError(`Can't find ${req.originalUrl} on this server`, 404)))
app.use(globalErrorHandler)

export { app }
