const knex = require('../settings/conector')

const categoriesList = async (req, res) => {
    try {
        const categories = await knex('categorias').select('*')

        return res.json(categories)
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro inerto no servidor' })
    }
}

module.exports = categoriesList