const repositoryPedidos = require('./pedidos.repository.js')

const { findProdutoArrayId, updateProduto } = require('../produtos/produtos.service.js')
const { findOpcaoItemIds } = require('../produtos/grupos-opcoes.service.js')

const validator = require('./pedidos.validator.js')

const { ValidationError, NotFoundError, ConflictError, InsufficientStockError, UnprocessableEntityError} = require('../../error/AppError.js')

async function validateProdutosIds(arrayIds){
    let existsArrayIds = (await findProdutoArrayId(arrayIds)).map((i) => i.id)

    let idsInvalid = arrayIds.filter((id) => !existsArrayIds.includes(id))

    if(idsInvalid.length > 0) throw new NotFoundError(`Produtos nao encontrados: ${idsInvalid.join(', ')}`)
}

async function validateOpcoesIds(arrayIds){
    let existsArrayIds = (await findOpcaoItemIds(arrayIds)).map((i) => i.id)

    let idsInvalid = arrayIds.filter((id) => !existsArrayIds.includes(id))

    if(idsInvalid.length > 0) throw new NotFoundError(`Opcoes nao encontradas: ${idsInvalid.join(', ')}`)
}

async function validateItens(itensArray){
    let arrayProdutoIds = itensArray.map((i) => i.produto_id)
    await validateProdutosIds(arrayProdutoIds)

    for(let item of itensArray){
        if(item.opcoes){
            let arrayOpcaoItemIds = item.opcoes.map((op) => op.grupo_opcao_item_id)
            await validateOpcoesIds(arrayOpcaoItemIds)
        }
    }
}

async function validatePagamentos(pagamentosArray){
    let arrayPagamentosIds = pagamentosArray.map((pag) => pag.forma_pagamento_id)

    let existsArrayIds = (await repositoryPedidos.existsPagamentoArrayId(arrayPagamentosIds)).map((i) => i.id)

    let idsInvalid = arrayPagamentosIds.filter((id) => !existsArrayIds.includes(id))

    if(idsInvalid.length > 0) throw new NotFoundError(`Formas de pagamento nao encontradas: ${idsInvalid.join(', ')}`)
}

async function calculatePrecosItems(itens){
    let total = 0
    let precoProdutos = []

    let arrayProdutoIds = itens.map((item) => item.produto_id)
    let arrayProdutos = await findProdutoArrayId(arrayProdutoIds)

    for(let produto of arrayProdutos){
        let produtoItem = itens.find((item) => item.produto_id == produto.id)

        total += produto.preco_base * produtoItem.quantidade 
        precoProdutos.push({id: produto.id, total: Number(produto.preco_base), opcoes: []})
    }

    for(let item of itens){
        let produto = precoProdutos.find((p) => p.id == item.produto_id)
        let produtoItemOpcoes = (itens.find((item) => item.produto_id == produto.id)).opcoes

        if(item.opcoes){
            let arrayOpcoesIds = item.opcoes.map((opcao) => opcao.grupo_opcao_item_id)
            let arrayOpcoes = await findOpcaoItemIds(arrayOpcoesIds)

            for(let opcao of arrayOpcoes){
                let opcaoItem = produtoItemOpcoes.find((op) => op.grupo_opcao_item_id == opcao.id)
                
                let precoOpcao = opcao.preco * opcaoItem.quantidade
                
                total += precoOpcao

                produto.total += precoOpcao
                produto.opcoes.push({id: opcao.id, preco: opcao.preco})
            }
        }
    }

    return {'total': total, 'arrayPrecosProdutos': precoProdutos}
}

function validatePagamento(pagamentos, total){
    let totalPagamentos = 0;
    pagamentos.map((pag) => totalPagamentos += pag.valor)
    if(totalPagamentos != total) throw new UnprocessableEntityError('O total de formas de pagamento informadas nao condiz com o total do pedido!')
}

async function validatePedidoId(id){
    let pedido = await repositoryPedidos.existsPedido(id) 
    return pedido
}

exports.createPedido = async (body) => {
    validator.validateCreatePedido(body)

    await validateItens(body.itens)

    await validatePagamentos(body.pagamentos)

    await calculatePrecosItems(body.itens)

    let {total, arrayPrecosProdutos} = await calculatePrecosItems(body.itens)

    for(let item of body.itens){
        let produtoPreco = arrayPrecosProdutos.find((pp) => pp.id == item.produto_id)

        item.preco = produtoPreco.total

        if(item.opcoes){
            for(let opcao of item.opcoes){
                let opcaoProdutoPreco = produtoPreco.opcoes.find((opp) => opp.id == opcao.grupo_opcao_item_id)

                opcao.preco = opcaoProdutoPreco.preco
            }
        }

        if(!item.observacao) item.observacao = undefined
    }

    let payload = {
        ...body,
        total: total
    }

    validatePagamento(body.pagamentos, total)

    return repositoryPedidos.savePedido(payload)
}

exports.findAllPedidos = async (query) => {
    query = validator.validateQuery(query)

    console.log('status:', query.status)

    if(query.data) console.log('data:', query.data)
    else query.data = undefined

    return await repositoryPedidos.findAll(query.status, query.data)
}

exports.findById = async (id) => {
    if((await validatePedidoId(id)).length > 0){
        return await repositoryPedidos.findById(id)
    }else{
        throw new ValidationError('Pedido nao encontrado!', {campo: 'pedido_id', motivo: 'invalido'})
    }
}

exports.updateStatus = async (id, body) => {
    validator.validateBodyUpdateStatus(body)

    let pedido = (await validatePedidoId(id))[0]

    if(!pedido)throw new ValidationError('Pedido nao encontrado!', {campo: 'pedido_id', motivo: 'invalido'})

    if(pedido.status == "cancelado")throw new UnprocessableEntityError('Pedido cancelado nao pode ter seu status alterado!')

    return await repositoryPedidos.updateStatus(id, body.status)
}