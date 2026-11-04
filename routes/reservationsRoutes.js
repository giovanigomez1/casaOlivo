import express from "express";
import * as reservationsController from '../controllers/reservationController.js'
import * as authController from '../controllers/authController.js'

const router = express.Router()






router.route('/')
  .post(reservationsController.validateReservationDetails, reservationsController.createReservation)

router.route('/availability')
  .get(reservationsController.getAvailability)


router.use(authController.protect)
router.route('/')
  .get(reservationsController.getAllReservations)

router.route('/:id')
  .get(reservationsController.getReservation)


router.use(authController.restrictTo('admin'))
router.route('/:id')
  .patch(reservationsController.validateReservationUpdate, reservationsController.updateReservation)



export default router