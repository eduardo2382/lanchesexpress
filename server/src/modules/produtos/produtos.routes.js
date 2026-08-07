const { Router } = require('express')
const { create, findAll, findById, update, updateStatus, findInsumosById, updateInsumos, remove } = require('./produtos.controller.js')

const route = Router() 

route.get('/', findAll)
route.get('/:id', findById)
route.get('/:id/insumos', findInsumosById)

route.post('/', create)

route.put('/:id/insumos', updateInsumos)

route.patch('/:id', update)
route.patch('/:id/status', updateStatus)

route.delete('/:id', remove)

module.exports = route