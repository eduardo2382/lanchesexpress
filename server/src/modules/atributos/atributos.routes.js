const { Router } = require('express')
const { findAll, findById, create, update, remove, updateStatus } = require('./atributos.controller.js')

const route = Router()

route.get('/', findAll)
route.get('/:id', findById)

route.post('/', create)

route.patch('/:id', update)
route.patch('/:id/status', updateStatus)

route.delete('/:id', remove)

module.exports = route