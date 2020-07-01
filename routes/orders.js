const { Router } = require('express')
const Order = require('../models/order')
const Tree = require('../models/tree')
const User = require('../models/user')
const Company = require('../models/company')

const auth = require('../middleware/auth')
const router = Router()

router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ 'user.userId': req.user._id })
      .populate('user.userId')

    res.render('orders', {
      isOrder: true,
      title: 'Мои МЛМ-проекты',
      orders: orders.map(o => {
        return {
          ...o._doc,
          minDeposit: o.companies.reduce((total, c) => {
            return total += c.count * c.company.minDeposit
          }, 0)
        }
      })
    })
  } catch (e) {
    console.log(e)
  }
})


router.post('/', auth, async (req, res) => {
  try {

    const { email } = req.body
    const candidate = await User.find({ email }, { _id: true })
    // console.log(candidate)
    // console.log(candidate[0]._id)

    if (candidate) {

      const parentId = candidate[0]._id
      const userId = req.user._id




      const user = await req.user
        .populate('cart.items.companyId')
        .execPopulate()

      const companies = user.cart.items.map(i => ({
        count: i.count,
        company: { ...i.companyId._doc }
      }))

      const companyId = companies[0].company._id
      await Company.findByIdAndUpdate(companyId, { $push: { userId } })

      const usersTree = { userId: userId, parentId: parentId }

      const companyTitle = companies[0].company.title

      // console.log(companies)
      // console.log(usersTree)
      // console.log(userId)




      await Tree.findOneAndUpdate(companyTitle, { $push: { usersTree } })






      // console.log(parentId)
      // const { email } = 2











      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        companies: companies,

      })

      await order.save()





      await req.user.clearCart()

      res.redirect('/orders')
    } else {
      req.flash('inviteError', 'Неверный инвайт-код')
      res.redirect('/cart')
    }

  } catch (e) {
    console.log(e)
  }
})

module.exports = router