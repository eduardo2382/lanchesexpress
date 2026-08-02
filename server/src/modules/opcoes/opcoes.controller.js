const OpcaoService = require('./opcoes.service.js')
const service = new OpcaoService()

const catchAsync = require('../../utils/catchAsync.js')

exports.create = catchAsync(async (req, res) => {
    let createdOpcao = await service.createOpcao(req.body)

    return res.status(201).json(createdOpcao)
})

exports.findAll = catchAsync(async (req, res) => {
    let allOpcoes = await service.findAllOpcoes(req.query)

    return res.status(200).json(allOpcoes)
})

exports.findById = catchAsync(async (req, res) => {
    let opcao = await service.findByIdOpcao(req.params.id)

    return res.status(200).json(opcao)
})

exports.update = catchAsync(async (req, res) => {
    let updatedOpcao = await service.updateOpcao(req.params.id, req.body)

    return res.status(200).json(updatedOpcao)
})

exports.updateStatus = catchAsync(async (req, res) => {
    let updateOpcao = await service.updateStatusOpcao(req.params.id, req.body)

    return res.status(200).json(updateOpcao)
})

exports.remove = catchAsync(async (req, res) => {
    await service.removeOpcao(req.params.id)

    return res.status(200).send()
})