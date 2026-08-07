const { Router } = require('express')

const categoriaRoutes = require('./categorias/categorias.routes.js')
const insumoRoutes = require('./insumos/insumos.routes.js')
const atributoRoutes = require('./atributos/atributos.routes.js')
const opcaoRoutes = require('./opcoes/opcoes.routes.js')
const produtoRoutes = require('./produtos/produtos.routes.js')

const routes = Router()

routes.use('/categoria', categoriaRoutes)
routes.use('/insumo', insumoRoutes)
routes.use('/atributo', atributoRoutes)
routes.use('/opcao', opcaoRoutes)
routes.use('/produto', produtoRoutes)

module.exports = routes