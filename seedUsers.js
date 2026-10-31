import './util/loadEnv.js'

import mongoose from 'mongoose'
import adminClerkUsers from './data/adminClerkUsers.js'
import User from './models/userModel.js'


async function seedAdmin() {

  if (process.env.NODE_ENV === 'production') {
    console.log('No se puede correr el seed en producción')
    process.exitCode = 1
    return
  }

  try {
    await mongoose.connect(process.env.DATABASE.replace('<db_password>', process.env.DATABASE_PASSWORD))
    console.log('Conectado a MongoDB')

    const { deletedCount } = await User.deleteMany({})
    console.log(`Eliminados ${deletedCount} users`)

    const inserted = await User.create(adminClerkUsers)
    console.log(`Insertados ${inserted.length} usuarios`)


  } catch (error) {
    console.error('Error en el seed:', error.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

seedAdmin()