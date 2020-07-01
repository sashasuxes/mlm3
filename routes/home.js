const { Router } = require('express')
const router = Router()
const auth = require('../middleware/auth')
const User = require('../models/user')


router.get('/', (req, res) => {
  res.render('index', {
    title: 'Главная страница',
    isHome: true
  })
})


module.exports = router

