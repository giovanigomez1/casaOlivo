import dotenv from 'dotenv'
dotenv.config({ path: './config.env' })

import { app } from './app.js'
import connectDB from './util/db.js'


if (!process.env.VERCEL) {
  process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION, Shutting donw the server bye...')
    console.log(err.name, err.message)
  })

  const port = process.env.PORT || 8000

  connectDB().catch(err => console.log('There was an error white connecting to the database', err))



  const server = app.listen(port, () => {
    console.log(`App runnin at port ${port}`)
  })
  process.on('unhandledRejection', err => {
    console.log(err.name, err.message)
    console.log('Uhandled Rejection, Shutting donw the server...')
    server.close(() => {
      process.exit(1)
    })
  })
  process.on('SIGTERM', () => {
    console.log('SIGTERM RECEIVED. Shutting down the gracefully...')
    server.close(() => {
      console.log('Process terminated')
    })
  })
} else {
  process.on('unhandledRejection', err => {
    console.log('Uhandled Rejection:', err)
  })
}

export default app
