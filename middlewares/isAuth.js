export default (req, res, next) => {
  if(!req.isLoggedIn) {
    return res.redirect('/signIn')
  }
  next()
}