const { Router } = require('express')

const categoriaRoutes = require('./categorias/categorias.routes.js')

const routes = Router()

routes.use('/categoria', categoriaRoutes)

module.exports = routes