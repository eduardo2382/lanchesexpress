const repository = require('./insumos.repository.js')
const { ValidationError, ConflictError, NotFoundError, UnprocessableEntityError, InsufficientStockError } = require('../../error/AppError.js')

exports.existsInsumoId = async (id) => {
    return (await repository.findById(id)).length > 0
}

exports.existsInsumoArrayId = async (arr) => {
    return await repository.findInsumosArryId(arr)
}

exports.existsInsumoNome = async (nome) => {
    return (await repository.findByName(nome)).length > 0
}

exports.createInsumo = async (body) => {
    if(body.nome == undefined) throw new ValidationError('Nome do insumo faltando!', {campo: 'nome', motivo: 'obrigatorio'})

    if(body.tipo_medida == undefined) throw new Error('Tipo de medida do insumo faltando!', {campo: 'tipo_medida', motivo: 'obrigatorio'})

    if(await this.existsInsumoNome(body.nome)) throw new ConflictError('Ja existe um insumo com esse nome!', {campo: 'nome'}) 

    let values = {
        nome: body.nome,
        tipo_medida: body.tipo_medida,
        quantidade_atual: body.quantidade_atual ?? 0,
        quantidade_minima: body.quantidade_minima ?? 0
    }

    return (await repository.save(values))[0]
}

exports.findAllInsumos = async (query) => {
    let statusList = ['ativo', 'inativo', 'excluido']
    let statusQuery = query.status ? query.status.split(',') : ['ativo']

    let statusInvalid = statusQuery.filter((s) => !statusList.includes(s))
    if(statusInvalid.length > 0) throw new ValidationError(`Status invalido: ${statusInvalid.join(', ')}`, {campo: 'status', motivo: 'invalido'})

    return await repository.findAll(statusQuery)
}

exports.findByIdInsumo = async (id) => {
    if(id == undefined) throw new ValidationError("Id faltando!", {campo: 'id', motivo: 'obrigatorio'})

    let insumo = (await repository.findById(id))[0]

    if(!insumo) throw new NotFoundError('Insumo nao encontrado')

    return insumo
}

exports.findBellowInsumos = async (query) => {
    let statusList = ['ativo', 'inativo', 'excluido']
    let statusQuery = query.status ? query.status.split(',') : ['ativo']

    let statusInvalid = statusQuery.filter((s) => !statusList.includes(s))
    if(statusInvalid.length > 0) throw new ValidationError(`Status invalido: ${statusInvalid.join(', ')}`, {campo: 'status', motivo: 'invalido'}) 

    return await repository.findBellow(statusQuery)
}

exports.updateInsumo = async (id, body) => {
    let camposList = ['nome', 'tipo_medida', 'quantidade_atual', 'quantidade_minima', 'status']

    if(id == undefined) throw new ValidationError("Id do insumo faltando!", {campo: 'id', motivo: 'obrigatorio'}) 

    let insumo = (await repository.findById(id))[0]

    if(!insumo) throw new NotFoundError('Insumo nao encontrado')

    let camposBody = Object.keys(body)
    let camposInvalid = camposBody.filter((c) => !camposList.includes(c))

    if(camposBody.length == 0) throw new ValidationError('Nenhum campo para atualizar!')
    if(camposInvalid.length > 0) throw new ValidationError(`Campos invalidos: ${camposInvalid.join(', ')}`, {campo: camposInvalid, motivo: 'invalido'})

    if(body.nome != undefined && (await this.existsInsumoNome(body.nome))) throw new ConflictError('Ja existe um insumo com esse nome!', {campo: 'nome'})

    if((body.status != undefined) && (!['ativo', 'inativo'].includes(body.status))) throw new Validation('Status deve ser: ativo ou inativo', {campo: 'status', motivo: 'invalido'})

    if((body.status != undefined) && (insumo.status == 'excluido')) throw new UnprocessableEntityError('Insumo excluido nao pode ter seu status modificado!', {statusAtual: 'excluido'})

    return await repository.update(id, body)
}

exports.updateStatusInsumo = async (id, body) => {
    let camposList = ['status']

    if(id == undefined) throw new ValidationError("Id do insumo faltando!", {campo: 'id', motivo: 'obrigatorio'}) 

    let insumo = (await repository.findById(id))[0]

    if(!insumo) throw new NotFoundError('Insumo nao encontrado')

    let camposBody = Object.keys(body)
    let camposInvalid = camposBody.filter((c) => !camposList.includes(c))

    if(camposBody.length == 0) throw new ValidationError('Nenhum campo para atualizar!')
    if(camposInvalid.length > 0) throw new ValidationError(`Campos invalidos: ${camposInvalid.join(', ')}`, {campo: camposInvalid, motivo: 'invalido'})

    if((body.status != undefined) && (!['ativo', 'inativo'].includes(body.status))) throw new Validation('Status deve ser: ativo ou inativo', {campo: 'status', motivo: 'invalido'})

    if((body.status != undefined) && (insumo.status == 'excluido')) throw new UnprocessableEntityError('Insumo excluido nao pode ter seu status modificado!', {statusAtual: 'excluido'})

    return await repository.update(id, body)
}

