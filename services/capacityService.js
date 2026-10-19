import Reservation from '../models/reservationModel.js'
import { SCHEDULE } from '../config/schedule.js'



export async function getBookedGuests(date, time) {
  const reservations = await Reservation.find(
    {
      status: 'confirmed',
      date,
      time
    }
  )
  return reservations.reduce((total, reservation) => total + reservation.guests, 0)
}


export async function hasCapacity(date, time, guests) {
  const totalBooked = await getBookedGuests(date, time)
  const maxGuests = SCHEDULE.maxGuestsPerSlot

  return totalBooked + guests <= maxGuests
}
