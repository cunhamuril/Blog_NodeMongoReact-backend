const Category = require('../models/Category.model')

const { existsOrError, notExistsOrError } = require('./validation')

module.exports = {
  save: (req, res) => {
    const { name, slug } = req.body

    const category = new Category({ name, slug })

    // Validação
    try {
      existsOrError(name, "Informe um nome para a categoria!")
      existsOrError(slug, "Informe um slug válido!")
    } catch (msg) {
      return res.status(400).send(msg)
    }

    category.save()
      .then(() => res.send({ msg: "Categoria adicionada com sucesso!" }))
      .catch(err => res.status(500).send({ error: err }))
  },

  findAll: (req, res) => {
    // find com ordenação pela data, do mais novo para o mais antigo
    Category.find().sort({ createdAt: 'desc' })
      .then(category => res.send(category))
      .catch(err => res.status(500).send({ msg: err }))
  },

  findOne: (req, res) => {
    Category.findOne({ _id: req.params.id })
      .then(category => res.send(category))
      .catch(err => res.status(400).send({ msg: err }))
  },

  update: (req, res) => {
    const { name, slug } = req.body

    try {
      existsOrError(name, "Informe um nome para a categoria!")
      existsOrError(slug, "Informe um slug válido!")
    } catch (msg) {
      return res.status(400).send(msg)
    }

    Category.findOne({ _id: req.params.id })
      .then(category => {
        category.name = name
        category.slug = slug

        category.save()
          .then(() => res.send({ msg: "Categoria editada com sucesso!" }))
          .catch(err => res.send({ error: err }))
      })
  },

  remove: (req, res) => {
    const { id } = req.params

    Category.deleteOne({ _id: id })
      .then(() => res.send({ msg: "Categoria deletada com sucesso! " }))
      .catch(err => res.status(500).send({ error: err }))
  }
}