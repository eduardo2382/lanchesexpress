const servicePedidos = require('./pedidos.service.js')

const catchAsync = require('../../utils/catchAsync.js')

exports.createPedido = catchAsync(async (req, res) => {
    let createdPedido = await servicePedidos.createPedido(req.body)

    return res.status(201).json(createdPedido)
})

exports.findAll = catchAsync(async (req, res) => {
    let allPedidos = await servicePedidos.findAllPedidos(req.query)

    return res.status(200).json(allPedidos)
})

exports.findById = catchAsync(async (req, res) => {
    let pedido = await servicePedidos.findById(req.params.id)

    return res.status(200).json(pedido)
})

exports.updateStatus = catchAsync(async (req, res) => {
    let pedidoUpdated = await servicePedidos.updateStatus(req.params.id, req.body)

    return res.status(200).json(pedidoUpdated)
})