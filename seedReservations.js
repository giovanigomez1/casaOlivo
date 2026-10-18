import './util/loadEnv.js'

import mongoose from 'mongoose'
import reservations from './data/reservations.js'
import Reservation from './models/reservationModel.js'

async function seedReservations() {
  if (process.env.NODE_ENV === 'production') {
    console.error('No se puede correr el seed en producción')
    process.exitCode = 1
    return
  }

  try {
    await mongoose.connect(process.env.DATABASE.replace('<db_password>', process.env.DATABASE_PASSWORD))
    console.log('Conectado a MongoDB')

    const { deletedCount } = await Reservation.deleteMany({})
    console.log(`Eliminadas ${deletedCount} reservaciones`)

    const inserted = await Reservation.insertMany(reservations)
    console.log(`Insertadas ${inserted.length} reservaciones:`)
    console.table(inserted.map(r => ({
      fecha: r.date, hora: r.time, personas: r.guests, estado: r.status, codigo: r.code
    })))
  } catch (error) {
    console.error('Error en el seed:', error.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

seedReservations()