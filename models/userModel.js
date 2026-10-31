import mongoose from "mongoose";
import validator from 'validator'
import bcrypt from "bcryptjs";



const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Nombre es requerido'],
    minlength: 2,
  },
  lastName: {
    type: String,
    required: [true, 'Apellido es requerido'],
    minlength: 2,
  },
  nickName: {
    type: String,
    required: [true, 'alias es requerido'],
    minlength: 2,
    lowercase: true,
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Email es requerido'],
    lowercase: true,
    validate: [validator.isEmail, 'Por favor ingresa un email valido'],
    unique: true
  },
  role: {
    type: String,
    enum: ['admin', 'clerk'],
    default: 'clerk'
  },
  password: {
    type: String,
    required: [true, 'Por favor ingresa un password'],
    minlength: 6,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [function () { return this.isModified('password') }, 'Por favor confirma el password'],
    validate: {
      validator: function (el) {
        return el === this.password
      },
      message: 'Passwords no coinciden'
    }
  },
  passwordChangedAt: Date
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})


userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 12)
  this.passwordConfirm = undefined
})

userSchema.pre('save', function () {
  if (!this.isModified('password') || this.isNew) return
  this.passwordChangedAt = Date.now() - 1000
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword)
}


userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changeTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
    return JWTTimestamp < changeTimestamp
  }
  return false
}

const User = mongoose.model('User', userSchema)
export default User