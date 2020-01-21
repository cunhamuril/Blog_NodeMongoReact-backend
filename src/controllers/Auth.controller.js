require('dotenv/config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const UserModel = require('../models/User.model')

const { existsOrError } = require('../utils/validation')
const getToken = require('../utils/getToken')

const { JWT_KEY } = process.env

module.exports = {
  signin: (req, res) => {
    /**
     * Receber email e senha
     * Procurar usuário
     * gerar token
     */

    const { username, password } = req.body

    try {
      existsOrError((username), "Informe um e-mail ou username")
      existsOrError(password, "Informe a senha!")
    } catch (msg) {
      return res.status(400).send(msg)
    }

    UserModel.findOne({ $or: [{ email: username }, { username }] })
      .then(user => {
        // Verificar existencia de usuário
        if (!user) return res.status(400).send({ msg: "Usuário não encontrado!" })

        // Verificar autenticação
        bcrypt.compare(password, user.password)
          .then(auth => {
            if (!auth) return res.status(401).send({ msg: "Senha incorreta! " })

            // Gerar token
            const payload = { id: 420 }
            const generatedToken = jwt.sign(payload, JWT_KEY, {
              expiresIn: "3d"
            })

            res.send({ user_id: user._id, token: generatedToken })
          })
      })
      .catch(err => res.status(500).send(err))
  },

  verifyToken: (req, res) => {
    const token = getToken(req.headers.authorization)

    jwt.verify(token, JWT_KEY, (err, decoded) => {
      if (err) return res.status(401).send({
        success: false,
        msg: "Token inválido!"
      })

      res.send({
        success: true,
        msg: "Token válido!"
      })
    })
  }
}