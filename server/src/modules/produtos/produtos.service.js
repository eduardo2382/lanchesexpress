const repository = require('./produtos.repository.js')
const validator = require('./produtos.validator.js')

const { ValidationError, NotFoundError, ConflictError, InsufficientStockError, UnprocessableEntityError} = require('../../error/AppError.js')

const { existsCategoriaId, existsCategoriaArrayId } = require('../categorias/categorias.service.js')
const { existsInsumoId, existsInsumoArrayId } = require('../insumos/insumos.service.js')
const { existsOpcaoId, existsOpcaoArrayId } = require('../opcoes/opcoes.service.js')

const gruposOpcoesRepository = require('./grupos-opcoes.repository.js')


function setProdutoValue(body){
    return {
        nome: body.nome,
        categoria_id: body.categoria_id,
        tipo: body.tipo,
        produto_pai_id: body.produto_pai_id ?? null,
        preco_base: body.preco_base ?? 0,
        vai_para_cozinha: body.vai_para_cozinha ?? false
    } 
}

async function setGruposProduto(grupos){
    let gruposProduto = []

    for(let grupo of grupos){
        validator.validateGrupo(grupo)

        if(grupo.itens.length == 0) throw new ValidationError('Grupo sem itens', {campo: 'itens grupo', motivo: 'obrigatorio'})

        await validateOpcoes(grupo.itens)

        for(let item of grupo.itens){
            validator.validateItem(item)
            if(item.insumos && item.insumos.length > 0){
                await validateInsumos(item.insumos)
            }
        }

        gruposProduto.push({
            nome: grupo.nome,
            tipo_selecao: grupo.tipo_selecao,
            tipo_preco: grupo.tipo_preco,
            obrigatorio: grupo.obrigatorio ?? true,
            itens: grupo.itens
        })
    }

    return gruposProduto
}

async function validateProdutoNome(nome, categoriaId) {
    if(await repository.existsProdutoNome(nome, categoriaId)) throw new ConflictError('Ja existe um produto com esse nome nessa categoria!')
}

async function validateProdutoId(id){
    if(!id) throw new ValidationError('Id do produto faltando!', {campo: 'id', motivo: 'obrigatorio'})

    let produto = await repository.findById(id)

    if(produto.length == 0) throw new NotFoundError('Produto nao encontrado!')

    return produto
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

async function validateOpcoes(itensArray){
    let arrayIds = itensArray.map((i) => i.opcao_id)

    let existsArrayIds = (await existsOpcaoArrayId(arrayIds)).map((op) => op.id)

    let idsInvalid = arrayIds.filter((id) => !existsArrayIds.includes(id))

    if(idsInvalid.length > 0) throw new NotFoundError(`Opcoes nao encontradas: ${idsInvalid.join(', ')}`)
}

async function validateCategoriaId(categoriaId){
    if(!await existsCategoriaId(categoriaId)) throw new NotFoundError('Categoria nao encontrada')
}

async function validateQueryCategoria(categoriasArray){
    let existsArrayIds = (await existsCategoriaArrayId(categoriasArray)).map((cat) => cat.id)

    let idsInvalid = categoriasArray.filter((id) => !existsArrayIds.includes(id))

    if(idsInvalid.length > 0) throw new NotFoundError(`Categorias nao encontradas: ${idsInvalid.join(', ')}`)
}

async function validateProdutoPai(produto_id) {
    let produtoPai = await repository.findProdutoPaiById(produto_id ?? 0)

    if(produtoPai.length == 0) throw new NotFoundError('Produto pai nao encotrado!') 
}

exports.findProdutoArrayId = async (arrayIds) => {
    return await repository.findProdutosArryId(arrayIds)
}

exports.createProduto = async (body) => {
    validator.validateCreateCampos(body)
    
    if(!await existsCategoriaId(body.categoria_id)) throw new NotFoundError('Categoria nao encontrada')

    if(await repository.existsProdutoNome(body.nome, body.categoria_id)) throw new ConflictError('Ja existe um produto nessa categoria com esse nome!', {campo: 'nome'})

    if(body.insumos.length > 0){
        await validateInsumos(body.insumos)
    }

    let produtoValues = setProdutoValue(body)

    if(body.tipo == 'simples'){
        let createdProduto = await repository.saveSimples(produtoValues, body.insumos)
        return createdProduto[0]
    }

    let gruposProduto = await setGruposProduto(body.grupos)

    let createdProduto = await repository.saveMontavel(produtoValues, body.insumos, gruposProduto)

    return createdProduto[0]
}

exports.findAllProdutos = async (query) => {
    let statusList = validator.validateQueryStatus(query.status)
    let categoriaList = undefined;

    if(query.categoria){
        categoriaList = query.categoria.split(',')
        categoriaList = categoriaList.map((cat) => Number(cat))

        await validateQueryCategoria(categoriaList)
    }

    return repository.findAll(statusList, categoriaList)
}

exports.findProdutoById = async (id) => {
    if(!id) throw new ValidationError('Id do produto faltando!', {campo: 'id', motivo: 'obrigatorio'})

    let produto = (await validateProdutoId(id))[0]

    produto.insumos = await repository.findInsumosProduto(id)

    if(produto.tipo == 'montavel'){
        produto.grupos = (await gruposOpcoesRepository.findGruposItensInsumos(id))[0].grupos
    }

    return produto
}

exports.findInsumosById = async (id) => {
    validateProdutoId(id)

    return await repository.findInsumosById(id)
}

exports.updateProduto = async (id, body) => {
    validator.validateUpdateCampos(body)

    let produto = (await validateProdutoId(id))[0]

    if(produto.status === 'excluido' && body.status !== undefined) throw new UnprocessableEntityError('Produto excluido nao pode ter seu status modificado!', {statusAtual: 'excluido'})

    if(body.categoria_id !== undefined) await validateCategoriaId(body.categoria_id)

    if(body.tipo) throw new UnprocessableEntityError('Nao é possivel mudar o tipo de um produto!')

    if(body.nome !== undefined){
        if(body.categoria_id) await validateProdutoNome(body.nome, body.categoria_id)
        if(body.categoria_id === undefined) await validateProdutoNome(body.nome, produto.categoria_id)
    }

    if(body.produto_pai_id) throw new UnprocessableEntityError(`Um produto ${produto.tipo} nao pode ter seu produto pai id alterado!`)

    return (await repository.update(id, body))[0]
}

exports.updateStatusProduto = async (id, body) => {
    validator.validateUpdateStatusCampos(body)

    await validateProdutoId(id)

    return (await repository.update(id, body))[0]
}

exports.updateInsumosProduto = async (id, body) => {
    validateProdutoId(id)

    validator.validateUpdateInsumos(body)

    await validateInsumos(body.insumos)

    return (await repository.updateInsumos(id, body.insumos))
}

exports.removeProduto = async (id) => {
    let produto = (await validateProdutoId(id))[0]
    
    if(!produto) throw new NotFoundError('Produto nao encontrado!')

    if(produto.status == 'excluido') throw new UnprocessableEntityError('Produto ja excluido!')

    return await repository.update(id, {status: 'excluido'})
}