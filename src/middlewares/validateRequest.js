const validateRequest = (schema) => async (req, res, next) => {
    try {
      if (schema instanceof Array) {
        for (const schemaCurrent of schema) {
          await schemaCurrent.validateAsync(req)
        }
        return next()
      }
  
      await schema.validateAsync(req)
      next()
    } catch (error) {
      return res.status(400).json({
        mensagem: error.message,
      })
    }
  }
  
  module.exports = validateRequest