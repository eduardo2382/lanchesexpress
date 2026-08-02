const CategoriaService = require('./categorias.service.js')
const service = new CategoriaService()

const catchAsync = require('../../utils/catchAsync.js')

exports.create = catchAsync(async (req, res) => {
    let createdCategoria = await service.createCategoria(req.body)

    return res.status(201).location(`/api/categoria/${createdCategoria.id}`).json(createdCategoria)
}) 

exports.findAll = catchAsync(async (req, res)=>{
    let allCategorias = await service.findAllCategorias(req.query)

    return res.status(200).json(allCategorias)
})

exports.findById = catchAsync(async (req, res) => {
    let categoria = await service.findByIdCategoria(req.params.id)

    return res.status(200).json(categoria)
})

exports.update = catchAsync(async (req, res) => {
    let updatedCategoria = await service.updateCategoria(req.params.id, req.body)

    return res.status(200).json(updatedCategoria)
})

exports.updateStatus = catchAsync(async (req, res) => {
    let updatedCategoria = await service.updateStatusCategoria(req.params.id, req.body)

    return res.status(200).json(updatedCategoria)
})

exports.remove = catchAsync(async (req, res) => {
    let removedCategoria = await service.removeCategoria(req.params.id)

    return res.status(204).send()
})