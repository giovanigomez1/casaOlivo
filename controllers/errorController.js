import AppError from "../util/appError.js";

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`
  return new AppError(message, 400)
}

const handleDuplicateFieldsDB = err => {
  const [field, value] = Object.entries(err.keyValue)[0]
  const message = `Duplicate value for ${field}: ${value}. Please use another value`
  return new AppError(message, 400)
}

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message)

  const message = `Invalid input data: ${errors.join('. ')}`
  return new AppError(message, 400)
}

const handleJWTError = () => new AppError('Invalid token, please log in again.', 401)
const handleJWTExpiredError = () => new AppError('Token has expired, please log in again.', 401)

const sendErrorDev = (err, req, res) => {
  //API A)
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    })
  }
  // B) Rutas fuera de /api: responder JSON (no hay motor de vistas configurado)
  console.error('ERROR :( ', err)
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  })
}


const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    // A) API
    // Operational. trusted error: send message to client
    console.log(err)
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      })

      //Programing or other unknown error: do not leak error details
    }
    //1) Log error
    console.error('ERROR :( ', err)
    //2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong'
    })
  }
  // B) Rutas fuera de /api: responder JSON (no hay motor de vistas configurado)
  if (err.isOperational) {
    return res.status(err.statusCode).json({ status: err.status, message: err.message })
  }
  console.error('ERROR :( ', err)
  return res.status(500).json({ status: 'error', message: 'Please try again later' })
}


export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  // Convertir errores conocidos (Mongoose, JWT) en errores operacionales con su código correcto.
  // Se hace en TODOS los ambientes, para que en desarrollo también veas 400 en lugar de 500.
  let error = err
  if (err.name === 'CastError') error = handleCastErrorDB(err)
  if (err.code === 11000) error = handleDuplicateFieldsDB(err)
  if (err.name === 'ValidationError') error = handleValidationErrorDB(err)
  if (err.name === 'JsonWebTokenError') error = handleJWTError()
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError()

  if (process.env.NODE_ENV === 'development') {
    // En desarrollo mandamos también el error original y el stack para depurar
    error.stack = err.stack
    sendErrorDev(error, req, res)
  } else {
    // production o NODE_ENV sin definir: nunca dejar la petición sin respuesta
    sendErrorProd(error, req, res)
  }
}
