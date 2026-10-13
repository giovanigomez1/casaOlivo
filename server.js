import './util/loadEnv.js'

import { app } from './app.js'
import connectDB from './util/db.js'

if (!process.env.VERCEL) {
  process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION, shutting down the server...')
    console.log(err.name, err.message)
    process.exit(1)
  })

  const port = process.env.PORT || 8000

  connectDB().catch(err => console.log('There was an error while connecting to the database', err.message))

  const server = app.listen(port, () => {
    console.log(`App running on port ${port}`)
  })

  process.on('unhandledRejection', err => {
    console.log(err.name, err.message)
    console.log('UNHANDLED REJECTION, shutting down the server...')
    server.close(() => {
      process.exit(1)
    })
  })

  process.on('SIGTERM', () => {
    console.log('SIGTERM RECEIVED. Shutting down gracefully...')
    server.close(() => {
      console.log('Process terminated')
    })
  })
} else {
  process.on('unhandledRejection', err => {
    console.log('Unhandled Rejection:', err)
  })
}

export default app
