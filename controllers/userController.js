import User from "../models/userModel.js";
import AppError from "../util/appError.js";
import catchAsync from "../util/catchAsync.js";
import * as factory from './handleFactory.js'


export const getAllUser = factory.getAll(User)
export const getUser = factory.getOne(User)



export const updateUser = catchAsync(async (req, res, next) => {

  const allowedFields = ["firstName", "lastName", "email", "nickName", "role"]
  const updates = {}

  for (const field of allowedFields) {
    if (req.body[field] != undefined) updates[field] = req.body[field]
  }
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('Esta ruta no es para actualizar contraseñas', 400))
  }

  const doc = await User.findByIdAndUpdate(req.params.id, updates, {
    returnDocument: 'after',
    runValidators: true
  })
  if (!doc) return next(new AppError('Usuario no encontrado', 404))

  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  })
})



export const getMe = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  })
}
