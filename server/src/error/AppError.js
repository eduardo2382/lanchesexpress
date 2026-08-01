class AppError extends Error {
    constructor(message, statusCode=500, code='ERRO_INTERNO', details=null){
        super(message)
        this.name = this.constructor.name
        this.statusCode = statusCode
        this.code = code
        this.details = details
        this.isOperational = true
        Error.captureStackTrace(this, this.constructor)
    }
}

class ValidationError extends AppError{
    constructor(message, details=null){
        super(message, 400, 'VALIDACAO', details)
    }
}

class NotFoundError extends AppError{
    constructor(message='Recurso nao encontrado'){
        super(message, 404, 'NAO_ENCONTRADO')
    }
}

class ConflictError extends AppError{
    constructor(message = 'Conflito com o estado atual do recurso'){
        super(message, 409, 'CONFLITO')
    }
}

module.exports = { AppError, ValidationError, NotFoundError, ConflictError}