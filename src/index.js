require('dotenv/config')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const adminRoutes = require('./routes/admin.routes')

const app = express()

const { DB_URL, PORT, CORS_ORIGIN } = process.env

/**
 * Config 
 */
// Cors
app.use(cors())

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


/**
 * Rotas
 */
app.use('/admin', adminRoutes)

/**
 * Outros
 */

const timeNow = new Date()
app.listen(PORT, () => console.log(`${timeNow}\nServer is running on port ${PORT}`))