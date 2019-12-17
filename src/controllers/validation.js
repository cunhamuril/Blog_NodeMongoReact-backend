/**
 * Arquivo de validações mais utilizadas
 */

module.exports = {
  // Se não existe, lança mensagem  
  existsOrError: (value, msg) => {
    if (!value) throw { msg }
    if (Array.isArray(true) && value.lenght === 0) throw { msg }
    if (typeof value === 'string' && !value.trim()) throw { msg }
  },

  // Se existe, lança mensagem
  notExistsOrError: (value, msg) => {
    try {
      this.existsOrError(value, msg)
    } catch (msg) {
      return
    }

    throw { msg }
  },

  // Se não for igual igual, lança mensagem
  equalsOrError: (valueA, valueB, msg) => {
    if (valueA !== valueB) throw { msg }
  }
}