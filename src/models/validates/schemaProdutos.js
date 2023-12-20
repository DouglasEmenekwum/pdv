const joi = require('joi');

const schemaProductsBody = joi.object({
    body: joi.object({
        descricao: joi.string().required().trim().min(4).messages({
        'any.required': 'Campo descrição é obrigatório',
        'string.empty': 'Campo descrição é obrigatório',
        'string.base': 'O campo descrição precisa ser um texto',
        'string.min': 'Minímo de quatro caracteres'
        }),
        quantidade_estoque: joi.number().integer().positive().required().messages({
        'any.required': 'O campo da quantidade do estoque é obrigatório',
        'number.empty': 'O campo da quantidade do estoque é obrigatório',
        'number.base': 'O campo da quantidade do estoque deve ser um número',
        'number.positive': 'O campo da quantidade do estoque deve ser um número positivo',
        'number.integer': 'O campo da quantidade do estoque deve ser um número inteiro',
      }),
        valor: joi.number().integer().positive().required().messages({
        'any.required': 'O campo valor é obrigatório',
        'number.empty': 'O campo valor é obrigatório',
        'number.base': 'O campo valor deve ser um número',
        'number.positive': 'O campo valor deve ser um número positivo',
        'number.integer': 'O campo valor deve ser um número inteiro',
      }),
        categoria_id: joi.number().integer().positive().required().messages({
        'any.required': 'O campo categoria é obrigatório',
        'number.empty': 'O campo categoria é obrigatório',
        'number.base': 'O campo categoria deve ser um número',
        'number.positive': 'O campo categoria deve ser um número positivo',
        'number.integer': 'O campo categoria deve ser um número inteiro',
      }),
      
    })
}).unknown()

const schemaProductsQuery = joi.object({
    query: joi.object({
        categoria_id: joi.number().integer().positive().messages({
            'number.positive': 'A categoria deve ser um numero positivo',
            'number.base': 'A categoria precisa ser um numero',
            'number.integer': 'A categoria precisa se rum numero inteiro'
        })
    }).unknown()
}).unknown()

module.exports = {
    schemaProductsBody,
    schemaProductsQuery
}