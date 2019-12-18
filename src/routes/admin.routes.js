const express = require('express')
const multer = require('multer')
const uploadConfig = require('../config/upload')

const CategoryController = require('../controllers/Category.controller')
const PostController = require('../controllers/Post.controller')

const router = express.Router()
const upload = multer(uploadConfig)

/**
 * Rotas de categorias
 */
router.get('/categories', CategoryController.findAll)
router.get('/categories/:id', CategoryController.findOne)
router.post('/categories', CategoryController.save)
router.put('/categories/:id', CategoryController.update)
router.delete('/categories/:id', CategoryController.remove)

/**
 * Rotas de postagens
 */
router.get('/posts', PostController.findAll)
router.get('/posts/:id', PostController.findOne)
router.post('/posts', upload.single('thumbnail'), PostController.save)
router.patch('/posts/:id', upload.single('thumbnail'), PostController.update)
router.delete('/posts/:id', PostController.remove)

module.exports = router
