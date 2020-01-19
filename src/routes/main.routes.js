require('dotenv/config')
const express = require('express')

const { existsOrError } = require('../utils/validation')
const PostModel = require('../models/Post.model')
const CategoryModel = require('../models/Category.model')

const { HOST, PORT } = process.env

const router = express.Router()

/**
 * Pesquisar posts
 */
router.get('/posts/search', (req, res) => {
  const { value } = req.query

  if (!value) {
    return res.status(400).send({ msg: "Informe um valor para busca" })
  } else {
    const query = { title: new RegExp(value, 'i') }

    PostModel.find(query)
      .then(post => {
        post.length > 0 ? res.send(post) : res.status(404).send({
          msg: "Não foi encontrado nenhum item correspondente a pesquisa!"
        })
      })
      .catch(err => res.status(500).send(err))
  }
})


/**
 * Postagem por slug
 */
router.get('/posts/:slug', (req, res) => {
  PostModel.findOne({ slug: req.params.slug }).populate('category')
    .then(category => {
      // Const que armazena valor do conteúdo convertido de binário em String
      const content = category.content.toString()
      const thumbnail_url = `${HOST}:${PORT}/files/${category._doc.thumbnail}`

      // Res envia dados de category e content convertido
      res.send({ ...category._doc, content, thumbnail_url })
    })
    .catch(err => res.status(500).send(err))
})

/**
 * Postagens por categoria
 */
router.get('/categories/:slug', (req, res) => {
  CategoryModel.findOne({ slug: req.params.slug })
    .then(category => {
      try {
        existsOrError(category, "Esta categoria não existe!")
      } catch (msg) {
        return res.status(400).send(msg)
      }
      const { page = 1 } = req.query

      PostModel.paginate({ category: category._id }, {
        page,
        limit: 5,
        sort: { date: 'desc' }
      })
        .then(post => {
          res.send({ post, category })
        })
        .catch(err => res.status(500).send({ msg: err }))
    })
})

module.exports = router
