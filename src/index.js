require('dotenv/config')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')

const adminRoutes = require('./routes/admin.routes')

const app = express()

const { DB_URL, PORT, CORS_ORIGIN } = process.env

/**
 * Config 
 */
// Body Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Mongoose
mongoose.Promise = global.Promise
mongoose.connect(DB_URL, {
  useNewUrlParser: true, // configuração padrão do mongoose
  useUnifiedTopology: true, // "           "     "   "  
})
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.log("Error on connect MongoDB"))

// Cors
app.use(cors())


/**
 * Rotas
 */
// responsável por carregar o caminho das imagens
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')))

app.use('/admin', adminRoutes)

/**
 * Outros
 */
const timeNow = new Date()
app.listen(PORT, () => console.log(`${timeNow}\nServer is running on port ${PORT}`))