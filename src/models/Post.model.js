require('dotenv')
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const { HOST, PORT } = process.env

const Post = mongoose.Schema({
  thumbnail: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: Buffer,
    contentType: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
}, {
  // configurações do mongoose
  toJSON: {
    virtuals: true
  }
})

// função que vai definir a URL da imagem
// esta função não poderá ser escrita em formato arrow function
Post.virtual('thumbnail_url').get(function () {
  const url = `${HOST}:${PORT}`
  return `${url}/files/${this.thumbnail}`
})

Post.plugin(mongoosePaginate)

module.exports = mongoose.model("post", Post)

