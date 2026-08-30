const { Router } = require('express')

const { findAll } = require('./movimentacoes.controller.js')

const route = Router()

route.get('/', findAll)

module.exports = route