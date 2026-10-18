import express from "express";
import * as reservationsController from '../controllers/reservationController.js'

const router = express.Router()


router.route('/')
  .get(reservationsController.getAllReservations)
// .post(reservationsController.createReservation)



export default router