const express = require('express')
const app = express()

const routes = require('./modules/index.routes.js')

const notFoundHandler = require('./middlewares/notFoundHandler.js')
const errorHandler = require('./middlewares/errorHandler.js')

app.use(express.json());

app.use('/api', routes)

app.use(notFoundHandler)
app.use(errorHandler)

module.exports = app