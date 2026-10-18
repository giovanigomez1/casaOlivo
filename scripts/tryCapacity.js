import '../util/loadEnv.js'
import mongoose from 'mongoose'
import { getBookedGuests, hasCapacity } from '../services/capacityService.js'

await mongoose.connect(process.env.DATABASE.replace('<db_password>', process.env.DATABASE_PASSWORD))

const saturday = '2026-10-24'
console.log('19:30 ->', await getBookedGuests(saturday, '19:30'))
console.log('20:00 ->', await getBookedGuests(saturday, '20:00'))
console.log('15:00 ->', await getBookedGuests(saturday, '15:00'))



console.log('19:30 + 10 →', await hasCapacity(saturday, '19:30', 10))  // true  (10 + 10 = 20)
console.log('19:30 + 11 →', await hasCapacity(saturday, '19:30', 11))  // false (10 + 11 = 21)
console.log('20:00 + 1  →', await hasCapacity(saturday, '20:00', 1))   // false (ya está lleno)
console.log('15:00 + 10 →', await hasCapacity(saturday, '15:00', 10))  // true  (vacío)




await mongoose.disconnect()