const { Router } = require('express')
const { validationResult } = require('express-validator/check')
const Company = require('../models/company')
const auth = require('../middleware/auth')
const { companyValidators } = require('../utils/validators')
const router = Router()

function isOwner(company, req) {
  return company.userId.toString() === req.user._id.toString()
}

router.get('/', async (req, res) => {
  try {
    const companies = await Company.find()
      .populate('userId', 'email name')
      .select('minDeposit description title img')

    res.render('companies', {
      title: 'MLM-проекты',
      isCompanies: true,
      userId: req.user ? req.user._id.toString() : null,
      companies
    })
  } catch (e) {
    console.log(e)
  }
})

router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/')
  }

  try {
    const company = await Company.findById(req.params.id)
    if (!isOwner(company, req)) {
      return res.redirect('/companies')
    }

    res.render('company-edit', {
      title: `Редактировать ${company.title}`,
      company
    })
  } catch (e) {
    console.log(e)
  }
})

router.post('/edit', auth, companyValidators, async (req, res) => {
  const errors = validationResult(req)
  const { id } = req.body

  if (!errors.isEmpty()) {
    return res.status(422).redirect(`/companies/${id}/edit?allow=true`)
  }

  try {
    delete req.body.id
    const company = await Company.findById(id)
    if (!isOwner(company, req)) {
      return res.redirect('/companies')
    }
    Object.assign(company, req.body)
    await company.save()
    res.redirect('/companies')
  } catch (e) {
    console.log(e)
  }
})

router.post('/remove', auth, async (req, res) => {
  try {
    await Company.deleteOne({
      _id: req.body.id,
      userId: req.user._id
    })
    res.redirect('/companies')
  } catch (e) {
    console.log(e)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
    res.render('company', {
      layout: 'empty',
      title: `MLM-проект ${company.title}`,
      company
    })
  } catch (e) {
    console.log(e)
  }
})

module.exports = router

