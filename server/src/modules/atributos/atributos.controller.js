const AtributoService = require('./atributos.service.js')
const service = new AtributoService()

const catchAsync = require('../../utils/catchAsync.js')

exports.create = catchAsync(async (req, res) => {
    let createdAtributo = await service.createAtributo(req.body)

    return res.status(201).location(`/api/atributo/${createdAtributo.id}`).json(createdAtributo)
})

exports.findAll = catchAsync(async (req, res) => {
    let allAtributos = await service.findAllAtributos(req.query)

    return res.status(200).json(allAtributos)
})

exports.findById = catchAsync(async (req, res) => {
    let atributo = await service.findByIdAtributo(req.params.id)

    return res.status(200).json(atributo)
})

exports.update = catchAsync(async (req, res) => {
    let updatedAtributo = await service.updateAtributo(req.params.id, req.body)

    return res.status(200).json(updatedAtributo)
})

exports.updateStatus = catchAsync(async (req, res) => {
    let updatedAtributo = await service.updateAtributo(req.params.id, req.body)

    return res.status(200).json(updatedAtributo)
})

exports.remove = catchAsync(async (req, res) => {
    let removedAtributo = await service.removeAtributo(req.params.id)

    return res.status(204).send()
})