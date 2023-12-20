const jwt = require('jsonwebtoken');
const knex = require('../settings/conector')
const bcrypt = require('bcrypt')
const jwtPassword = require('../utils/passwordJWT')

const userRegister = async (req, res) => {
    const { nome, email, senha } = req.body;

    const user = await knex('usuarios').where({ email }).first()

    if (user) {
        return res.status(400).json({ mensagem: 'Email já cadastrado'})
    }

try {
    const cryptPassword = await bcrypt.hash(senha, 10)

    const newUser = await knex('usuarios').insert({
        nome,
        email,
        senha: cryptPassword
    }).returning(['nome', 'email'])

    return res.status(201).json(newUser[0])
} catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno no servidor' })
}
    
}

const login = async (req, res) => {
    const { email, senha } = req.body
    try {
        const user = await knex('usuarios').where({ email }).first()

        if (!user) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' })
        }

        const verifyPassword = await bcrypt.compare(senha, user.senha)

        if (!verifyPassword) {
            return res.status(401).json({ mensagem: 'Email ou senha inválidos' })
        }

        const token = jwt.sign({ id: user.id }, jwtPassword, { expiresIn: '1d' })

        const { senha: _, ...userDate } = user

        return res.status(200).json({
            userDate,
            token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: 'Erro interno no servidor' }) 
    }
}

const userDetail = async (req, res) => {
    return res.json(req.user)
}

const updateUser = async (req, res) => {
    const { nome, email, senha } = req.body

    try {
        const userTarget = await knex('usuarios').where({ email }).whereNot('id', req.user.id).first()

        if (userTarget) {
            return res.status(401).json({ mensagem: 'Email ja cadastrado' })
        }

        const newPassord = await bcrypt.hash(senha, 10)

        const updateUser = await knex('usuarios').where('id', req.user.id).update({
            nome,
            email,
            senha: newPassord
        }).returning('*')

        const { senha: _, ...userData } = updateUser[0]

        req.user = userData

        return res.status(204).send()
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' }) 
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.query
    
    try {
        await knex('usuarios').where({ id }).delete()

        return res.status(204).json({ mensagem: 'Usario deletado com sucesso'})
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' })
    }
}

module.exports = {
    userRegister,
    login,
    userDetail,
    updateUser,
    deleteUser
}