const repositoryProdutos = require('./produtos.repository.js')
const repositoryVariavel = require('./variacoes.repository.js')

const { ValidationError, NotFoundError, ConflictError, InsufficientStockError, UnprocessableEntityError} = require('../../error/AppError.js')

const { existsCategoriaId } = require('../categorias/categorias.service.js')
const { existsAtributoArrayId } = require('../atributos/atributos.service.js')
const { existsInsumoArrayId } = require('../insumos/insumos.service.js')

const validator = require('./produtos.validator.js')

async function validateAtributos(atributosArray) {
    atributosArray.forEach((a) => {
        if(!a.atributo_id) throw new ValidationError('Id do atributo faltando!', {campo: 'atriibuto_id', motivo: 'obrigatorio'})
        if(!a.valor) throw new ValidationError('Valor do atributo faltando!', {campo: 'valor', motivo: 'obrigatorio'})
    });

    let arrayIds = atributosArray.map((a) => a.atributo_id)

    let existsArrayIds = (await existsAtributoArrayId(arrayIds)).map((i) => i.id)
    
    let idsInvalid = arrayIds.filter((id) => !existsArrayIds.includes(id))

    if(idsInvalid.length > 0) throw new NotFoundError(`Atributos nao encontrados: ${idsInvalid.join(', ')}`)
}

async function validateProdutoNome(nome, categoriaId) {
    if(await repositoryProdutos.existsProdutoNome(nome, categoriaId)) throw new ConflictError('Ja existe um produto com esse nome nessa categoria!')
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

async function validateProdutoId(id){
    if(!id) throw new ValidationError('Id do produto faltando!', {campo: 'id', motivo: 'obrigatorio'})

    let produto = await repositoryProdutos.findById(id)

    if(produto.length == 0) throw new NotFoundError('Produto nao encontrado!')

    return produto
}

function setProdutoValue(body){
    return {
        nome: body.nome,
        categoria_id: body.categoria_id,
        tipo: 'variavel',
        produto_pai_id: null,
        preco_base: 0,
        vai_para_cozinha: false
    } 
}

exports.createProdutoVariavel = async (body) => {
    validator.validateCreateVariavelCampos(body)
    
    
    if(!await existsCategoriaId(body.categoria_id)) throw new NotFoundError('Categoria nao encontrada')

    if(await repositoryProdutos.existsProdutoNome(body.nome, body.categoria_id)) throw new ConflictError('Ja existe um produto nessa categoria com esse nome!', {campo: 'nome'})

    for(let variacao of body.variacoes){
        await validateAtributos(variacao.atributos)

        if(variacao.insumos.length > 0) await validateInsumos(variacao.insumos)
    }

    let produtoPaiValues = setProdutoValue(body)

    return await repositoryVariavel.saveVariavel(produtoPaiValues, body.variacoes)
}

exports.findVariacoes = async (id) => {
    let produto = (await validateProdutoId(id))[0]

    if(produto.produto_pai_id != null) throw new UnprocessableEntityError('Nao é possivel pegar variacoes de um produto filho!')

    if(['simples', 'montavel'].includes(produto.tipo)) throw new UnprocessableEntityError('Apenas produtos variaveis tem variacoes!')

    return await repositoryVariavel.findVariacoes(id)
}

exports.addVariacoes = async (id, body) => {
    let produtoPai = (await validateProdutoId(id))[0]

    if(produtoPai.produto_pai_id != null) throw new UnprocessableEntityError('Nao é possivel adicionar variacoes em um produto filho!')

    if(['simples', 'montavel'].includes(produtoPai.tipo)) throw new UnprocessableEntityError('Apenas produtos variaveis tem variacoes!')

    if(!Array.isArray(body)) throw new ValidationError('O body deve ser um array com as variacoes!', {campo: 'body', motivo: 'invalido'})

    body.forEach((variacao) => {
        validator.validateVariacao(variacao)
    })

    return await repositoryVariavel.saveVariacoes(produtoPai, body)
}

exports.updateVariacao = async (id, body) => {
    let insumos;

    validator.validateUpdateVariacaoCampos(body)

    let produto = (await validateProdutoId(id))[0]

    if(produto.produto_pai_id == null) throw new UnprocessableEntityError('Nao é possivel atualizar um produto pai aqui!')

    if(body.tipo) throw new UnprocessableEntityError('Nao é possivel mudar o tipo de um produto!')

    if(body.nome !== undefined){
        if(body.categoria_id) await validateProdutoNome(body.nome, body.categoria_id)
        else await validateProdutoNome(body.nome, produto.categoria_id)
    }

    if(body.status && produto.status == 'excluido') throw new UnprocessableEntityError('Um produto excluido nao pode ter seu status alterado!')

    if(body.preco_base && produto.produto_pai_id == 'null') throw new UnprocessableEntityError('Um produto pai nao pode ter um preco base!')

    if(body.insumos){
        insumos = body.insumos
        delete body.insumos
    }

    return await repositoryProdutos.update(id, body, insumos)
}

exports.deleteVariacao = async (id) => {
    let produto = (await validateProdutoId(id))[0]
        
    if(!produto) throw new NotFoundError('Produto nao encontrado!')

    if(produto.produto_pai_id == null) throw new UnprocessableEntityError('Nao é possivel excluir um produto pai aqui!')

    if(produto.status == 'excluido') throw new UnprocessableEntityError('Produto ja excluido!')

    return await repositoryProdutos.update(id, {status: 'excluido'})
}