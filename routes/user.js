const express = require('express')
const { not } = require('sequelize').Op
const { body } = require('express-validator/check')


const User = require('../models/User')
const userController = require('../controllers/user')
const isAuth = require('../middlewares/isAuth')

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
      .custom((value, { req }) => {
        return User.findOne({ where: { email: value, [not]: { id: req.user.id } } })
          .then(user => {
            if (user) {
              return Promise.reject('E-mail already in use')
            }
          })
      })
  ], userController.postUpdateUser)

module.exports = router