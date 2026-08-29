const { ValidationError } = require('../../error/AppError.js')

const CAMPOS_PERMITIDOS_CREATE_PEDIDO = ['itens', 'pagamentos']
const CAMPOS_PERMITIDOS_ITEM = ['produto_id', 'quantidade', 'opcoes', 'observacao']
const CAMPOS_PERMITIDOS_OPCAO_ITEM = ['grupo_opcao_item_id', 'quantidade']
const CAMPOS_PERMITIDOS_PAGAMENTOS = ['forma_pagamento_id', 'valor']

const STATUS_PERMITIDOS = ['recebido', 'cancelado']

exports.validateCreatePedido = (body) => {
    let camposBody = body ? Object.keys(body) : []
    if(camposBody.length == 0) throw new ValidationError('Nenhum campo foi passado no body!', {campo: 'body', motivo: 'obrigatorio'})      

    let camposInvalid = camposBody.filter((c) => !CAMPOS_PERMITIDOS_CREATE_PEDIDO.includes(c))
    if(camposInvalid.length > 0) throw new ValidationError(`Campos invalidos: ${camposInvalid.join(', ')}`, {campo: camposInvalid, motivo: 'invalido'})

    if(!body.itens || body.itens.length == 0) throw new ValidationError('Itens do pedido faltando!', {campo: 'itens', motivo: 'obrigatorio'})

    if(!Array.isArray(body.itens)) throw new ValidationError('Itens do pedido deve ser um array!', {campo: 'itens', motivo: 'invalido'})

    for(let item of body.itens){
        this.validateItemPedido(item)
    }

    if(!body.pagamentos || body.pagamentos.length == 0) throw new ValidationError('Formas de pagamento faltando!', {campo: 'pagamentos', motivo: 'obrigatorio'})

    if(!Array.isArray(body.pagamentos)) throw new ValidationError('Formas de pagamento deve ser um array!', {campo: 'pagamentos', motivo: 'invalido'})

    for(let pagamento of body.pagamentos){
        this.validatePagamento(pagamento)
    }
}

exports.validateItemPedido = (item) => {
    let camposItem = item ? Object.keys(item) : []
    if(camposItem.length == 0) throw new ValidationError('Item sem nenhum campo!', {campo: 'item', motivo: 'obrigatorio'})  

    let camposInvalid = camposItem.filter((c) => !CAMPOS_PERMITIDOS_ITEM.includes(c))
    if(camposInvalid.length > 0) throw new ValidationError(`Campos invalidos: ${camposInvalid.join(', ')}`, {campo: camposInvalid, motivo: 'invalido'})

    if(!item.produto_id) throw new ValidationError('Id de produto faltando!', {campo: 'produto_id', motivo: 'obrigatorio'})
    if((typeof item.produto_id) != 'number') throw new ValidationError('Id de produto deve ser um numero!', {campo: 'produto_id', motivo: 'invalido'})

    if(!item.quantidade) throw new ValidationError('Quantidade do produto faltando!', {campo: 'quantidade', motivo: 'obrigatorio'})
    if((typeof item.produto_id) != 'number') throw new ValidationError('Quantidade do produto deve ser um numero!', {campo: 'quantidade_item', motivo: 'invalido'})

    if(item.observacao){
        if((typeof item.observacao) != 'string') throw new ValidationError('A observacao deve ser uma string!', {campo: 'observacao', motivo: 'invalido'})
        if(item.observacao.length > 100) throw new ValidationError('A observacao deve ter no maximo 100 caracteres!', {campo: 'observacao', motivo: 'invalido'})
    }

    if(item.opcoes){
        if(!Array.isArray(item.opcoes)) throw new ValidationError('Opcoes do produto deve ser um array!', {campo: 'opcoes', motivo: 'invalido'})

        for(let opcao of item.opcoes){
            this.validateOpcaoItem(opcao)
        }
    }
}

exports.validateOpcaoItem = (opcao) => {
    let camposOpcaoItem = opcao ? Object.keys(opcao) : []
    if(camposOpcaoItem.length == 0) throw new ValidationError('Opcao do item sem nenhum campo!', {campo: 'opcao', motivo: 'obrigatorio'}) 

    let camposInvalid = camposOpcaoItem.filter((c) => !CAMPOS_PERMITIDOS_OPCAO_ITEM.includes(c))
    if(camposInvalid.length > 0) throw new ValidationError(`Campos invalidos: ${camposInvalid.join(', ')}`, {campo: camposInvalid, motivo: 'invalido'})
        
    if(!opcao.grupo_opcao_item_id) throw new ValidationError('Id da opcao faltando!', {campo: 'grupo_opcao_item_id', motivo: 'obrigatorio'})
    if((typeof opcao.grupo_opcao_item_id) != 'number') throw new ValidationError('Id da opcao deve ser um numero!', {campo: 'produto_id', motivo: 'invalido'})

    if(!opcao.quantidade) throw new ValidationError('Quantidade da opcao faltando!', {campo: 'quantidade_opcao', motivo: 'obrigatorio'})
    if((typeof opcao.quantidade) != 'number') throw new ValidationError('Quantidade do produto deve ser um numero!', {campo: 'quantidade', motivo: 'invalido'})
}

exports.validatePagamento = (pagamento) => {
    let camposPagamento = pagamento ? Object.keys(pagamento) : []
    if(camposPagamento.length == 0) throw new ValidationError('Pagamento sem nenhum campo!', {campo: 'pagamento', motivo: 'obrigatorio'}) 

    let camposInvalid = camposPagamento.filter((c) => !CAMPOS_PERMITIDOS_PAGAMENTOS.includes(c))
    if(camposInvalid.length > 0) throw new ValidationError(`Campos invalidos: ${camposInvalid.join(', ')}`, {campo: camposInvalid, motivo: 'invalido'})
        
    if(!pagamento.forma_pagamento_id) throw new ValidationError('Id da forma de pagamento faltando!', {campo: 'forma_pagamento_id', motivo: 'obrigatorio'})
    if((typeof pagamento.forma_pagamento_id) != 'number') throw new ValidationError('Id da forma de pagamento deve ser um numero!', {campo: 'forma_pagamento_id', motivo: 'invalido'})

    if(!pagamento.valor) throw new ValidationError('Valor do pagamento faltando!', {campo: 'valor', motivo: 'obrigatorio'})
    if((typeof pagamento.valor) != 'number') throw new ValidationError('Valor do pagamento deve ser um numero!', {campo: 'valor', motivo: 'invalido'}) 
}   

exports.validateBodyUpdateStatus = (body) => {
    if(!body || !body.status) throw new ValidationError('Status faltando!', {campo: 'body', motivo: 'obrigatorio'})

    let camposBody = Object.keys(body)
    let camposInvalid = camposBody.filter((c) => c != 'status')

    if(camposInvalid.length > 0) throw new ValidationError(`Campos invalidos: ${camposInvalid.join(', ')}`, {campo: 'body', motivo: 'invalido'})
}

exports.validateQuery = (query) => {
    let statusList = query.status ? query.status.split(',') : ['recebido']    
    
    let statusInvalid = statusList.filter((s) => !STATUS_PERMITIDOS.includes(s))
    if(statusInvalid.length > 0) throw new ValidationError(`Status invalido: ${statusInvalid.join(', ')}`, {campo: 'status', motivo: 'invalido'})
    
    query.status = statusList

    return query
}

