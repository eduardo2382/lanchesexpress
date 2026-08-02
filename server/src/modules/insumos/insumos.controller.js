const InsumoService = require('./insumos.service.js')
const service = new InsumoService()

const catchAsync = require('../../utils/catchAsync.js')

exports.create = catchAsync(async (req, res) => {
    let createdInsumo = await service.createInsumo(req.body)

    return res.status(201).location(`/api/insumo/${createdInsumo.id}`).json(createdInsumo)
})

exports.findAll = catchAsync(async (req, res) => {
    let allInsumos = await service.findAllInsumos(req.query)

    return res.status(200).json(allInsumos)
})

exports.findById = catchAsync(async (req, res) => {
    let insumo = await service.findByIdInsumo(req.params.id)

    return res.status(200).json(insumo)
})

exports.findBellow = catchAsync(async (req, res) => {
    let insumosBellow = await service.findBellowInsumos(req.query)

    return res.status(200).json(insumosBellow)
})

exports.update = catchAsync(async (req, res) => {
    let updatedInsumo = await service.updateInsumo(req.params.id, req.body)

    return res.status(200).json(updatedInsumo)
})

exports.updateStatus = catchAsync(async (req, res) => {
    let updatedInsumo = await service.updateInsumo(req.params.id, req.body)

    return res.status(200).json(updatedInsumo)
})

exports.remove = catchAsync(async (req, res) => {
    let deletedInsumo = await service.removeInsumo(req.params.id)

    return res.status(200).json(deletedInsumo)
})

exports.ajust = catchAsync(async (req, res) => {
    let ajustedInsumo = await service.ajustInsumo(req.params.id, req.body)

    return res.status(200).json(ajustedInsumo)
})
