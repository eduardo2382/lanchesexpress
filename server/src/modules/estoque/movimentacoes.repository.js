const pool = require('../../database/connection.js')

exports.register = async (client, insumoId, delta, dados) =>{
    let campos = []
    let values = []
    let keys = []
    let index = 1

    campos.push(`insumo_id`)
    keys.push(`$${index}`)
    values.push(insumoId)
    index++

    campos.push(`tipo`)
    keys.push(`$${index}`)
    values.push(dados.tipo)
    index++

    campos.push(`quantidade`)
    keys.push(`$${index}`)
    values.push(delta)
    index++

    campos.push(`motivo`)
    keys.push(`$${index}`)
    values.push(dados.motivo)
    index++

    if(dados.pedido_id != undefined){
        campos.push(`pedido_id`)
        keys.push(`$${index}`)
        values.push(dados.pedido_id)
        index++
    }

    let query = `INSERT INTO movimentacoes_estoque(${campos.join(', ')}) VALUES (${keys.join(', ')}) RETURNING *`

    return (await client.query(query, values)).rows
}

exports.findAll = async (query) => {
    let condicoes = []
    let values = []
    let index = 1

    if(query.insumo_id){
        condicoes.push(`insumo_id = ANY($${index})`)
        values.push(query.insumo_id)
        index++
    }

    if(query.data_inicio){
        condicoes.push(`criado_em::date >= $${index}`)
        values.push(query.data_inicio)
        index++
    }

    if(query.data_fim){
        condicoes.push(`criado_em::date <= $${index}`)
        values.push(query.data_fim)
        index++
    }

    if(query.motivo){
        condicoes.push(`motivo = ANY($${index})`)
        values.push(query.motivo)
        index++
    }

    if(query.tipo){
        condicoes.push(`tipo = ANY($${index})`)
        values.push(query.tipo)
        index++
    }

    console.log('condicoes', condicoes)
    console.log('values', values)

    let where = condicoes.length > 0 ? `WHERE ${condicoes.join(' AND ')}` : ''
    let querie = `SELECT * FROM movimentacoes_estoque ${where} ORDER BY criado_em DESC`

    
    let result = await pool.query(querie, values)
    return result.rows
}   