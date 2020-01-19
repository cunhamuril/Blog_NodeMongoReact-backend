require('dotenv/config')
const bcrypt = require('bcrypt')

const UserModel = require('../models/User.model')

const { existsOrError, notExistsOrError, equalsOrError } = require('./validation')
const { SALT_ROUNDS } = process.env

module.exports = {
  save: async (req, res) => {
    const { name, username, email, password, confirmPassword } = req.body

    // Validações
    try {
      existsOrError(name, "Informe um nome!")
      existsOrError(username, "Informe um username!")
      existsOrError(email, "Informe um e-mail!")
      existsOrError(password, "Informe uma senha!")
      existsOrError(confirmPassword, "Informe uma senha de confirmação!")
    } catch (msg) {
      return res.status(400).send(msg)
    }

    try {
      equalsOrError(password, confirmPassword, "Senhas não conferem")
    } catch (msg) {
      return res.status(400).send(msg)
    }

    const registeredUser = await UserModel.findOne({ username })
    const registeredEmail = await UserModel.findOne({ email })

    try {
      notExistsOrError(registeredUser, "Nome de usuário já cadastrado!")
      notExistsOrError(registeredEmail, "E-mail já cadastrado!")
    } catch (msg) {
      return res.status(400).send(msg)
    }

    // Gerar hash com bcrypt para senha com criptografia
    bcrypt.hash(password, parseInt(SALT_ROUNDS))
      .then(hash => {
        // Depois de gerado o hash, salvar no banco de dados        
        const user = new UserModel({ name, username, email, password: hash })

        user.save()
          .then(() => res.send({ msg: "Usuário adicionado com sucesso!" }))
          .catch(err => res.status(500).send(err))
      })
      .catch(err => res.status(500).send(err))
  },

  update: (req, res) => {
    const { name, username, email, password, confirmPassword } = req.body

    // Validações
    try {
      existsOrError(name, "Informe um nome!")
      existsOrError(username, "Informe um username!")
      existsOrError(email, "Informe um e-mail!")
      existsOrError(password, "Informe uma senha!")
      existsOrError(confirmPassword, "Informe uma senha de confirmação!")
    } catch (msg) {
      return res.status(400).send(msg)
    }

    try {
      equalsOrError(password, confirmPassword, "Senhas não conferem")
    } catch (msg) {
      return res.status(400).send(msg)
    }

    // Gerar hash com bcrypt para senha com criptografia
    bcrypt.hash(password, parseInt(SALT_ROUNDS))
      .then(hash => {
        // Depois de gerado o hash, atualizar dados              

        UserModel.findOne({ _id: req.params.id })
          .then(user => {
            user.name = name
            user.username = username
            user.email = email
            user.password = hash

            user.save()
              .then(() => res.send({ msg: "Usuário atualizado com sucesso! " }))
              .catch(err => res.status(500).send(err))
          })
          .catch(err => res.status(500).send(err))
      })
      .catch(err => res.status(500).send(err))
  },

  remove: (req, res) => {
    const { id } = req.params

    UserModel.deleteOne({ _id: id })
      .then(() => res.send({ msg: "Usuário deletado com sucesso!" }))
      .catch(err => res.status(500).send(err))
  }
}