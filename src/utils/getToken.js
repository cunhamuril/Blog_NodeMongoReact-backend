/**
 * Pegar token do header
 */
const { existsOrError } = require('./validation')

module.exports = (authHeader) => {
  try {
    existsOrError(authHeader, "Nenhum token providenciado!")
  } catch (msg) {
    return msg
  }

  // [0] = bearer | [1] = token
  return authHeader.split(' ')[1]
}