import express from "express";
import * as itemController from '../controllers/menuController.js'


const router = express.Router()

router.route('/')
  .get(itemController.getAllitems)
router.route('/:id')
  .get(itemController.getOneItem)


export default router
