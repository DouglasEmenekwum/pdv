const knex = require('../settings/conector')

const registerOrder = async (req, res) => {
    const { cliente_id, observacao, pedido_produtos } = req.body;

    try {
    
        const client = await knex('clientes').where('id', cliente_id).first();

        if (!client) {
            return res.status(404).json({ mensagem: 'Cliente não encontrado' });
        }

        let valor_total = 0;
        let erros = [];
        
        for (const item of pedido_produtos) {
            let product = await knex('produtos').where('id', item.produto_id).first()

            if (!product) {
                erros.push({ mensagem: `Não existe produtos para o ID: ${item.produto_id}`})
            } else {
                if (item.quantidade_produto > product.quantidade_estoque) {
                    erros.push({ mensagem: `A quantidade solicitada não existe para o produto de ID ${item.produto_id}`})
                } else {
                    valor_total += product.valor * item.quantidade_produto
                    item.valor_produto = product.valor
                    item.quantidade_estoque = product.quantidade_estoque
                }
            }
        }

        if (erros.length > 0) {
            return res.status(400).json({ erros: erros})
        }

        const order = await knex('pedidos').insert({
            cliente_id,
            observacao,
            valor_total,
        }).returning('*');

        for (const item of pedido_produtos) {
            await knex('pedido_produtos').insert({
                pedido_id: order[0].id,
                produto_id: item.produto_id,
                quantidade_produto: item.quantidade_produto,
                valor_produto: item.valor_produto
            }).returning('*')

            let newQuantityInStock = item.quantidade_estoque - item.quantidade_produto

            await knex('produtos').where('id', item.produto_id).update({ quantidade_estoque: newQuantityInStock }, ['*'])
            
        }

        return res.status(201).json({ mensagem: 'Pedido efetuado com sucesso' });

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
}

const listOrder = async (req, res) => {
    const { id } = req.query
    
    try {
        
        if (!id) {
            const ids = await knex('pedidos').pluck('id')
            
            const result = []

            for (let i = 0; i < ids.length; i++) {
                const order = await knex('pedidos').where('id', ids[i]).first();
                const orderProducts = await knex('pedido_produtos').where('pedido_id', ids[i]).select('*')

                result.push({
                    pedido: order,
                    pedido_produtos: orderProducts
                })
            }
            return res.json(result)
        }
        
        const idVerify = await knex('pedidos').where('cliente_id', id).first()

        if (!idVerify){
            return res.status(404).json({ mensagem: `Cliente de ID: ${id} não encontrado` });
        }

        const ids = await knex('pedidos').where('cliente_id', id).pluck('id');
        
        const result = [];

        for (let i = 0; i < ids.length; i++) {
            const order = await knex('pedidos').where('id', ids[i]).first();
            const orderProducts = await knex('pedido_produtos').where('pedido_id', ids[i]).select('*');

            result.push({
                pedido: order,
                pedido_produtos: orderProducts
            });
        }

        return res.json(result);
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: 'Erro interno no servidor' }); 
    }
}

module.exports = {
    registerOrder,
    listOrder
}