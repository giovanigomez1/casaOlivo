import express from 'express'
import * as menuController from '../controllers/menuController.js'

const router = express.Router()

router.route('/')
  .get(menuController.getAllItems)

router.route('/:id')
  .get(menuController.getOneItem)

export default router
