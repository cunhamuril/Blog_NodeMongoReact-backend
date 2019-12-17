const express = require('express')
const router = express.Router()

const Category = require('../controllers/Category.controller')

// Rota principal de administrador
router.get('/', (req, res) => {
  res.send("Admin")
})

/**
 * Rotas de categorias
 */
router.get('/categories', Category.findAll)
router.get('/categories/:id', Category.findOne)
router.post('/categories/new', Category.save)
router.put('/categories/:id', Category.update)
router.delete('/categories/:id', Category.remove)

module.exports = router
