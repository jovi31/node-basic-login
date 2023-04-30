import { promisify } from 'util'
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

  const errors = getErrorMessages(req)

  if(errors.length > 0) {
    req.flash('errors', errors)
    return res.redirect('/signIn')
  }

  try {
    const user = await User.findOne({ where: { login } })
    const sessionSave = promisify(req.session.save.bind(req.session))

    if (user && await bcrypt.compare(password, user.password)) {
      req.session.userId = user.id
      await sessionSave()
      res.redirect('/')
    } else {
      req.flash('errors', 'Invalid Login or password')
      await sessionSave()
      res.redirect('/signIn')
    }
  } catch (error) {
    next(error)
  }
}

export const postSignUp = async (req, res, next) => {
  const login = req.body.login
  const password = req.body.password
  const name = req.body.name
  const email = req.body.email

  const errors = getErrorMessages(req)

  if(errors.length > 0) {
    req.flash('errors', errors)
    return res.redirect('/signUp')
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password, 12)
    await User.create({ login, password: hashedPassword, name, email })
    res.redirect('/signIn')
  } catch (error) {
    next(error)
  }
}

export const postLogout = async (req, res, next) => {
  const sessionDestroy = promisify(req.session.destroy.bind(req.session))
  
  try {
    await sessionDestroy()
    res.redirect('/signIn')
  } catch (error) {
    next(error)
  }
}

export default {
  getSignIn, getSignUp, postSignIn, postSignUp, postLogout,
}