import Reservation from '../models/reservationModel.js'
import * as factory from './handleFactory.js'
import catchAsync from '../util/catchAsync.js'
import AppError from '../util/appError.js'
import { isValidDateString, isClosedDay, isValidSlot, isPastSlot, SCHEDULE } from '../config/schedule.js'
import { hasCapacity } from '../services/capacityService.js'
import generateCode from '../util/generateCode.js'

export const getAllReservations = factory.getAll(Reservation)
export const getReservation = factory.getOne(Reservation)

export const createReservation = catchAsync(async (req, res, next) => {
  const { date, time, guests, name, email, phone, specialRequest } = req.body

  // 1) Fecha y hora (no consultan la base de datos)
  if (!isValidDateString(date)) return next(new AppError('Formato de fecha incorrecto, usa AAAA-MM-DD', 400))
  if (isClosedDay(date)) return next(new AppError('El restaurante cierra los lunes, por favor selecciona otro día', 400))
  if (!isValidSlot(time)) return next(new AppError('El horario seleccionado no está disponible', 400))
  if (isPastSlot(date, time)) return next(new AppError('Esa fecha u hora ya pasó, por favor selecciona otra', 400))

  // 2) Número de personas
  const guestsToNumber = Number(guests)
  const maxGuests = SCHEDULE.maxGuestsPerReservation
  if (!Number.isInteger(guestsToNumber)) return next(new AppError('Por favor proporciona un número válido de personas', 400))
  if (guestsToNumber < 1) return next(new AppError('La reservación debe ser para al menos 1 persona', 400))
  if (guestsToNumber > maxGuests) return next(new AppError(`Para más de ${maxGuests} personas, por favor llámanos`, 400))

  // 3) Cupo (sí consulta la base de datos, por eso va al final)
  if (!(await hasCapacity(date, time, guestsToNumber))) {
    return next(new AppError('Ya no hay lugares disponibles en ese horario, por favor elige otro', 409))
  }

  // 4) Crear la reservación
  const code = generateCode()
  const doc = await Reservation.create({
    name,
    email,
    phone,
    date,
    time,
    guests: guestsToNumber,
    specialRequest,
    code
  })

  res.status(201).json({
    status: 'success',
    data: {
      data: doc
    }
  })
})
