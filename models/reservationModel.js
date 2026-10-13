import mongoose from "mongoose";
import validator from 'validator'

const reservationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A reservation must have a name']
  },
  email: {
    type: String,
    required: [true, 'A reservaton must have a contact email address'],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valide email"]
  },
  phone: {
    type: String,
    required: [true, 'A reservaton must have a phone number']
  },
  date: {
    type: String,
    required: [true, 'A reservaton must have a date']
  },
  time: {
    type: String,
    required: [true, 'A reservaton must have a time']
  },
  guests: {
    type: Number,
    required: [true, 'Provide number of guests'],
    min: 1,
    max: 10
  },
  specialRequest: {
    type: String
  },
  status: {
    type: String,
    enum: ["confirmed", "cancelled"],
    default: "confirmed"
  },
  code: {
    type: String,
    unique: true
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true
})

const Reservation = mongoose.model('reservations', reservationSchema)

export default Reservation