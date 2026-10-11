import mongoose from "mongoose";


let cached = globalThis._mongoose
if (!cached) cached = globalThis._mongoose = { conn: null, promise: null }



export default async function connectDB() {
  if (cached.comm && mongoose.connection.readyState === 1) return cached.conn

  if (!cached.promise) {
    const DB = process.env.DATABASE.replace('<db_password>', process.env.DATABASE_PASSWORD)
    cached.promise = mongoose
      .connect(DB, {
        autoIndex: process.env.NODE_ENV !== 'production',
        bufferCommands: false,
        serverSelectionTimeoutMS: 8000,
        maxPoolSize: 10
      })
      .then(m => {
        console.log('Database connected successfully...')
        return m
      })
      .catch(err => {
        cached.promise = null
        throw err
      })
  }
  cached.comm = await cached.promise
  return cached.comm
}