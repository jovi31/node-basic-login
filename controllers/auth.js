import { promisify } from 'util'
import bcrypt from 'bcryptjs'
import { OAuth2Client } from 'google-auth-library'

import User from '../models/User.js'
import { getErrorMessages } from '../utils/error.js'

export const getSignIn = (req, res) => {
  const [errors = {}] = req.flash('errors')
  const [data = {}] = req.flash('data')

  res.render('signIn', {
    pageTitle: 'Sign in',
    errors,
    data,
  })
}

export const getSignUp = (req, res) => {
  const [errors = {}] = req.flash('errors')
  const [data = {}] = req.flash('data')

  res.render('signUp', {
    pageTitle: 'Sign up',
    errors,
    data,
  })
}

export const postSignIn = async (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

  const errors = getErrorMessages(req)

  if(Object.keys(errors).length > 0) {
    req.flash('errors', errors)
    req.flash('data', { email, password: '' })
    return res.redirect('/signIn')
  }

  try {
    const user = await User.findOne({ where: { email } })
    const sessionSave = promisify(req.session.save.bind(req.session))

    if (user && user.authProvider !== 'local') {
      req.flash('errors', { nonFieldErrors: ['Invalid login option'] })
      await sessionSave()
      return res.redirect('/signIn')
    }

    if (user && await bcrypt.compare(password, user.password)) {
      req.session.userId = user.id
      await sessionSave()
      res.redirect('/')
    } else {
      req.flash('errors', { nonFieldErrors: ['Invalid login or password', 'teste'] })
      await sessionSave()
      res.redirect('/signIn')
    }
  } catch (error) {
    next(error)
  }
}

const verifyIdToken = async (token) => {
  const clientId = process.env.CLIENT_ID
  const client = new OAuth2Client(clientId)
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId
  })
  return ticket.getPayload()
}

export const signInWithGoogle = async (req, res, next) => {
  const sessionSave = promisify(req.session.save.bind(req.session))
  const token = req.body.credential
  try {
    const { iss, email, name } = await verifyIdToken(token)
    let user = await User.findOne({ where: { email } })

    if (user && user.authProvider !== iss) {
      req.flash('errors', { nonFieldErrors: ['Google sign in failed: This account already exists'] })
      await sessionSave()
      return res.redirect('/signIn')
    }

    if (!user) {
      user = await User.create({ email, name, authProvider: iss })
    }

    req.session.userId = user.id
    await sessionSave()
    return res.redirect('/')

  } catch (error) {
    req.flash('errors', { nonFieldErrors: ['Google sign in failed!']})
    await sessionSave()
    res.redirect('/signIn')
  }
}

export const postSignUp = async (req, res, next) => {
  const password = req.body.password
  const name = req.body.name
  const email = req.body.email

  const errors = getErrorMessages(req)

  if(Object.keys(errors).length > 0) {
    req.flash('errors', errors)
    req.flash('data', { name, email })
    return res.redirect('/signUp')
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password, 12)
    await User.create({ password: hashedPassword, name, email })
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
  getSignIn, getSignUp, postSignIn, signInWithGoogle, postSignUp, postLogout,
}
