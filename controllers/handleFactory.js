import catchAsync from "../util/catchAsync.js";
import AppError from "../util/appError.js";
import ApiFeatures from "../util/apiFeatures.js";


// options.baseFilter: condiciones fijas que el cliente no puede cambiar
//   (ej. { available: true } para el menú público)
// options.defaultSort: orden por defecto si no viene ?sort=
export const getAll = (Model, options = {}) => catchAsync(async (req, res, next) => {
  const { baseFilter = {}, defaultSort } = options

  const features = new ApiFeatures(Model.find(), req.query, defaultSort)
    .filter()
    .sort()
    .limitFields()
    .pagination()

  // Se aplica al final para que ?available=false no pueda sobrescribirlo
  const docs = await features.query.find(baseFilter)
  res.status(200).json({
    status: 'success',
    results: docs.length,
    data: {
      data: docs
    }
  })
})

export const getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
  let query = Model.findById(req.params.id)
  if (popOptions) query = query.populate(popOptions)

  const doc = await query
  if (!doc) {
    return next(new AppError('No doc found with that id', 404))
  }
  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  })
})