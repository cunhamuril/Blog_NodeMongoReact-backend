require('dotenv/config')
const bcrypt = require('bcrypt')

const UserModel = require('../models/User.model')

const { existsOrError, notExistsOrError, equalsOrError } = require('../utils/validation')
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

  update: async (req, res) => {
    const {
      name,
      username,
      email,
      currentPassword,
      newPassword,
      confirmPassword
    } = req.body

    const currentUser = await UserModel.findOne({ _id: req.params.id })

    /**
     * Na aplicação o usuário muda a senha OU muda os dados, 
     * por isso essa verificação se tem ou não senha
     */
    if (!currentPassword) {
      // Validações
      try {
        existsOrError(name, "Informe um nome!")
        existsOrError(username, "Informe um username!")
        existsOrError(email, "Informe um e-mail!")
      } catch (msg) {
        return res.status(400).send(msg)
      }

      let registeredUser
      let registeredEmail

      if (username !== currentUser.username) {
        registeredUser = await UserModel.findOne({ username })
      }

      if (email !== currentUser.email) {
        registeredEmail = await UserModel.findOne({ email })
      }

      try {
        notExistsOrError(registeredUser, "Nome de usuário já cadastrado!")
        notExistsOrError(registeredEmail, "E-mail já cadastrado!")
      } catch (msg) {
        return res.status(400).send(msg)
      }

      // Queries
      UserModel.findOne({ _id: req.params.id })
        .then(user => {
          user.name = name
          user.username = username
          user.email = email

          user.save()
            .then(() => res.send({ msg: "Dados de usuário atualizado com sucesso! " }))
            .catch(err => res.status(500).send(err))
        })
        .catch(err => res.status(500).send(err))
    } else {
      // Validações
      try {
        existsOrError(newPassword, "Informe uma senha!")
        existsOrError(confirmPassword, "Informe uma confirmação da senha!")
      } catch (msg) {
        return res.status(400).send(msg)
      }

      try {
        equalsOrError(newPassword, confirmPassword, "Senhas não conferem")
      } catch (msg) {
        return res.status(400).send(msg)
      }

      // Verificar senha atual
      bcrypt.compare(currentPassword, currentUser.password)
        .then(auth => {
          if (!auth) res.status(401).send({ msg: "Senha atual inválida!" })

          // Gerar hash com bcrypt para senha com criptografia
          bcrypt.hash(newPassword, parseInt(SALT_ROUNDS))
            .then(hash => {
              // Depois de gerado o hash, atualizar dados

              UserModel.findOne({ _id: req.params.id })
                .then(user => {
                  user.password = hash

                  user.save()
                    .then(() => res.send({ msg: "Senha atualizada com sucesso! " }))
                    .catch(err => res.status(500).send(err))

                  return
                })
                .catch(err => res.status(500).send(err))
            })
            .catch(err => res.status(500).send(err))
        })
        .catch(err => res.status(500).send(err))
    }
  },

  remove: async (req, res) => {
    const { password } = req.body
    const { id } = req.params

    const currentUser = await UserModel.findOne({ _id: id })

    bcrypt.compare(password, currentUser.password)
      .then(auth => {
        if (!auth) return res.status(401).send({ msg: "Senha inválida! " })

        UserModel.deleteOne({ _id: id })
          .then(() => res.send({ msg: "Usuário deletado com sucesso!" }))
          .catch(err => res.status(500).send(err))
      })
      .catch(err => res.status(500).send(err))
  },

  findOne: (req, res) => {
    UserModel.findOne({ _id: req.params.id })
      .then(user => res.send(user))
      .catch(err => res.status(500).send(err))
  }
}