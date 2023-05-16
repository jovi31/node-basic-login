import { getErrorMessages } from '../utils/error.js'

export const getUserProfile = (req, res) => {
  const errors = req.flash('errors')

  res.render('user', {
    pageTitle: 'User Profile',
    user: {
      name: req.user.name,
      email: req.user.email,
      imgUrl: req.user.imgUrl
    },
    errors
  })
}

export const postUpdateUser = async (req, res, next) => {
  const user = req.user

  const errors = getErrorMessages(req)

  if(Object.keys(errors).length > 0) {
    req.flash('errors', errors)
    return res.redirect('/userProfile')
  }

  try {
    user.name = req.body.name
    user.email = req.body.email
    user.imgUrl = req.body.imgUrl
    await user.save()

    res.redirect('/userProfile')
  } catch (error) {
    next(error)
  }
}

export default {
  getUserProfile, postUpdateUser
}