import express from 'express'
import validator from 'express-validator'

import User from '../models/User.js'
import authController from '../controllers/auth.js'
import isAuth from '../middlewares/isAuth.js'
import authProvider from '../middlewares/authProvider.js'
import { noSpaces } from '../utils/validation.js'

const { body } = validator

const router = express.Router()

router.get('/signIn', authController.getSignIn)
router.get('/signUp', authController.getSignUp)

router.post('/signIn',
  [
    body('email')
      .notEmpty().withMessage('E-mail is required').bail()
      .isEmail().withMessage('Invalid e-mail'),
    body('password')
      .notEmpty().withMessage('Password is required')
  ],
  authController.postSignIn)

router.post('/signInWithGoogle', authController.signInWithGoogle)

router.post('/signUp',
  [
    authProvider,
    body('name')
      .notEmpty().withMessage('Name is required').bail()
      .isLength({ max: 200 }),
    body('email')
      .notEmpty().withMessage('E-mail is required').bail()
      .isEmail().withMessage('Invalid e-mail').bail()
      .isLength({ max: 200 }).withMessage('Exceeded the 200 character limit').bail()
      .custom(async (value) => {
        try {
          const user = await User.findOne({ where: { email: value } })
          if (user) {
            return Promise.reject('E-mail already in use')
          }
        } catch (error) {
          return Promise.reject('Error validating email')
        }
      }),
    body('password')
      .notEmpty().withMessage('Password is required').bail()
      .custom(noSpaces).withMessage('No spaces are allowed in the password').bail()
      .isAlphanumeric().withMessage('Only numbers and characters are allowed').bail()
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