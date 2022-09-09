const express = require('express')
const { body } = require('express-validator/check')

const User = require('../models/User')
const authController = require('../controllers/auth')

const isAuth = require('../middlewares/isAuth')

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
      .custom((value, { req }) => {
        return User.findOne({ where: { email: value } })
          .then(user => {
            if (user) {
              return Promise.reject('E-mail already in use')
            }
          })
      }),
    body('login')
      .notEmpty().withMessage('Login is required').bail()
      .isAlphanumeric().withMessage('Login: only numbers and characters are allowed').bail()
      .isLength({ max: 50 })
      .custom(value => {
        return User.findOne({ where: { login: value } })
          .then(user => {
            if (user) {
              return Promise.reject('Login already in use')
            }
          })
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

module.exports = router