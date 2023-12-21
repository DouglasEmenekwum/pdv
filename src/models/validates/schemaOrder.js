const joi = require('joi')

const schemaOrderBody = joi
  .object({
    body: joi
      .object({
        cliente_id: joi.number().required().positive().integer().messages({
          'any.required': 'O id do cliente é obrigatório',
          'number.base': 'O id do cliente deve ser um número inteiro',
          'number.positive': 'O id do cliente deve ser um número inteiro',
          'number.integer': 'O id do cliente deve ser um número inteiro',
        }),
        observacao: joi.string().allow(''),
        pedido_produtos: joi.array().items(
          joi.object({
            produto_id: joi.number().required().positive().integer().messages({
              'any.required': 'O id do produto é obrigatório',
              'number.base': 'O id do produto deve ser um número inteiro',
              'number.positive': 'O id do produto deve ser um número inteiro',
              'number.integer': 'O id do produto deve ser um número inteiro',
            }),
            quantidade_produto: joi.number().required().integer().positive().messages({
              'any.required': 'A quantidade do produto é obrigatória',
              'number.base': 'A quantidade do produto deve ser um número inteiro',
              'number.positive': 'A quantidade do produto deve ser um número inteiro',
              'number.integer': 'A quantidade do produto deve ser um número inteiro',
            }),
          })
        ),
      })
      .messages({
        'array.base': 'O pedido deve conter o id do produto e a quantidade',
      }),
  })
  .unknown()

const schemaOrderQuery = joi
  .object({
    query: joi
      .object({
        cliente_id: joi.number().integer().positive().messages({
          'number.empty': 'O id do cliente é obrigatório',
          'number.base': 'O id do cliente deve ser um número inteiro',
          'number.positive': 'O id do cliente deve ser um número inteiro',
          'number.integer': 'O id do cliente deve ser um número inteiro',
        }),
      })
      .unknown(),
  })
  .unknown()

module.exports = { schemaOrderBody, schemaOrderQuery }
