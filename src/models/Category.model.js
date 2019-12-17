const mongoose = require('mongoose')

const Category = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
}, {
  timestamps: true // data de criação e data de modificação
})

module.exports = mongoose.model("category", Category)