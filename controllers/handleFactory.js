import catchAsync from "../util/catchAsync.js";
import AppError from "../util/appError.js";
import ApiFeatures from "../util/apiFeatures.js";


export const getAll = Model => catchAsync(async (req, res, next) => {
  let filter = {}

  const features = new ApiFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination()
  const docs = await features.query
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