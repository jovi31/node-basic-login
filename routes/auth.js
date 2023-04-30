import express from 'express'
import validator from 'express-validator'

import User from '../models/User.js'
import authController from '../controllers/auth.js'
import isAuth from '../middlewares/isAuth.js'

const { body } = validator

const router = express.Router()

router.get('/signIn', authController.getSignIn)
router.get('/signUp', authController.getSignUp)

router.post('/signIn',
  [
    body('login')
      .notEmpty()
      .withMessage('Username is required'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  authController.postSignIn)

router.post('/signUp',
  [
    body('name')
      .notEmpty().withMessage('Name is required')
      .isLength({ max: 200 }),
    body('email')
      .notEmpty().withMessage('E-mail is required').bail()
      .isEmail().withMessage('Invalid e-mail').bail()
      .isLength({ max: 200 })
      .custom(async (value) => {
        try {
          const user = await User.findOne({ where: { email: value } })
          if (user) {
            return Promise.reject('E-mail already in use')
          }
        } catch (error) {
          return Promise.reject('Erro validating email')
        }
      }),
    body('login')
      .notEmpty().withMessage('Login is required').bail()
      .isAlphanumeric().withMessage('Login: only numbers and characters are allowed').bail()
      .isLength({ max: 50 })
      .custom(async (value) => {
        try {
          const user = await User.findOne({ where: { login: value } })
          if (user) {
            return Promise.reject('Login already in use')
          }
        } catch (error) {
          return Promise.reject('Erro validating login')
        }
      }),
    body('password')
      .notEmpty().withMessage('Password is required').bail()
      .isAlphanumeric().withMessage('Password: only numbers and characters are allowed').bail()
      .isLength({ min: 10 }).withMessage('Passwords must be at least 10 characters in length'),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (req.body.password !== value) {
          throw new Error('Password does not match')
        }
        return true
      })
  ],
  authController.postSignUp)
router.post('/logout', isAuth, authController.postLogout)

export default router