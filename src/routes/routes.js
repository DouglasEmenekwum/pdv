const express = require('express')
const route = express.Router()

const { userRegister, login, userDetail, updateUser, deleteUser } = require('../controllers/users')
const validateRequest = require('../middlewares/validateRequest')
const schemaUser = require('../models/validates/schemaUser')
const loginSchema = require('../models/validates/schemaLogin')
const loginVerify = require('../middlewares/loginVerify')
const categoriesList = require('../controllers/categories')
const schemaParams = require('../models/validates/schemaParams')
const { registerProducts, productsList, updateProduct, detailProduct, deleteProduct } = require('../controllers/products')
const { schemaProductsBody, schemaProductsQuery } = require('../models/validates/schemaProdutos')
const { registerClient, updateClient, listClients, detailClient } = require('../controllers/clients')
const clientSchemaBody = require('../models/validates/schemaClient')
const { registerOrder, listOrder } = require('../controllers/orders')

route.post('/user', validateRequest(schemaUser), userRegister)
route.post('/login', validateRequest(loginSchema), login)
route.get('/categorias', categoriesList)

route.use(loginVerify)

route.get('/user', userDetail)
route.put('/user', validateRequest(schemaUser), updateUser)
route.delete('/user', validateRequest(schemaParams), deleteUser)

route.post('/produto',validateRequest(schemaProductsBody), registerProducts)
route.get('/produtos', productsList)
route.put('/produto/:id', validateRequest([schemaProductsBody, schemaProductsQuery]), updateProduct)
route.get('/produto/:id', validateRequest(schemaProductsQuery), detailProduct)
route.delete('/produto/:id', validateRequest(schemaParams), deleteProduct)

route.post('/cliente', validateRequest(clientSchemaBody), registerClient)
route.put('/cliente/:id', validateRequest([clientSchemaBody, schemaParams]), updateClient)
route.get('/clientes', listClients)
route.get('/cliente/:id', validateRequest(schemaParams), detailClient)

route.post('/pedido', registerOrder)
route.get('/pedidos', listOrder)

module.exports = route