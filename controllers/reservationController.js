import Reservation from '../models/reservationModel.js'
import * as factory from './handleFactory.js'
import { getBookedGuests } from '../services/capacityService.js'


export const getAllReservations = factory.getAll(Reservation)



