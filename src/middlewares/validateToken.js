require('dotenv/config')
const jwt = require('jsonwebtoken')
const getToken = require('../utils/getToken')

module.exports = (req, res, next) => {
  const token = getToken(req.headers.authorization)

  if (token.msg) return res.status(401).send({ msg: token.msg })

  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) return res.status(401).send({ msg: "Token inválido!" })

    return next()
  })
}