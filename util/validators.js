import { SCHEDULE, isValidDateString, isClosedDay, isPastSlot, isValidSlot } from "../config/schedule.js"


export function validateGuests(guests) {
  const guestsToNumber = Number(guests)
  const maxGuests = SCHEDULE.maxGuestsPerReservation
  if (!Number.isInteger(guestsToNumber)) return 'Por favor proporciona un número válido de personas'
  if (guestsToNumber < 1) return 'La reservación debe ser para al menos 1 persona'
  if (guestsToNumber > maxGuests) return `Para más de ${maxGuests} personas, por favor llámanos`
  return null
}


export function validateDateTime(date, time) {
  if (!isValidDateString(date)) return 'Formato de fecha incorrecto, usa AAAA-MM-DD'
  if (isClosedDay(date)) return 'El restaurante cierra los lunes, por favor selecciona otro día'
  if (!isValidSlot(time)) return 'El horario seleccionado no está disponible'
  if (isPastSlot(date, time)) return 'Esa fecha u hora ya pasó, por favor selecciona otra'
  return null
}