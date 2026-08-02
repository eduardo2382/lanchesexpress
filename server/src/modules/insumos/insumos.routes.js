const { Router } = require('express')
const { findAll, findBellow, findById, create, ajust, update, updateStatus, remove} = require('./insumos.controller.js')

const route = Router()

route.get('/', findAll)
route.get('/baixo-estoque', findBellow)
route.get('/:id', findById)

route.post('/', create)
route.post('/:id/ajuste', ajust)

route.patch('/:id', update)
route.patch('/:id/status', updateStatus)

route.delete('/:id', remove)

module.exports = route
 
