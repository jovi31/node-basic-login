const AUTH_PROVIDERS = [
  'local', 'https://accounts.google.com'
]

export default (req, res, next) => {
  const authProvider = req.body.authProvider
  if (authProvider in AUTH_PROVIDERS) {
    next()
  } else {
    req.flash('errors', { nonFieldError: 'Invalid authentication provider!' })
    res.redirect('/signIn')
  }
}