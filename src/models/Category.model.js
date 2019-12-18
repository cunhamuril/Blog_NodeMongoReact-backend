const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

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

Category.plugin(mongoosePaginate)

module.exports = mongoose.model("category", Category)