const joi = require('joi');

const schemaParams = joi.object({
    params: joi.object({
       id: joi.number().integer().positive().messages({
        'number.empty': 'O id é obrigatório',
        'number.positive': 'O id precisa ser positivo',
        'number.integer': 'O id precisa ser um valor inteiro',
        'number.base': 'O id tem que ser um numero real'
       }) 
    })
}).unknown()

module.exports = schemaParams;