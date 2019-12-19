const CategoryModel = require('../models/Category.model')

const { existsOrError } = require('./validation')

module.exports = {
  save: (req, res) => {
    const { name, slug } = req.body

    const category = new CategoryModel({ name, slug })

    // Validação
    try {
      existsOrError(name, "Informe um nome para a categoria!")
      existsOrError(slug, "Informe um slug válido!")
    } catch (msg) {
      return res.status(400).send(msg)
    }

    category.save()
      .then(() => res.send({ msg: "Categoria adicionada com sucesso!" }))
      .catch(err => res.status(500).send(err))
  },

  index: (req, res) => {
    const { page = 1 } = req.query

    CategoryModel.paginate({}, { page, limit: 10, sort: { createdAt: 'desc' } })
      .then(categories => res.send(categories))
      .catch(err => res.status(500).send(err))
  },

  findAll: (req, res) => {
    CategoryModel.find()
      .then(categories => res.send(categories))
      .catch(err => res.status(500).send(err))
  },

  findOne: (req, res) => {
    CategoryModel.findOne({ _id: req.params.id })
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

    CategoryModel.findOne({ _id: req.params.id })
      .then(category => {
        category.name = name
        category.slug = slug

        category.save()
          .then(() => res.send({ msg: "Categoria editada com sucesso!" }))
          .catch(err => res.status(500).send(err))
      })
  },

  remove: (req, res) => {
    const { id } = req.params

    CategoryModel.deleteOne({ _id: id })
      .then(() => res.send({ msg: "Categoria deletada com sucesso! " }))
      .catch(err => res.status(500).send(err))
  }
}