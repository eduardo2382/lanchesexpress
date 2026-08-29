const { Router } = require('express')

const { createPedido, findAll, findById, updateStatus } = require('./pedidos.controller.js')

const route = Router()

route.post('/', createPedido)

route.get('/', findAll)
route.get('/:id', findById)

route.patch('/:id/status', updateStatus)

module.exports = route