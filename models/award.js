let mongoose = require('mongoose')

// Award Schema
let articleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
})

let Award = module.exports = mongoose.model('Award', articleSchema)
