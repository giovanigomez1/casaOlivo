import MenuItem from '../models/menuModel.js'
import * as factory from './handleFactory.js'

// Público: solo platillos disponibles, agrupados por categoría y nombre
export const getAllItems = factory.getAll(MenuItem, {
  baseFilter: { available: true },
  defaultSort: 'category name'
})
export const getOneItem = factory.getOne(MenuItem)
