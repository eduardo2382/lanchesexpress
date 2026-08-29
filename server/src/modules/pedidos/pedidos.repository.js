const pool = require('../../database/connection.js')

const serviceInsumos = require('../insumos/insumos.service.js')

const repositoryMovimentacoes = require('../estoque/movimentacoes.repository.js')

exports.existsPagamentoArrayId = async (arrayIds) => {
    let result = await pool.query("SELECT * FROM formas_pagamento WHERE id = ANY($1)", [arrayIds])

    return result.rows
}

async function countInsumos(itens, client){
    const consumoInsumos = new Map()

    for(let item of itens){
        let insumosProduto = (await client.query('SELECT * FROM produto_insumos WHERE produto_id = $1', [item.produto_id])).rows

        if(insumosProduto.length > 0){
            for(let insumo of insumosProduto){
                let totalQuant = insumo.quantidade * item.quantidade

                consumoInsumos.set(
                    insumo.insumo_id,
                    (consumoInsumos.get(insumo.insumo_id) || 0) + totalQuant
                )
            }
        }

        if(item.opcoes){
            for(let opcaoItem of item.opcoes){
                let insumosOpcao = (await client.query('SELECT * FROM grupo_opcao_item_insumos WHERE grupo_opcao_item_id = $1', [opcaoItem.grupo_opcao_item_id])).rows

                if(insumosOpcao.length > 0){
                    for(let insumo of insumosOpcao){
                        let totalQuant = insumo.quantidade * opcaoItem.quantidade

                        consumoInsumos.set(
                            insumo.insumo_id,
                            (consumoInsumos.get(insumo.insumo_id) || 0) + totalQuant
                        )
                    }
                }
            }
        }
    }

    return consumoInsumos
}

async function registerMovimentacoes(count, client, pedido_id){
    for(let [insumo_id, quantidade] of count){
        let body = {
            tipo: 'saida',
            motivo: 'venda',
            pedido_id, pedido_id
        }

        let result = await repositoryMovimentacoes.register(client, insumo_id, -quantidade, body)
    }
}

exports.existsPedido = async (id) => {
    return (await pool.query('SELECT * FROM pedidos WHERE id = $1', [id])).rows
}

exports.savePedido = async (payload) => {
    let client = await pool.connect()

    try{
        client.query('BEGIN')

        let resultPedido = await client.query("INSERT INTO pedidos(valor_total) VALUES ($1) RETURNING *", [payload.total])
        let pedido = resultPedido.rows[0]

        let indexItem = 1
        let valuesItem = []
        let placeholdersItem = []

        for(let item of payload.itens){
            valuesItem.push(pedido.id, item.produto_id, item.quantidade, item.preco, item.observacao)

            placeholdersItem.push(`($${indexItem}, $${indexItem+1}, $${indexItem+2}, $${indexItem+3}, $${indexItem+4})`)

            indexItem += 5
        }

        let resultPedidoItens = await client.query(`INSERT INTO pedido_itens(pedido_id, produto_id, quantidade, preco_unitario, observacao) VALUES ${placeholdersItem.join(', ')} RETURNING *`, valuesItem)
        let pedidoItens = resultPedidoItens.rows

        for(let item of payload.itens){
            if(item.opcoes){
                let pedidoItemId = (pedidoItens.find((pI) => pI.produto_id == item.produto_id)).id

                let indexOpcao = 1
                let valuesOpcao = []
                let placeholdersOpcao = []

                for(let opcao of item.opcoes){
                    valuesOpcao.push(pedidoItemId, opcao.grupo_opcao_item_id, opcao.preco, opcao.quantidade)

                    placeholdersOpcao.push(`($${indexOpcao}, $${indexOpcao+1}, $${indexOpcao+2}, $${indexOpcao+3})`)

                    indexOpcao += 4
                }

                let resultItemOpcoes = await client.query(`INSERT INTO pedido_item_opcoes(pedido_item_id, grupo_opcao_item_id, preco_aplicado, quantidade) VALUES ${placeholdersOpcao.join(', ')}`, valuesOpcao)
            }
        }

        let indexPagemento = 1
        let valuesPagamento = []
        let placeholdersPagamento = []

        for(let pagamento of payload.pagamentos){
            valuesPagamento.push(pedido.id, pagamento.forma_pagamento_id, pagamento.valor)

            placeholdersPagamento.push(`($${indexPagemento}, $${indexPagemento+1}, $${indexPagemento+2})`)
 
            indexPagemento += 3
        }

        let resultPedidoPagamentos = await client.query(`INSERT INTO pedido_pagamentos(pedido_id, forma_pagamento_id, valor) VALUES ${placeholdersPagamento.join(', ')} RETURNING *`, valuesPagamento)

        let count = await countInsumos(payload.itens, client)

        await serviceInsumos.subtractInsumo(count, client)

        registerMovimentacoes(count, client, pedido.id)
        
        client.query('COMMIT')
    }catch(error){
        client.query('ROLLBACK')
        throw error
    }finally{
        client.release()
    }
}

exports.findAll = async (statusList, data) => {
    let result;

    if(data){
        result = await pool.query("SELECT * FROM pedidos WHERE status = ANY($1) AND criado_em::date = $2", [statusList, data])

        return result.rows
    }

    result = await pool.query('SELECT * FROM pedidos WHERE status = ANY($1) ', [statusList])

    return result.rows
}

exports.findById = async (id) => {
    let result = await pool.query(`
        SELECT
            pedido.id,
            pedido.valor_total,
            json_agg(
                json_build_object(
                    'item_id', item.id,
                    'produto_id', item.produto_id,
                    'opcoes', COALESCE(item_opcoes.opcoes, '[]'::json),
                    'quantidade', item.quantidade,
                    'preco_unitario', item.preco_unitario,
                    'observacao', item.observacao
                )
            ) AS itens,
            pedido.criado_em,
            pedido.status
        FROM pedidos AS pedido
        LEFT JOIN pedido_itens AS item ON pedido.id = item.pedido_id
        LEFT JOIN LATERAL (
            SELECT json_agg(
                json_build_object(
                    'opcao_id', opcao.id,
                    'grupo_opcao_item_id', opcao.grupo_opcao_item_id,
                    'preco_aplicado', opcao.preco_aplicado,
                    'quantidade', opcao.quantidade
                )
            ) AS opcoes
            FROM pedido_item_opcoes AS opcao
            WHERE opcao.pedido_item_id = item.id
        ) AS item_opcoes ON true
        WHERE pedido.id = $1
        GROUP BY pedido.id;   
    `, [id])

    return result.rows
}

exports.updateStatus = async (id, status) => {
    let result = await pool.query('UPDATE pedidos SET status = $1 WHERE id = $2 RETURNING *', [status, id])

    return result.rows
}