exports.removeInsumo = async (id) => {
    if(id == undefined) throw new ValidationError('Id do insumo faltando!', {campo: 'id', motivo: 'obrigatorio'})

    let insumo = (await repository.findById(id))[0]

    if(!insumo){ throw new Error('Insumo nao encontrado!') }
    if(insumo.status == 'excluido') throw new UnprocessableEntityError('Insumo ja exluido!', {statusAtual: 'excluido'})

    return await repository.update(id, {status: 'excluido'})
}

exports.ajustInsumo = async (id, body) => {
    let delta;
    let updatedInsumo;
    let tiposList = ['entrada', 'saida', 'ajuste']
    let motivosList = ['compra', 'perda', 'ajuste_manual']
    let camposList = ['tipo', 'motivo', 'quantidade']

    if(id == undefined) throw new ValidationError('Id do insumo faltando!', {campo: 'id', motivo: 'obrigatorio'})

    let insumo = (await repository.findById(id))[0]
    let quantidadeAtual = Number(insumo.quantidade_atual)

    if(!insumo) throw new NotFoundError('Insumo nao encontrado')

    let camposBody = Object.keys(body)
    let camposInvalid = camposBody.filter((c) => !camposList.includes(c))

    if(camposInvalid.length > 0) throw new ValidationError(`Campos invalidos: ${camposInvalid.join(', ')}`, {campo: camposInvalid, motivo: 'invalido'})

    if(body.tipo == undefined) throw new ValidationError('Tipo da movimentacao faltando!', {campo: 'tipo', motivo: 'obrigatorio'})

    if(!tiposList.includes(body.tipo)) throw new ValidationError('Tipo deve ser: entrada, saida ou ajuste', {campo: 'tipo', motivo: 'invalido'})

    if(body.motivo == undefined) throw new ValidationError('Motivo da movimentacao faltando!', {campo: 'motivo', motivo: 'obrigatorio'})

    if(body.motivo == 'venda') throw new ValidationError('Motivo deve ser: compra, perda ou ajuste_manual', {campo: 'motivo', motivo: 'invalido'})

    if(!motivosList.includes(body.motivo)) throw new ValidationError('Motivo deve ser: compra, perda ou ajuste_manual', {campo: 'motivo', motivo: 'invalido'})

    if(body.quantidade == undefined) throw new ValidationError('Quantidade da movimentacao faltando!', {campo: 'quantidade', campo: 'obrigatorio'})

    switch (body.tipo) {
        case 'ajuste':
            delta = body.quantidade - quantidadeAtual
            
            updatedInsumo = await repository.ajust(id, delta, {
                tipo: body.tipo, 
                motivo: body.motivo,
                movimentacao_quantidade: delta
            })
            
            break;

        case 'entrada':
            delta = +body.quantidade

            updatedInsumo = await repository.ajust(id, delta, {
                tipo: body.tipo, 
                motivo: body.motivo,
                movimentacao_quantidade: body.quantidade
            })

            break

        case 'saida':
            delta = -body.quantidade

            let newQuantidadeAtual = quantidadeAtual + delta

            if(newQuantidadeAtual < 0) throw new InsufficientStockError('Valor de saida maior que a quantidade atual do insumo!')

            updatedInsumo = await repository.ajust(id, delta, {
                tipo: body.tipo, 
                motivo: body.motivo,
                movimentacao_quantidade: body.quantidade
            })

            break
    
        default:
            break;
    }

    return updatedInsumo
}

exports.subtractInsumo = async(insumos, client=undefined) => {
    for(let [insumo_id, quantidade] of insumos){
        let insumo = (await repository.findById(insumo_id))[0]

        if(!insumo)throw new ValidationError("O insumo nao existe")

        if((insumo.quantidade_atual - quantidade) < 0)throw new UnprocessableEntityError(`Estoque do insumo ${insumo.nome} insuficiente!`)

        if(insumo.status != 'ativo'){
            insumos.delete(insumo_id)
        }
    }

    await repository.subtractInsumo(insumos, client)
}