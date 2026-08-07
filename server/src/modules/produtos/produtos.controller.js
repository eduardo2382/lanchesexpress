const service = require('./produtos.service.js')

const catchAsync = require('../../utils/catchAsync.js')

exports.create = catchAsync(async (req, res) => {
    let createdProduto = await service.createProduto(req.body)

    return res.status(201).json(createdProduto)
})

exports.findAll = catchAsync(async (req, res) => {
    let allProdutos = await service.findAllProdutos(req.query)

    return res.status(200).json(allProdutos)
})

exports.findById = catchAsync(async (req, res) => {
    let produto = await service.findByIdProduto(req.params.id)

    return res.status(200).json(produto)
})

exports.findInsumosById = catchAsync(async (req, res) => {
    let insumos = await service.findInsumosById(req.params.id)

    return res.status(200).json(insumos)
})

exports.update = catchAsync(async (req, res) => {
    let updatedProduto = await service.updateProduto(req.params.id, req.body)

    return res.status(200).json(updatedProduto)
})

exports.updateStatus = catchAsync(async (req, res) => {
    let updatedProduto = await service.updateStatusProduto(req.params.id, req.body)

    return res.status(200).json(updatedProduto)
})

exports.updateInsumos = catchAsync(async (req, res) => {
    let updatedInsumos = await service.updateInsumosProduto(req.params.id, req.body)

    return res.status(200).json(updatedInsumos)
})

exports.remove = catchAsync(async (req, res) => {
    await service.removeProduto(req.params.id)

    return res.status(204).send()
})