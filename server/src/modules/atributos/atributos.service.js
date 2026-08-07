const repository = require('./atributos.repository.js')
const { ValidationError, ConflictError, NotFoundError, UnprocessableEntityError } = require('../../error/AppError.js')


exports.existsAtributoId = async (id) => {
    return (await repository.findById(id)).length > 0
}

exports.existsAtributoNome = async (nome) =>{
    return (await repository.findByName(nome)).length > 0
}

exports.createAtributo = async (body) => {
    if(body.nome == undefined) throw new ValidationError('Nome do atributo faltando!', {campo: 'nome', motivo: 'obrigatorio'}) 

    if(await this.existsAtributoNome(body.nome)) throw new ConflictError('Ja existe um atributo com esse nome!', {campo: 'nome'}) 

    return (await repository.save(body.nome))[0]
}

exports.findAllAtributos = async (query) => {
    let statusList = ['ativo', 'inativo', 'excluido']
    let statusQuery = query.status ? query.status.split(',') : ['ativo']    

    let statusInvalid = statusQuery.filter((s) => !statusList.includes(s))
    if(statusInvalid.length > 0) throw new ValidationError(`Status invalido: ${statusInvalid.join(', ')}`, {campo: 'status', motivo: 'invalido'})

    return await repository.findAll(statusQuery)
}

exports.findByIdAtributo = async (id) => {
    if(id == undefined) throw new ValidationError('Id do atributo faltando!', {campo: 'id', motivo: 'obrigratorio'})

    let atributo = await repository.findById(id)

    if(atributo.length == 0) throw new NotFoundError('Atributo nao encontrado!')

    return atributo[0]
}

exports.updateAtributo = async (id, body) => {
    let camposList = ['nome', 'status']

    if(id == undefined) throw new ValidationError('Id do atributo faltando!', {campo: 'id', motivo: 'obrigatorio'})

    let atributo = (await repository.findById(id))[0]

    if(!atributo) throw new NotFoundError('Atributo nao encontrado!') 

    let camposBody = Object.keys(body)
    let camposInvalid = camposBody.filter((c) => !camposList.includes(c))

    if(camposBody.length == 0) throw new ValidationError('Nenhum campo para atualizar!')
    if(camposInvalid.length > 0) throw new ValidationError(`Campos invalidos: ${camposInvalid.join(', ')}`, {campo: camposInvalid, motivo: 'invalido'})

    if((body.nome != undefined) && (await this.existsAtributoNome(body.nome))) throw new ConflictError('Ja existe um atributo com esse nome!', {campo: 'nome'})

    if((body.status != undefined) && (!['ativo', 'inativo'].includes(body.status))) throw new ValidationError('Status deve ser: ativo ou inativo', {campo: 'status', motivo: 'invalido'})

    if((body.status != undefined) && (atributo.status == 'excluido')) throw new UnprocessableEntityError('Atributo excluido nao pode ter seu status modificado!', {statusAtual: 'excluido'})

    return await repository.update(id, body)
}

exports.updateStatusAtributo = async (id, body) => {
    let camposList = ['status']

    if(id == undefined) throw new ValidationError('Id do atributo faltando!', {campo: 'id', motivo: 'obrigatorio'})

    let atributo = (await repository.findById(id))[0]

    if(!atributo) throw new NotFoundError('Atributo nao encontrado!') 

    let camposBody = Object.keys(body)
    let camposInvalid = camposBody.filter((c) => !camposList.includes(c))

    if(camposBody.length == 0) throw new ValidationError('Nenhum campo para atualizar!')
    if(camposInvalid.length > 0) throw new ValidationError(`Campos invalidos: ${camposInvalid.join(', ')}`, {campo: camposInvalid, motivo: 'invalido'})

    if((body.status != undefined) && (!['ativo', 'inativo'].includes(body.status))) throw new ValidationError('Status deve ser: ativo ou inativo', {campo: 'status', motivo: 'invalido'})

    if((body.status != undefined) && (atributo.status == 'excluido')) throw new UnprocessableEntityError('Atributo excluido nao pode ter seu status modificado!', {statusAtual: 'excluido'})

    return await repository.update(id, body)
}

exports.removeAtributo = async (id) => {
    if(id == undefined) throw new ValidationError('Id do atributo faltando!', {campo: 'id', motivo: 'obrigatorio'})

    let atributo = (await repository.findById(id))[0]

    if(!atributo){ throw new Error('Atributo nao encontrado!') }
    if(atributo.status == 'excluido') throw new UnprocessableEntityError('Atributo ja exluido!', {statusAtual: 'excluido'})

    return await repository.update(id, {status: 'excluido'})
}