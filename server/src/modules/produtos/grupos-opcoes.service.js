const repositoryGruposOpcoes = require('./grupos-opcoes.repository.js')
const repositoryProdutos = require('./produtos.repository.js')

const { existsOpcaoArrayId }  = require('../opcoes/opcoes.service.js')
const { existsInsumoArrayId, existsInsumoId } = require('../insumos/insumos.service.js')

const produtoValidator = require('./produtos.validator.js')

const { UnprocessableEntityError, NotFoundError, ValidationError } = require('../../error/AppError.js')

async function validateProdutoId(id){
    if(!id) throw new ValidationError('Id do produto faltando!', {campo: 'id', motivo: 'obrigatorio'})

    let produto = await repositoryProdutos.findById(id)

    if(produto.length == 0) throw new NotFoundError('Produto nao encontrado!')

    return produto
}

async function validateOpcoes(itensArray){
    if(!Array.isArray(itensArray)) itensArray = [itensArray]

    let arrayIds = itensArray.map((i) => i.opcao_id)

    let existsArrayIds = (await existsOpcaoArrayId(arrayIds)).map((op) => op.id)

    let idsInvalid = arrayIds.filter((id) => !existsArrayIds.includes(id))

    if(idsInvalid.length > 0) throw new NotFoundError(`Opcoes nao encontradas: ${idsInvalid.join(', ')}`)
}

async function validateInsumos(insumosArray){
    insumosArray.forEach((i)=>{
        if(!i.insumo_id) throw new ValidationError('Id do insumo faltando!', {campo: 'insumo_id', motivo: 'obrigatorio'})
        if(!i.quantidade) throw new ValidationError('Quantidade do insumo faltando!', {campo: 'quantidade', motivo: 'obrigatorio'})
    })

    let arrayIds = insumosArray.map((i) => i.insumo_id)

    let existsArrayIds = (await existsInsumoArrayId(arrayIds)).map((i) => i.id)

    let idsInvalid = arrayIds.filter((id) => !existsArrayIds.includes(id))

    if(idsInvalid.length > 0) throw new NotFoundError(`Insumos nao encontrados: ${idsInvalid.join(', ')}`)
}

exports.findOpcaoItemIds = async (arrayIds) => {
    return await repositoryGruposOpcoes.findOpcaoItemArryId(arrayIds)
}

exports.findGruposById = async (id) => {
    let produto = (await validateProdutoId(id))[0]

    if(['simples', 'variavel'].includes(produto.tipo)) throw new UnprocessableEntityError('Produto do tipo simples ou variavel nao tem grupos')

    return await repositoryGruposOpcoes.findGrupos(id)
}

exports.createGrupo = async (id, body) => {
    produtoValidator.validateGrupo(body)

    for(let item of body.itens){
        produtoValidator.validateItem(item)
        await validateInsumos(item.insumos)
    }

    await validateOpcoes(body.itens)

    return await repositoryGruposOpcoes.saveGruposComplete(id, body)
}

exports.updateGrupo = async (grupoId, body) => {
    let existsGrupo = (await repositoryGruposOpcoes.findGrupoById(grupoId))[0]

    if(!existsGrupo) throw new NotFoundError('Grupo nao encontrado')

    if(existsGrupo.status == 'excluido' && body.status) throw new UnprocessableEntityError('Grupo excluido nao pode ter seu status modificado!')

    produtoValidator.validateUpdateCamposGrupo(body)

    return await repositoryGruposOpcoes.updateGrupo(grupoId, body)
}

exports.linkOpcao = async (grupoId, body) => {
    produtoValidator.validateItem(body)
    await validateOpcoes(body)

    if(body.insumos && body.insumos.length > 0){
        await validateInsumos(body.insumos)
    }

    return await repositoryGruposOpcoes.linkOpcao(grupoId, body)
}

exports.linkInsumo = async (itemId, body) => {
    produtoValidator.validateUpdateInsumos(body)

    let existsItem = await repositoryGruposOpcoes.existsItem(itemId)

    if(!existsItem) throw new NotFoundError('Item nao encontrado!')

    return (await repositoryGruposOpcoes.linkInsumo(itemId, body))[0]
}

exports.updatePrecoItem = async (itemId, body) => {
    produtoValidator.validateUpdatePrecoItem(body)

    let existsItem = await repositoryGruposOpcoes.existsItem(itemId)

    if(!existsItem) throw new NotFoundError('Item nao encontrado!')
 
    return (await repositoryGruposOpcoes.updateItem(itemId, body))[0]
}

exports.removeGrupo = async (grupoId) => {
    let existsGrupo = repositoryGruposOpcoes.existsGrupo(grupoId)

    if(!existsGrupo) throw new NotFoundError('Grupo nao encontrado')

    await repositoryGruposOpcoes.removeGrupo(grupoId)
}

exports.removeItem = async (itemId) => {
    let existsItem = repositoryGruposOpcoes.existsItem(itemId)

    if(!existsItem) throw new NotFoundError('Item nao encontrado')

    await repositoryGruposOpcoes.removeItem(itemId)
}

exports.removeInsumo = async (itemId, insumoId) => {
    let existsItem = repositoryGruposOpcoes.existsItem(itemId)
    let existsInsumo = existsInsumoId(insumoId)

    if(!existsItem) throw new NotFoundError('Item nao encontrado')
    if(!existsInsumo) throw new NotFoundError('Insumo nao encontrado')

    await repositoryGruposOpcoes.removeInsumo(itemId, insumoId)
}