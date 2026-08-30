const repositoryPagamentos = require('./pagamentos.repository.js')

const { ValidationError, NotFoundError, ConflictError, InsufficientStockError, UnprocessableEntityError} = require('../../error/AppError.js')

async function validatePagamentoNome(nome){
    let pagamento = (await repositoryPagamentos.findByName(nome))[0]

    if(pagamento)throw new ConflictError('Ja existe uma forma de pagamento com esse nome!')
}

exports.createPagamento = async (body) => {
    if(!body || !body.nome) throw new ValidationError('Nome da forma de pagamento faltando!', {campo: 'nome', motivo: 'obrigatorio'})

    if(typeof(body.nome) != 'string') throw new ValidationError('O nome deve ser uma string!', {campo: 'nome', motivo: 'invalido'})

    let campoBody = Object.keys(body)
    let camposInvalid = campoBody.filter((c) => c != 'nome')

    if(camposInvalid.length > 0) throw new ValidationError(`Campos invalidos: ${camposInvalid.join(', ')}`, {campos: camposInvalid.join(', '), motivo: 'invalidos'})

    await validatePagamentoNome(body.nome)

    return await repositoryPagamentos.createPagamento(body.nome)
}

exports.findAll = async (query) => {
    let camposQuery = Object.keys(query)
    let camposQueryInvalid = camposQuery.filter((c) => c != 'status')

    if(camposQueryInvalid.length > 0) throw new ValidationError(`Campos de query invalidos: ${camposQueryInvalid.join(', ')}`, {campo: 'query', motivo: 'invalido'})

    let statusList = query.status ? query.status.split(',') : ['ativo']    
    
    let statusInvalid = statusList.filter((s) => !['ativo', 'excluido'].includes(s))
    if(statusInvalid.length > 0) throw new ValidationError(`Status invalido: ${statusInvalid.join(', ')}`, {campo: 'status', motivo: 'invalido'})

    return await repositoryPagamentos.findAll(statusList)
}

exports.findById = async (id) => {
    let pagamento = await repositoryPagamentos.findById(id)

    if(pagamento.length == 0) throw new NotFoundError('Pedido nao encotrado!')

    return pagamento[0]
}

exports.updatePagamento = async (id, body) =>{
    if(!body) throw new ValidationError('Sem campos para atualizar!')

    let camposBody = Object.keys(body)
    let camposInvalid = camposBody.filter((c) => c != 'nome')

    if(camposInvalid.length > 0) throw new ValidationError(`Campos invalidos: ${camposInvalid.join(', ')}`, {campo: 'body', motivo: 'invalido'})

    let pagamento = (await repositoryPagamentos.findById(id))[0]

    if(!pagamento) throw new NotFoundError('Pedido nao encontrado!')

    await validatePagamentoNome(body.nome)

    return await repositoryPagamentos.updatePagamento(id, body)
}

exports.deletePagamento = async (id) => {
    let pagamento = (await repositoryPagamentos.findById(id))[0]

    if(!pagamento) throw new NotFoundError('Forma de pagamento nao encontrada!')

    if(pagamento.status != 'excluido') await repositoryPagamentos.updatePagamento(id, {status: 'excluido'})
}