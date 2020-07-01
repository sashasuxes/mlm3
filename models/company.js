const { Schema, model } = require('mongoose')

const companySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  minDeposit: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  img: String,
  userId: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
    // ,
    // {
    //   parentId: {
    //     type: Schema.Types.ObjectId,

    //   }
    // }
  ]
})

companySchema.method('toClient', function () {
  const company = this.toObject()

  company.id = company._id
  delete company._id

  return company
})

module.exports = model('Company', companySchema)

