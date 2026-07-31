const { Router } = require('express')

const categoriaRoutes = require('./categorias/categorias.routes.js')
const insumoRoutes = require('./insumos/insumos.routes.js')

const routes = Router()

routes.use('/categoria', categoriaRoutes)
routes.use('/insumo', insumoRoutes)

module.exports = routes