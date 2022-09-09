require('dotenv').config();

const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const csrfProtection = require('csurf')

const sequelize = require('./utils/database')
const sessionStore = require('./utils/sessionStore')

const homeRoutes = require('./routes/home')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')

const errorController = require('./controllers/error')
const User = require('./models/User')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store: sessionStore
}))
app.use(csrfProtection())
app.use(flash())

app.use((req, res, next) => {
  const userId = req.session.userId
  if (userId) {
    User.findByPk(userId)
      .then(user => {
        req.user = user
        req.isLoggedIn = true
        next()
      })
      .catch(err => next(err))
  } else {
    next()
  }
})

app.use((req, res, next) => {
  res.locals.isLoggedIn = req.isLoggedIn
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use(homeRoutes)
app.use(authRoutes)
app.use(userRoutes)

app.use(errorController)

app.use((err, req, res, next) => {
  console.error(err.stack)
  next(err)
})
app.use((err, req, res) => {
  res.status(500)
  res.render('500', {
    pageTitle: 'Error',
    headerTitle: '',
    errors: [],
    isLoggedIn: false
  })
})

sequelize.sync()
  .then(() => {
    app.listen(process.env.APP_PORT, () => {
      console.log('Server listen on port ' + process.env.APP_PORT)
    })
  })