const knex = require('../settings/conector')

const registerClient = async (req, res) => {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body

    try {
        const emailVerify = await knex('clientes').where({ email }).first()
        const cpfVerify = await knex('clientes').where({ cpf }).first()

        if (emailVerify) {
            return res.status(401).json({ mensagem: 'Email já cadastrado' })
        }
        if (cpfVerify) {
            return res.status(401).json({ mensagem: 'CPF já cadastrado' })
        }

        const newCustomer = {
            nome,
            email,
            cpf,
            cep,
            rua,
            numero,
            bairro,
            cidade,
            estado,
          }
      
          const insert = await knex('clientes').insert(newCustomer)
      
          if (insert.length === 0) {
            return res.sttus(400).json({ mensagem: 'O cliente não foi inserido no sistema' })
          }
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' })
    }
}

const updateClient = async (req, res) => {
    const { id } = req.params
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body

    try {
        const idVerify = await knex('clientes').where({ id }).first()
        const emailVerify = await knex('clientes').where({ email }).whereNot({ id }).first()
        const cpfVerify = await knex('clientes').where({ cpf }).whereNot({ id }).first()

        if(!idVerify) {
            return res.status(404).json({ mensagem: 'Cliente não encontrado' })
          }
        if (emailVerify) {
            return res.status(401).json({ mensagem: 'Email já cadastrado' })
          }
        if (cpfVerify) {
            return res.status(401).json({ mensagem: 'CPF já cadastrado' })
          }

          const updateCustomer = {
            nome,
            email,
            cpf,
            cep,
            rua,
            numero,
            bairro,
            cidade,
            estado,
          }
      
          const update = await knex('clientes').where('id', id).update(updateCustomer)
      
          if (update.length === 0) {
            return res.status(400).json({ mensagem: 'Os dados não foram atualizados' })
          }
      
          return res.json(updateCustomer)
        
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' })  
    }


}

const listClients = async (req, res) => {
  try {
    const clients = await knex('clientes').select('*').orderBy('id', 'asc')

    return res.json(clients)
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno no servidor' })  
  }
}

const detailClient = async (req, res) => {
  const { id } = req.params

  try {
    const client = await knex('clientes').where({ id }).first()

    if (!client) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' })
    }

    return res.json(client)
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno no servidor' })  
  }
}



module.exports = {
    registerClient,
    updateClient,
    listClients,
    detailClient
}