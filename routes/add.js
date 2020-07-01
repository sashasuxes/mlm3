const { Router } = require('express')
const { validationResult } = require('express-validator/check')
const Company = require('../models/company')
const Tree = require('../models/tree')

const auth = require('../middleware/auth')
const { companyValidators } = require('../utils/validators')
const router = Router()

router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'Добавить MLM-проект',
    isAdd: true
  })
})

router.post('/', auth, companyValidators, async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('add', {
      title: 'Добавить MLM-проект',
      isAdd: true,
      error: errors.array()[0].msg,
      data: {
        title: req.body.title,
        description: req.body.description,
        minDeposit: req.body.minDeposit,
        img: req.body.img
      }
    })
  }

  const company = new Company({
    title: req.body.title,
    description: req.body.description,
    minDeposit: req.body.minDeposit,
    img: req.body.img,
    userId: req.user
  })
  try {
    await company.save()

    // res.redirect('/companies')
  } catch (e) {
    console.log(e)
  }
  const title = req.body.title
  const needCompanyId = await Company.find({ title }, { _id: true })

  const companyId = needCompanyId[0]._id
  const tree = new Tree({
    usersTree:
      [{
        userId: req.user,
        parentId: null
      }],
    companyId
  })


  try {
    await tree.save()

    res.redirect('/companies')


  } catch (e) {
    console.log(e)
  }



})

module.exports = router


