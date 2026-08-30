const catchAsync = require("../../utils/catchAsync");

const servicePagamentos = require('./pagamentos.service.js')

exports.createPagamento = catchAsync(async (req, res) => {
    let pagamentoCreated = await servicePagamentos.createPagamento(req.body)

    return res.status(201).json(pagamentoCreated)
})

exports.findAll = catchAsync(async (req, res) => {
    let pagamento = await servicePagamentos.findAll(req.query)

    return res.status(200).json(pagamento)
})

exports.findById = catchAsync(async (req, res) => {
    let pagamento = await servicePagamentos.findById(req.params.id)

    return res.status(200).json(pagamento)
})

exports.updatePagamento = catchAsync(async (req, res) => {
    let pagamentoUpdated = await servicePagamentos.updatePagamento(req.params.id, req.body)

    return res.status(200).json(pagamentoUpdated)
})

exports.deletePagamento = catchAsync(async (req, res) => {
    await servicePagamentos.deletePagamento(req.params.id)

    return res.status(204).send()
})