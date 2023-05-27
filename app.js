import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import flash from 'connect-flash'
import csrfProtection from 'csurf'

import sequelize from './config/database.js'
import sessionStore from './config/sessionStore.js'
import homeRoutes from './routes/home.js'
import authRoutes from './routes/auth.js'
import errorController from './controllers/error.js'
import User from './models/User.js'
import { signInWithGoogle } from './controllers/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store: sessionStore(sequelize)
}))

app.post('/signInWithGoogle', signInWithGoogle)

app.use(csrfProtection())
app.use(flash())

app.use(async (req, res, next) => {
  const userId = req.session.userId

  if (!userId)
    return next()
  
  try {
    const user = await User.findByPk(userId)
    req.user = user
    req.isLoggedIn = true
    next()
  } catch (error) {
    next(error)
  }
})

app.use((req, res, next) => {
  res.locals.isLoggedIn = req.isLoggedIn
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use(homeRoutes)
app.use(authRoutes)

app.use(errorController)

app.use((err, req, res, next) => {
  console.error(err.stack)
  next(err)
})
app.use((err, req, res) => {
  res.status(500)
  res.render('500', {
    pageTitle: 'Error',
    errors: [],
    isLoggedIn: false
  })
})

sequelize.sync()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('Server listen on port ' + process.env.PORT || 3000)
    })
  })