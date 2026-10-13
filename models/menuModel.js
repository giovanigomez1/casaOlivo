import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A dish must have a name']
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: [true, 'A dish must have a name'],
    min: 0,
  },
  category: {
    type: String,
    enum: ["starters", "mains", "desserts", "drinks"]
  },
  featured: {
    type: Boolean,
    defaul: false
  },
  available: {
    type: Boolean,
    default: true
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

const MenuItem = mongoose.model('menuItem', menuSchema)

export default MenuItem

