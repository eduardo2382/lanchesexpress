class MovimentacaoRepository {
    async save(client, insumoId, delta, dados){
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

        return await client.query(query, values)        
    }
}

module.exports = MovimentacaoRepository