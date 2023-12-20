const jwt = require('jsonwebtoken')
const knex = require('../settings/conector')
const jwtPassword = require('../utils/passwordJWT')

const loginVerify = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Não autorizado!!!' })
    }

    const token = authorization.split(' ')[1]

    try {
        const { id } = jwt.verify(token, jwtPassword)

        const user = await knex('usuarios').where({ id }).first()

        if (!user) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' })
        }

        const { senha: _, ...userDate } = user

        req.user = userDate

        next()
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ mensagem: 'Sessão expirada' })
          }
          if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ mensagem: 'Não autorizado!' })
          }
          return res.status(500).json({ mensagem: 'Erro interno do servidor' })
        }
}

module.exports = loginVerify