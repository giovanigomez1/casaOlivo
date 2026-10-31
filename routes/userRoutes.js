import express from 'express'
import * as userController from '../controllers/userController.js'
import * as authController from '../controllers/authController.js'


const router = express.Router()


router.post('/logout', authController.logout)
router.post('/login', authController.login)


router.use(authController.protect)

router.patch('/updateMyPassword', authController.updatePassword)
router.get('/me', userController.getMe)


router.use(authController.restrictTo('admin'))
router.post('/createUser', authController.createUser)
router.route('/')
  .get(userController.getAllUser)
router.route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)

export default router