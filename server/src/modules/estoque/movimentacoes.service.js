const repositoryMovimentacoes = require('./movimentacoes.repository.js')

const { ValidationError, NotFoundError, ConflictError, InsufficientStockError, UnprocessableEntityError} = require('../../error/AppError.js')

const CAMPOS_QUERY = ['insumo_id', 'data_inicio', 'data_fim', 'motivo', 'tipo']

exports.findAll = async (query) => {
    let camposQuery = Object.keys(query)
    let camposQueryInvalid = camposQuery.filter((c) => !CAMPOS_QUERY.includes(c))

    if(camposQueryInvalid.length > 0) throw new ValidationError(`Campos invalidos: ${camposQueryInvalid.join(', ')}`, {campo: camposQueryInvalid.join(', '), motivo: 'invalido'})

    if(query.tipo){
        query.tipo = query.tipo.split(',')
    }

    if(query.motivo){
        query.motivo = query.motivo.split(',')
    }

    if(query.insumo_id){
        query.insumo_id = query.insumo_id.split(',')
        query.insumo_id = query.insumo_id.map((i) => i =  Number(i))
    }

    return await repositoryMovimentacoes.findAll(query)
}