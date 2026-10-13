import express from "express";
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { fileURLToPath } from 'url'
import path from 'path'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import connectDB from "./util/db.js";
import rateLimit from 'express-rate-limit'
import itemRoute from './routes/itemRoute.js'
import globalErrorHandler from './controllers/errorController.js'

import homeroute from './routes/home.js'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)



dotenv.config({ path: './config.env' })
const app = express()

app.set('trust proxy', 1)
console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour'
})

app.use('/api', limiter)

app.use(express.static(path.join(__dirname, 'public')))
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))
app.use(helmet())


app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())


app.use('/api', async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (err) {
    console.error('DB connection error', err.message)
    res.status(503).json({ status: 'error', message: 'Service temporarily unavailable, please try again' })
  }
})


app.use('/', homeroute)
app.use('/api/v1/menu', itemRoute)

app.use((req, res, next) => next(new AppError(`No existe ${req.originalUrl}`, 404)))
app.use(globalErrorHandler)


export { app }