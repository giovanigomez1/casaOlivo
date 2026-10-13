import MenuItem from "../models/menuModel.js";
import * as factory from './handleFactory.js'

export const getAllItems = factory.getAll(MenuItem)
export const getOneItem = factory.getOne(MenuItem)

