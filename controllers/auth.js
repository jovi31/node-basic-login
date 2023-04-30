import bcrypt from 'bcryptjs'

import User from '../models/User.js'
import { getErrorMessages } from '../utils/error.js'

export const getSignIn = (req, res) => {
  const errors = req.flash('errors')

  res.render('signIn', {
    pageTitle: 'Sign in',
    headerTitle: '',
    errors
  })
}

export const getSignUp = (req, res) => {
  const errors = req.flash('errors')

  res.render('signUp', {
    pageTitle: 'Sign up',
    headerTitle: '',
    errors
  })
}

export const postSignIn = async (req, res, next) => {
  const login = req.body.login
  const password = req.body.password

  let errors = getErrorMessages(req)

  if(errors.length > 0) {
    return res.render('signIn', {
      pageTitle: 'Sign in',
      headerTitle: '',
      errors
    })
  }

  try {
    const user = await User.findOne({ where: { login } })

    let success = user &&
      await bcrypt.compare(password, user.password)

    if (success) {
      req.session.userId = user.id
      req.session.save(err => {
        if (!err) {
          res.redirect('/')
        } else {
          next(err)
        }
      })
    } else {
      req.flash('errors', 'Invalid Login or password')
      req.session.save(err => {
        if (!err) {
          res.redirect('/signIn')
        } else {
          next(err)
        }
      })
    }
  } catch (error) {
    throw error
  }
}

export const postSignUp = (req, res, next) => {
  const login = req.body.login
  const password = req.body.password
  const name = req.body.name
  const email = req.body.email

  let errors = getErrorMessages(req)

  if(errors.length > 0) {
    return res.render('signUp', {
      pageTitle: 'Sign up',
      headerTitle: '',
      errors
    })
  }

  bcrypt.hash(password, 12)
    .then(hashedPassword => {
      return User.create({
        login,
        password: hashedPassword,
        name,
        email
      })
    })
    .then(() => {
      res.redirect('/signIn')
    })
    .catch(next)
}

export const postLogout = (req, res, next) => {
  req.session.destroy(err => {
    if (!err) {
      res.redirect('/signIn')
    } else {
      next(err)
    }
  })
}

export default {
  getSignIn, getSignUp, postSignIn, postSignUp, postLogout,
}