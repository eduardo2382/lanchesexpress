const { Router } = require('express')
const { createProduto, findAll, findById, update, updateStatus, findInsumosById, updateInsumos, remove, findGrupos, createGrupo } = require('./produtos.controller.js')

const route = Router() 

// Rotas para produtos(simples e montaveis)

route.get('/', findAll)
route.get('/:id', findById)
route.get('/:id/insumos', findInsumosById)

route.post('/', createProduto)

route.put('/:id/insumos', updateInsumos)

route.patch('/:id', update)
route.patch('/:id/status', updateStatus)

route.delete('/:id', remove)

// Rotas para grupos, opcoes e itens de produtos montaveis

route.get('/:id/grupos-opcoes', findGrupos)

route.post('/:id/grupos-opcoes', createGrupo)

module.exports = route