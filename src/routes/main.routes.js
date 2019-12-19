require('dotenv/config')
const express = require('express')

const PostModel = require('../models/Post.model')

const { HOST, PORT } = process.env

const router = express.Router()

/**
 * Rotas de categorias
 */


/**
 * Rotas de postagens
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

module.exports = router
