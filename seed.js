import dotenv from 'dotenv'
dotenv.config({ path: './config.env' })

import mongoose from 'mongoose'
import menuItems from './data/menuItems.js'
import MenuItem from './models/menuModel.js'

async function seed() {
  try {
    await mongoose.connect(process.env.DATABASE.replace('<db_password>', process.env.DATABASE_PASSWORD))
    console.log('Conectado a MongoDB')

    const { deletedCount } = await MenuItem.deleteMany({})
    console.log(`Eliminados ${deletedCount} platillos`)

    const inserted = await MenuItem.insertMany(menuItems)
    console.log(`Insertados ${inserted.length} platillos`)

  } catch (error) {
    console.error('Error en el seed', error.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}
seed()