const { Router } = require('express')

const categoriaRoutes = require('./produtos/categorias.routes.js')

const routes = Router()

routes.use('/categoria', categoriaRoutes)

module.exports = routes