const express = require('express')
const multer = require('multer')
const uploadConfig = require('../config/upload.config')

const CategoryController = require('../controllers/Category.controller')
const PostController = require('../controllers/Post.controller')
const UserController = require('../controllers/User.crontroller')
const AuthController = require('../controllers/Auth.controller')

const validateToken = require('../middlewares/validateToken')

const router = express.Router()
const upload = multer(uploadConfig)

/**
 * Rotas de categorias
 */
router.post('/categories', validateToken, CategoryController.save)
router.put('/categories/:id', validateToken, CategoryController.update)
router.delete('/categories/:id', validateToken, CategoryController.remove)
// rotas não administrativas
router.get('/categories', CategoryController.index)
router.get('/categories/all', CategoryController.findAll)
router.get('/categories/:id', CategoryController.findOne)

/**
 * Rotas de postagens
 */
router.post('/posts', validateToken, upload.single('thumbnail'), PostController.save)
router.patch('/posts/:id', validateToken, upload.single('thumbnail'), PostController.update)
router.delete('/posts/:id', validateToken, PostController.remove)
// rotas não administrativas
router.get('/posts', PostController.findAll)
router.get('/posts/:id', PostController.findOne)

/**
 * Rotas de usuários
 */
router.get('/users/:id', validateToken, UserController.findOne)
router.post('/users', UserController.save) // não administrativa
router.patch('/users/:id', validateToken, UserController.update)
router.delete('/users/:id', validateToken, UserController.remove)

// Autenticação
router.post('/signin', AuthController.signin)
router.get('/verifytoken', AuthController.verifyToken)

module.exports = router
