const { Router } = require('express')
const User = require('../models/user')
const Company = require('../models/company')
const { validationResult } = require('express-validator/check')
const { inviteValidators } = require('../utils/validators')

const auth = require('../middleware/auth')
const router = Router()


function mapCartItems(cart) {
  return cart.items.map(c => ({
    ...c.companyId._doc,
    id: c.companyId.id,
    count: c.count
  }))
}

function computePrice(companies) {
  return companies.reduce((total, company) => {
    return total += company.minDeposit * company.count
  }, 0)
}



router.post('/add', auth, async (req, res) => {
  const company = await Company.findById(req.body.id)
  await req.user.addToCart(company)
  res.redirect('/cart')
})



router.get('/', auth, async (req, res) => {
  const user = await req.user
    .populate('cart.items.companyId')
    .execPopulate()

  const companies = mapCartItems(user.cart)

  res.render('cart', {
    title: 'Корзина',
    isCart: true,
    companies: companies,
    minDeposit: computePrice(companies),
    inviteError: req.flash('inviteError')
  })
})

router.delete('/remove/:id', auth, async (req, res) => {
  await req.user.removeFromCart(req.params.id)
  const user = await req.user.populate('cart.items.companyId').execPopulate()
  const companies = mapCartItems(user.cart)
  const cart = {
    companies, minDeposit: computePrice(companies)
  }
  res.status(200).json(cart)
})
module.exports = router

