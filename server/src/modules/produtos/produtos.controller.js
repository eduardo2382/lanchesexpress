const serviceProdutos = require('./produtos.service.js')
const serviceGruposOpcoes = require('./grupos-opcoes.service.js')

const catchAsync = require('../../utils/catchAsync.js')

// Produtos (simples e montaveis)

exports.createProduto = catchAsync(async (req, res) => {
    let createdProduto = await serviceProdutos.createProduto(req.body)

    return res.status(201).json(createdProduto)
})

exports.findAll = catchAsync(async (req, res) => {
    let allProdutos = await serviceProdutos.findAllProdutos(req.query)

    return res.status(200).json(allProdutos)
})

exports.findById = catchAsync(async (req, res) => {
    let produto = await serviceProdutos.findByIdProduto(req.params.id)

    return res.status(200).json(produto)
})

exports.findInsumosById = catchAsync(async (req, res) => {
    let insumos = await serviceProdutos.findInsumosById(req.params.id)

    return res.status(200).json(insumos)
})

exports.update = catchAsync(async (req, res) => {
    let updatedProduto = await serviceProdutos.updateProduto(req.params.id, req.body)

    return res.status(200).json(updatedProduto)
})

exports.updateStatus = catchAsync(async (req, res) => {
    let updatedProduto = await serviceProdutos.updateStatusProduto(req.params.id, req.body)

    return res.status(200).json(updatedProduto)
})

exports.updateInsumos = catchAsync(async (req, res) => {
    let updatedInsumos = await serviceProdutos.updateInsumosProduto(req.params.id, req.body)

    return res.status(200).json(updatedInsumos)
})

exports.remove = catchAsync(async (req, res) => {
    await serviceProdutos.removeProduto(req.params.id)

    return res.status(204).send()
})

// Grupos, opcoes e itens (produtos montaveis)

exports.findGrupos = catchAsync(async (req, res) => {
    let grupos = await serviceGruposOpcoes.findGruposById(req.params.id)

    return res.status(200).json(grupos)
})

exports.createGrupo = catchAsync(async (req, res) => {
    let createdGrupo = await serviceGruposOpcoes.createGrupo(req.params.id, req.body)

    return res.status(201).json(createdGrupo)
})

exports.updateGrupo = catchAsync(async (req, res) => {
    let updatedGrupo = await serviceGruposOpcoes.updateGrupo(req.params.grupoId, req.body)

    return res.status(200).json(updatedGrupo)
})

exports.linkOpcao = catchAsync(async (req, res) => {
    let linkedOpcao = await serviceGruposOpcoes.linkOpcao(req.params.grupoId, req.body)

    return res.status(201).json(linkedOpcao)
})

exports.linkInsumo = catchAsync(async (req, res) => {
    let linkedInsumo = await serviceGruposOpcoes.linkInsumo(req.params.itemId, req.body)

    return res.status(200).json(linkedInsumo)
})

exports.updatePrecoItem = catchAsync(async (req, res) => {
    let updatedItem = await serviceGruposOpcoes.updatePrecoItem(req.params.itemId, req.body)

    res.status(200).json(updatedItem)
})

exports.removeGrupo = catchAsync(async (req, res) => {
    await serviceGruposOpcoes.removeGrupo(req.params.grupoId)

    return res.status(204).send()
})

exports.removeItem = catchAsync(async (req, res) => {
    await serviceGruposOpcoes.removeItem(req.params.itemId)

    return res.status(204).send()
})

exports.removeInsumo = catchAsync(async (req, res) => {
    await serviceGruposOpcoes.removeInsumo(req.params.itemId, req.params.insumoId)

    return res.status(204).send()
})