const { NotFoundError } = require('../error/AppError.js')

function notFoundHandler(req, res, next){
    next(new NotFoundError(`Rota ${req.method} ${req.originalUrl} nao existe`))
}

module.exports = notFoundHandler
