import { promisify } from 'util'
import User from '../models/userModel.js'
import catchAsync from '../util/catchAsync.js'
import jwt from 'jsonwebtoken'
import AppError from '../util/appError.js'


const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}


const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id)
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: 'lax',
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  }
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true
  res.cookie('jwt', token, cookieOptions)
  if (user) user.password = undefined
  res.status(statusCode).json({
    status: 'success',
    data: {
      data: {
        user
      }
    }
  })
}


export const createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    nickName: req.body.nickName,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  })

  newUser.password = undefined
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser
    }
  })
})



export const login = catchAsync(async (req, res, next) => {
  const { email, password, nickName } = req.body

  if ((!email && !nickName) || !password) return next(new AppError('Por favor ingresa un correo o nickname y contraseña', 400))

  const lowerEmail = email?.toLowerCase()
  const lowerNickName = nickName?.toLowerCase()

  let user
  if (lowerEmail) user = await User.findOne({ email: lowerEmail }).select('+password')
  if (lowerNickName) user = await User.findOne({ nickName: lowerNickName }).select('+password')

  if (!user || !await user.correctPassword(password, user.password)) return next(new AppError('Usuario o contraseña incorrecto', 401))

  createSendToken(user, 200, req, res)
})

export const logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', '', {
    expires: new Date(0),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    sameSite: 'lax'
  })
  res.status(200).json({ status: 'success' })
})


export const protect = catchAsync(async (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt
  }

  if (!token) {
    return next(new AppError('Inicia sesión para continuar', 401))
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
  const currentUser = await User.findById(decoded.id)

  if (!currentUser) {
    return next(new AppError('El usuario asignado a este token no existe', 401))
  }
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(new AppError('El usuario cambió recientemente su password, inicia sesión de nuevo', 401))
  }
  req.user = currentUser
  next()
})


// export const isLoggedIn = async (req, res, next) => {
//   const token = req.cookies.jwt

//   if (!token) {
//     res.status(200).json({
//       status: 'success',
//       data: {
//         user: null
//       }
//     })
//   }

//   const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)
//   const currentUser = await User.findById(decoded.id)

//   if (!currentUser) {
//     res.status(200).json({
//       status: 'success',
//       data: {
//         user: null
//       }
//     })
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       user: currentUser
//     }
//   })
// }




export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('No tienes permiso para realizar esta acción', 403))
    }
    next()
  }
}



export const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password')

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('La contraseña actual es incorrecta', 401))
  }
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  await user.save()
  createSendToken(user, 200, req, res)
})


