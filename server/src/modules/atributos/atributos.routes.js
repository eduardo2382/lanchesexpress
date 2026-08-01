const { Router } = require('express')
const AtributoController = require('./atributos.controller.js')

const route = Router()
const controller = new AtributoController()

route.get('/', controller.findAll)
route.get('/:id', controller.findById)

route.post('/', controller.create)

route.patch('/:id', controller.update)

route.delete('/:id', controller.delete)

module.exports = route