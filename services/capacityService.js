import Reservation from '../models/reservationModel.js'
import { SCHEDULE } from '../config/schedule.js'



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
