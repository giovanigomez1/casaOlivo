import mongoose from 'mongoose'

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A dish must have a name'],
    trim: true,
    maxlength: [80, 'A dish name must have 80 characters or less']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [300, 'A description must have 300 characters or less']
  },
  price: {
    type: Number,
    required: [true, 'A dish must have a price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'A dish must have a category'],
    enum: {
      values: ['starters', 'mains', 'desserts', 'drinks'],
      message: 'Category must be: starters, mains, desserts or drinks'
    }
  },
  featured: {
    type: Boolean,
    default: false
  },
  available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

const MenuItem = mongoose.model('MenuItem', menuSchema)

export default MenuItem
