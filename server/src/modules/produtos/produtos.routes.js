const { Router } = require('express')
const { createProduto, findAll, findById, update, updateStatus, findInsumosById, updateInsumos, remove, removeGrupo, removeItem, removeInsumo, findGrupos, createGrupo, updateGrupo, linkOpcao, linkInsumo,  updatePrecoItem } = require('./produtos.controller.js')

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
route.post('/grupos-opcoes/:grupoId/itens', linkOpcao)
route.post('/grupos-opcoes/itens/:itemId/insumos', linkInsumo)

route.patch('/grupos-opcoes/:grupoId', updateGrupo)
route.patch('/grupos-opcoes/itens/:itemId', updatePrecoItem)

route.delete('/grupos-opcoes/:grupoId', removeGrupo)
route.delete('/grupos-opcoes/itens/:itemId', removeItem)
route.delete('/grupos-opcoes/itens/:itemId/insumos/:insumoId', removeInsumo)

module.exports = route