const knex = require('../settings/conector')

const registerProducts = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body

    try {
        const category = await knex('categorias').where('id', categoria_id).first()

        if (!category) {
            return res.status(400).json({ mensagem: 'Categoria não existente' })
        }

        const product = await knex('produtos').where({ descricao }).first()

        if (product) {
            product.quantidade_estoque = quantidade_estoque + product.quantidade_estoque

            const updateProduct = await knex('produtos').where({ descricao }).update('quantidade_estoque', product.quantidade_estoque)

            if (updateProduct.length === 0) {
                return res.status(400).json({ mensagem: 'O produto não foi registrado' }) 
            }

            return res.status(201).json({ mensagem: `Quantidade em estoque do produto ${descricao}, foi atualizada` })
        }

        const newProduct = await knex('produtos').insert({
            descricao,
            quantidade_estoque,
            valor,
            categoria_id
        })

        if (newProduct.length === 0) {
            return res.status(400).json({ mensagem: 'O produto não foi registrado' })
        }

        return res.status(201).json({ mensagem: 'Produto registardo com sucesso' })
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

const productsList = async (req, res) => {
    const { categoria_id } = req.query
    try {

    if (!categoria_id) {
    const products = await knex('produtos').select('*').orderBy('id', 'asc')
        
    return res.status(200).json({products})
    }
     const products = await knex('produtos').where({ categoria_id }).select('*')

    if (products.length === 0) {
        return res.status(404).json({ mensagem: 'Não há produtos para essa categoria' })
    }

    return res.json(products)
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

const updateProduct = async (req, res) => {
    const { id } = req.params
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body
    
    try {
        const product = await knex('produtos').where({ id }).first()
        
        if (!product) {
            return res.status(400).json({ mensagem: 'Produto não encontrado' })
        }

        const description = await knex('produtos').where({ descricao }).whereNot({ id }).first()

        if ( description) {
            
            let newAmount = product.quantidade_estoque + description.quantidade_estoque + quantidade_estoque

            await knex('produtos').where({ id }).update({
                descricao,
                quantidade_estoque: newAmount,
                valor
            })

            await knex('produtos').where('id', description.id).delete()

            return res.status(204).json()
        }

        const updateProduct = await knex('produtos').where('id', id).update({
            descricao,
            quantidade_estoque: (product.quantidade_estoque + quantidade_estoque),
            valor,
            categoria_id
        })
        
        if (updateProduct.length === 0) {
            return res.status(400).json({ mensagem: 'Produto não registrado, tente novamente' })
        }

        return res.status(204).json()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: 'Erro interno do servidor' }) 
    }
}

const detailProduct = async (req, res) => {
    const { id } = req.params

    try {
        const product = await knex('produtos').where({ id }).first()

        if (!product) {
            return res.status(404).json({ mensagem: 'Produto não encontrado' })
        }

        return res.json(product)
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })  
    }
}

const deleteProduct = async (req, res) => {
    const { id } = req.params

    try {
        const product = await knex('produtos').where({ id }).first()

        if (!product) {
            return res.status(404).json({ mensagem: 'Produto não encontrado' })
        }

        const productInOrder = await knex('pedido_produtos').where('produto_id', id).first()

        if (productInOrder) {
            return res.status(400).json({ mensagem: 'Este produto esta vinculado a um ou mais pedidos, desta froma, não pode ser deletado' })
        }

        await knex('produtos').where({ id }).delete()

        return res.status(204).json()
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' }) 
    }
}

module.exports = {
    registerProducts,
    productsList,
    updateProduct,
    detailProduct,
    deleteProduct
}