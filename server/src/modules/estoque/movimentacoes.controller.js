const catchAsync = require('../../utils/catchAsync.js')

const serviceMovimentacoes = require('./movimentacoes.service.js')

exports.findAll = catchAsync(async (req, res) => {
    let movimentacoes = await serviceMovimentacoes.findAll(req.query)

    return res.status(200).json(movimentacoes)
})