import express from 'express'
import { Op } from 'sequelize'
import validator from 'express-validator'

import User from '../models/User.js'
import userController from '../controllers/user.js'
import isAuth from '../middlewares/isAuth.js'

const { body } = validator

const router = express.Router()

router.get('/userProfile', isAuth, userController.getUserProfile)

router.post('/updateUser', isAuth,
  [
    body('name')
      .notEmpty().withMessage('Name is required')
      .isLength({ max: 200 }),
    body('email')
      .notEmpty().withMessage('E-mail is required').bail()
      .isEmail().withMessage('Invalid e-mail').bail()
      .isLength({ max: 200 })
      .custom(async (value, { req }) => {
        try {
          const user = await User.findOne({ where: { email: value, [Op.not]: { id: req.user.id } } })
          if (user) {
            return Promise.reject('E-mail already in use')
          }
        } catch (error) {
          return Promise.reject('Error validating email')
        }
      })
  ], userController.postUpdateUser)

export default router