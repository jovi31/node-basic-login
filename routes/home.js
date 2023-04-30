import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.render('home', {
    pageTitle: 'Home',
    headerTitle: '',
  })
})

export default router