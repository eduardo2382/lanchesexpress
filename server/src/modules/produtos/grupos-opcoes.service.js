const repositoryGruposOpcoes = require('./grupos-opcoes.repository.js')
const repositoryProdutos = require('./produtos.repository.js')

const { existsOpcaoArrayId }  = require('../opcoes/opcoes.service.js')
const { existsInsumoArrayId } = require('../insumos/insumos.service.js')

const produtoValidator = require('./produtos.validator.js')

const { UnprocessableEntityError } = require('../../error/AppError.js')

async function validateProdutoId(id){
    if(!id) throw new ValidationError('Id do produto faltando!', {campo: 'id', motivo: 'obrigatorio'})

    let produto = await repositoryProdutos.findById(id)

    if(produto.length == 0) throw new NotFoundError('Produto nao encontrado!')

    return produto
}

async function validateOpcoes(itensArray){
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