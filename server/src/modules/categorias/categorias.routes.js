const { Router } = require('express')
const CategoriaController = require('./categorias.controller.js')

const route = Router()
const controller = new CategoriaController();

route.post('/', controller.create)

route.get('/', controller.findAll)
route.get('/:id', controller.findById)

module.exports = route