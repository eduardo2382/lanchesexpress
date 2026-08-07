const pool = require('../../database/connection.js')

exports.saveSimples = async (produtoValues, insumosProduto) => { 
    let keys = Object.keys(produtoValues)
    let values = Object.values(produtoValues)
    let columns = keys.join(', ')
    let placeholders = keys.map((_, idx) => `$${idx+1}`).join(', ')

    let client = await pool.connect()

    try{
        await client.query('BEGIN')

        let produtoResult = await client.query(`INSERT INTO produtos(${columns}) VALUES (${placeholders}) RETURNING *`, values)

        let produto = (produtoResult.rows)[0]

        for(let i of insumosProduto){
            await client.query(
                'INSERT INTO produto_insumos(produto_id, insumo_id, quantidade) VALUES ($1, $2, $3)', 
                [produto.id, i.insumo_id, i.quantidade]
            )
        }

        await client.query('COMMIT')

        return produtoResult.rows

    }catch(error){
        await client.query('ROLLBACK')
        throw error
    }finally{
        await client.release()
    }
}

exports.saveMontavel = async (produtoValues, insumosProduto, gruposProduto) => {
    let keys = Object.keys(produtoValues)
    let values = Object.values(produtoValues)
    let columns = keys.join(', ')
    let placeholders = keys.map((_, idx) => `$${idx+1}`).join(', ')

    let client = await pool.connect()

    try{
        await client.query('BEGIN')

        let produtoResult = await client.query(`INSERT INTO produtos(${columns}) VALUES (${placeholders}) RETURNING *`, values)
        let produto = (produtoResult.rows)[0]

        for(let i of insumosProduto){
            await client.query(
                'INSERT INTO produto_insumos(produto_id, insumo_id, quantidade) VALUES ($1, $2, $3)', 
                [produto.id, i.insumo_id, i.quantidade]
            )
        }

        for(let grupo of gruposProduto){
            let grupoResult = await client.query(
                'INSERT INTO grupos_opcoes(produto_id, nome, obrigatorio, tipo_selecao, tipo_preco) VALUES ($1, $2, $3, $4, $5) RETURNING *', 
                [produto.id, grupo.nome, grupo.obrigatorio, grupo.tipo_selecao, grupo.tipo_preco]
            )

            let grupoId = (grupoResult.rows)[0].id

            for(let item of grupo.itens){
                let grupoItens = Result = await client.query(
                    'INSERT INTO grupo_opcao_itens(grupo_id, opcao_id, preco) VALUES ($1, $2, $3) RETURNING *',
                    [grupoId, item.opcao_id, item.preco]
                )

                let grupoItensId = (grupoItens.rows)[0].id

                for(let insumo of item.insumos){
                    let insumoItem = await client.query(
                        'INSERT INTO grupo_opcao_item_insumos(grupo_opcao_item_id, insumo_id, quantidade) VALUES ($1, $2, $3) RETURNING *',
                        [grupoItensId, insumo.insumo_id, insumo.quantidade]
                    )
                }
            }
        }

        await client.query('COMMIT')

        return produtoResult.rows

    }catch(error){
        await client.query('ROLLBACK')
        throw error
    }finally{
        await client.release()
    }
}

exports.findByName = async (nome, categoriaId) => {
    let result = await pool.query('SELECT * FROM produtos WHERE nome = $1 AND categoria_id = $2', [nome, categoriaId])
    
    return result.rows
}

exports.existsProdutoNome = async (nome, categoriaId) => {
    let result = await pool.query('SELECT * FROM produtos WHERE nome = $1 AND categoria_id = $2', [nome, categoriaId])

    return (result.rows).length > 0
}

exports.existsProdutoId = async (id) => {
    let result = await pool.query('SELECT * FROM produtos WHERE id = $1', [id])

    return (result.rows).length > 0
}

exports.findAll = async (statusQuery, categoriaQuery) => {
    let result;

    if(categoriaQuery){
        result = await pool.query('SELECT * FROM produtos WHERE status = ANY($1) AND categoria_id = ANY($2)', [statusQuery, categoriaQuery])

        return result.rows
    }

    result = await pool.query('SELECT * FROM produtos WHERE status = ANY($1) ', [statusQuery])

    return result.rows
}

exports.findById = async (id) => {
    let result = await pool.query('SELECT * FROM produtos WHERE id = $1', [id])

    return result.rows
}

exports.findInsumosProduto = async (id) => {
    let result = await pool.query('SELECT * FROM produto_insumos WHERE produto_id = $1', [id])

    return result.rows
}

exports.findProdutoPaiById = async (id) => {
    let result = await pool.query('SELECT * FROM produtos WHERE id = $1 AND produto_pai_id IS null', [id])

    return result.rows
}

exports.findInsumosById = async (id) => {
    let result = await pool.query('SELECT pi.insumo_id, i.nome, i.tipo_medida, pi.quantidade  FROM produto_insumos pi JOIN insumos i ON i.id = pi.insumo_id WHERE pi.produto_id = $1;', [id])

    return result.rows
}

exports.update = async (id, body) => {
    let campos = Object.keys(body)
    let values = Object.values(body)

    campos = campos.map((val, idx)=> `${val} = $${idx+1}`)
    values.push(id)

    let querie = `UPDATE produtos SET ${campos.join(', ')} WHERE id = $${campos.length + 1} RETURNING *`

    let result = await pool.query(querie, values)

    return result.rows
}

exports.updateInsumos = async (produtoId, insumos) => {
    let index = 1

    let columns = Object.keys(insumos[0])
    columns.unshift('produto_id')

    let values = []
    let valuesQuerie = insumos.map((i) => {
        values.push(produtoId)
        values.push(i.insumo_id)
        values.push(i.quantidade)

        let value = `($${index}, $${index+1}, $${index+2})`
        index += 3

        return value
    })

    let querieInsert = `INSERT INTO produto_insumos(${columns.join(', ')}) VALUES ${valuesQuerie.join(', ')} RETURNING *`
    
    let querieDelete = `DELETE FROM produto_insumos WHERE produto_id = $1`

    let client = await pool.connect()

    try{
        await client.query('BEGIN ')

        let resultDelete = await client.query(querieDelete, [produtoId])

        let resultInsert = await client.query(querieInsert, values)

        await client.query('COMMIT')

        return resultInsert.rows
    }catch(error){
        await client.query('ROLLBACK')
        throw error
    }finally{
        await client.release()
    }
}