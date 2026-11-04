import Reservation from '../models/reservationModel.js'
import { SCHEDULE, TIME_SLOTS, isPastSlot } from '../config/schedule.js'


export async function getBookedGuests(date, time, excludeId) {
  const filter = { status: 'confirmed', date, time }
  if (excludeId) filter._id = { $ne: excludeId }
  const reservations = await Reservation.find(filter)
  return reservations.reduce((total, reservation) => total + reservation.guests, 0)
}


export async function hasCapacity(date, time, guests, excludeId) {
  const totalBooked = await getBookedGuests(date, time, excludeId)
  const maxGuests = SCHEDULE.maxGuestsPerSlot
  return totalBooked + guests <= maxGuests
}



export async function getDayAvailability(date, guests) {
  const reservations = await Reservation.find({
    status: 'confirmed',
    date
  })
  const bookedByTime = reservations.reduce((acc, curr) => {
    acc[curr.time] = (acc[curr.time] ?? 0) + curr.guests
    return acc
  }, {})


  const slots = TIME_SLOTS.map(time => {
    const booked = bookedByTime[time] ?? 0
    const remaining = Math.max(0, SCHEDULE.maxGuestsPerSlot - booked)
    const available = isPastSlot(date, time) ? false : (guests <= remaining)
    return { time, available, remaining }
  })
  return slots
} 