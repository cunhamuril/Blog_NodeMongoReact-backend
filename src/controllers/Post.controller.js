require('dotenv/config')
const PostModel = require('../models/Post.model')

const { existsOrError } = require('./validation')

const { HOST, PORT } = process.env

module.exports = {
  save: (req, res) => {
    // condição que vai verificar se tem file ou não
    const filename = req.file ? req.file.filename : "default-image.png"
    const { title, slug, description, content, category } = req.body

    const post = new PostModel({
      thumbnail: filename,
      title,
      slug,
      description,
      content,
      category
    })

    try {
      existsOrError(title, "Informe um título!")
      existsOrError(slug, "Informe um slug válido!")
      existsOrError(description, "Informe uma descrição!")
      existsOrError(content, "Informe um conteúdo!")
      existsOrError(category, "Informe uma categoria!")
    } catch (msg) {
      return res.status(400).send(msg)
    }

    post.save()
      .then(() => res.send({ msg: "Postagem adicionada com sucesso! " }))
      .catch(err => res.status(500).send(err))
  },

  findAll: (req, res) => {
    const { page = 1 } = req.query

    PostModel.paginate({}, {
      page,
      limit: 5,
      populate: 'category',
      sort: { date: 'desc' },
    })
      .then(posts => res.send(posts))
      .catch(err => res.status(500).send(err))
  },

  findOne: (req, res) => {
    PostModel.findOne({ _id: req.params.id })
      .then(category => {
        // Const que armazena valor do conteúdo convertido de binário em String
        const content = category.content.toString()
        const thumbnail_url = `${HOST}:${PORT}/files/${category._doc.thumbnail}`

        // Res envia dados de category e content convertido
        res.send({ ...category._doc, content, thumbnail_url })
      })
      .catch(err => res.status(500).send(err))
  },

  update: (req, res) => {
    // condição que vai verificar se tem file ou não
    const filename = req.file ? req.file.filename : null
    const { title, slug, description, content, category } = req.body

    try {
      existsOrError(title, "Informe um título!")
      existsOrError(slug, "Informe um slug válido!")
      existsOrError(description, "Informe uma descrição!")
      existsOrError(content, "Informe um conteúdo!")
      existsOrError(category, "Informe uma categoria!")
    } catch (msg) {
      return res.status(400).send(msg)
    }

    PostModel.findOne({ _id: req.params.id })
      .then(post => {
        // condição que verifica existencia de file. Se não tiver, mantém o mesmo arquivo
        post.thumbnail = filename ? filename : post.thumbnail
        post.title = title
        post.slug = slug
        post.description = description
        post.content = content
        post.category = category

        post.save()
          .then(() => res.send({ msg: "Post editado com sucesso!" }))
          .catch(err => res.status(500).send(err))
      })
  },

  remove: (req, res) => {
    const { id } = req.params

    PostModel.deleteOne({ _id: id })
      .then(() => res.send({ msg: "Post deletado com sucesso!" }))
      .catch(err => res.status(500).send(err))
  }
}