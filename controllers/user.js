import { getErrorMessages } from '../utils/error.js'

export const getUserProfile = (req, res) => {
  const errors = req.flash('errors')

  res.render('user', {
    pageTitle: 'User Profile',
    headerTitle: req.user.login,
    user: {
      name: req.user.name,
      email: req.user.email,
      imgUrl: req.user.imgUrl
    },
    errors
  })
}

export const postUpdateUser = async (req, res) => {
  const user = req.user

  let errors = getErrorMessages(req)

  if(errors.length > 0) {
    return res.render('user', {
      pageTitle: 'User Profile',
      headerTitle: user.login,
      user: {
        name: user.name,
        email: user.email,
        imgUrl: user.imgUrl
      },
      errors
    })
  }

  try {
    user.name = req.body.name
    user.email = req.body.email
    user.imgUrl = req.body.imgUrl
    await user.save()

    res.redirect('/userProfile')
  } catch (error) {
    throw error
  }
}

export default {
  getUserProfile, postUpdateUser
}