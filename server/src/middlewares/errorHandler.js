const { AppError } = require("../error/AppError.js")

const PG_ERROR_MAP = {
    '23505': { statusCode: 409, code: 'REGISTRO_DUPLICADO', message: 'Já existe um registro com esses dados' },
    '23503': { statusCode: 409, code: 'REGISTRO_EM_USO', message: 'Esse registro esta em uso e nao pode ser alterado/excluido' },
    '23502': { statusCode: 400, code: 'CAMPO_OBRIGATORIO', message: 'Campo obrigatorio nao informado' },
    '22P02': { statusCode: 400, code: 'DADO_INVALIDO', message: 'Formato de dado inválido' },
}

function erroHandler(err, req, res, next){
    if(err instanceof AppError){
        return res.status(err.statusCode).json({
            error: { code: err.code, message: err.message, details: err.details }
        })
    }

    if(err.code && PG_ERROR_MAP[err.code]){
        console.error(`[PG_ERROR]: ${err}`)
        
        let mapped = PG_ERROR_MAP[err.code]

        return res.status(mapped.statusCode).json({
            error: { code: mapped.code, message: mapped.message }
        })
    }

    console.error(`[ERRO NAO TRATADO]: ${err}`)

    return res.status(500).json({
        error: {
            code: 'ERRO_INTERNO',
            message: 'Erro interno no servidor',
            ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
        }
    })
}

module.exports = erroHandler