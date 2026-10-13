import mongoose from 'mongoose'
import validator from 'validator'

const reservationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A reservation must have a name'],
    trim: true,
    minlength: [2, 'Name must have at least 2 characters'],
    maxlength: [80, 'Name must have 80 characters or less']
  },
  email: {
    type: String,
    required: [true, 'A reservation must have a contact email address'],
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'A reservation must have a phone number'],
    trim: true
  },
  date: {
    type: String,
    required: [true, 'A reservation must have a date'],
    match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must use the YYYY-MM-DD format']
  },
  time: {
    type: String,
    required: [true, 'A reservation must have a time'],
    match: [/^\d{2}:\d{2}$/, 'Time must use the HH:mm format']
  },
  guests: {
    type: Number,
    required: [true, 'Provide number of guests'],
    min: [1, 'A reservation needs at least 1 guest'],
    max: [10, 'For more than 10 guests, please call the restaurant']
  },
  specialRequest: {
    type: String,
    trim: true,
    maxlength: [300, 'Special request must have 300 characters or less']
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  },
  code: {
    type: String,
    unique: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Para buscar rápido las reservas de un día y horario
reservationSchema.index({ date: 1, time: 1 })

const Reservation = mongoose.model('Reservation', reservationSchema)

export default Reservation
