import Reservation from '../models/reservationModel.js'
import * as factory from './handleFactory.js'
import catchAsync from '../util/catchAsync.js'
import AppError from '../util/appError.js'
import { isValidDateString, isClosedDay, isValidSlot, isPastSlot, SCHEDULE } from '../config/schedule.js'
import { hasCapacity, getDayAvailability } from '../services/capacityService.js'
import generateCode from '../util/generateCode.js'
import { validateGuests, validateDateTime } from '../util/validators.js'


export const getAllReservations = factory.getAll(Reservation, { defaultSort: 'date time' })
export const getReservation = factory.getOne(Reservation)


export const createReservation = catchAsync(async (req, res, next) => {
  const { date, time, guests, name, email, phone, specialRequest } = req.body

  const guestsToNumber = Number(guests)
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




export const validateReservationDetails = catchAsync(async (req, res, next) => {
  const { date, time, guests } = req.body

  const dateTimeError = validateDateTime(date, time)
  if (dateTimeError) return next(new AppError(dateTimeError, 400))

  const guestsToNumber = Number(guests)

  const guestError = validateGuests(guestsToNumber)
  if (guestError) return next(new AppError(guestError, 400))

  if (!(await hasCapacity(date, time, guestsToNumber))) {
    return next(new AppError('Ya no hay lugares disponibles en ese horario, por favor elige otro', 409))
  }
  next()
})



export const validateReservationUpdate = catchAsync(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.id)
  if (!reservation) return next(new AppError('Reservación no encontrada', 404))
  req.reservation = reservation


  const date = req.body.date ?? reservation.date
  const time = req.body.time ?? reservation.time
  const guests = Number(req.body.guests ?? reservation.guests)
  const status = req.body.status ?? reservation.status


  const changed = date !== reservation.date || time !== reservation.time || Number(guests) !== reservation.guests
  const reactivating = reservation.status === 'cancelled' && status === 'confirmed'


  if (changed || reactivating) {

    const dateTimeError = validateDateTime(date, time)
    if (dateTimeError) return next(new AppError(dateTimeError, 400))

    const guestsToNumber = Number(guests)
    const guestError = validateGuests(guestsToNumber)
    if (guestError) return next(new AppError(guestError, 400))

    if (status === 'confirmed' && !(await hasCapacity(date, time, guestsToNumber, req.params.id))) {
      return next(new AppError('Ya no hay lugares disponibles en ese horario, por favor elige otro', 409))
    }
  }

  next()
})




export const updateReservation = catchAsync(async (req, res, next) => {
  const allowedFields = ['name', 'email', 'phone', 'date', 'time', 'guests', 'specialRequest', 'status']

  const updates = {}
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) updates[field] = req.body[field]
  }

  Object.assign(req.reservation, updates)
  await req.reservation.save()

  res.status(200).json({
    status: 'success',
    data: {
      data: req.reservation
    }
  })
})



export const getAvailability = catchAsync(async (req, res, next) => {
  const { date, guests } = req.query

  if (!isValidDateString(date)) return next(new AppError('Formato de fecha incorrecto, usa AAAA-MM-DD', 400))
  if (isClosedDay(date)) return next(new AppError('El restaurante cierra los lunes, por favor selecciona otro día', 400))

  const guestsToNumber = Number(!guests ? 1 : guests)
  const guestError = validateGuests(guestsToNumber)
  if (guestError) return next(new AppError(guestError, 400))

  const slots = await getDayAvailability(date, guestsToNumber)

  if (isClosedDay(date)) {
    return res.status(200).json({
      status: 'success',
      data: {
        date,
        closed: true,
        slots: []
      }
    })
  }
  res.status(200).json({
    status: 'success',
    data: {
      date,
      slots
    }
  })
})