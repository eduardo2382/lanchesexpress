const { Router } = require('express')
const CategoriaController = require('./categorias.controller.js')

const categoriaRoutes = Router()
const controller = new CategoriaController();

categoriaRoutes.post('/', controller.create)

categoriaRoutes.get('/', controller.findAll)
categoriaRoutes.get('/:name', controller.findByName)

module.exports = categoriaRoutes