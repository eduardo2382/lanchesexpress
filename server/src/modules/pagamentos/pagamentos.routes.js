const { Router } = require('express')

const { createPagamento, findAll, findById, updatePagamento, deletePagamento } = require('./pagamentos.controller.js')

const route = Router()

route.get('/', findAll)
route.get('/:id', findById)

route.post('/', createPagamento)

route.patch('/:id', updatePagamento)

route.delete('/:id', deletePagamento)

module.exports = route