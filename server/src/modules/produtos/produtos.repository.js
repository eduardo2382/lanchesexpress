const pool = require('../../database/connection.js')

const repositoryGruposOpcoes = require('./grupos-opcoes.repository.js')

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
    let index = 1
    let values = []
    let placeholders = []

    let client = await pool.connect()

    try{
        await client.query('BEGIN')

        let produtoResult = await client.query(`INSERT INTO produtos(nome, categoria_id, tipo, produto_pai_id, preco_base, vai_para_cozinha) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, Object.values(produtoValues))
        let produto = (produtoResult.rows)[0]

        for(let insumo of insumosProduto){
            values.push(produto.id, insumo.insumo_id, insumo.quantidade)

            placeholders.push(`($${index}, $${index+1}, $${index+2})`)

            index += 3
        }

        if(values.length > 0){
            await client.query(`INSERT INTO produto_insumos(produto_id, insumo_id, quantidade) VALUES ($1, $2, $3)`, values)
        }

        await repositoryGruposOpcoes.saveGruposComplete(produto.id, gruposProduto, client)

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

exports.update = async (id, body, insumos=null) => {
    let campos = Object.keys(body)
    let values = Object.values(body)

    let resultInsumos;

    campos = campos.map((val, idx)=> `${val} = $${idx+1}`)
    values.push(id)

    let client = await pool.connect()

    try{
        client.query('BEGIN')

        let querie = `UPDATE produtos SET ${campos.join(', ')} WHERE id = $${campos.length + 1} RETURNING *`

        let result = await client.query(querie, values)

        if(insumos){
            console.log(await this.updateInsumos(id, insumos))
            resultInsumos = await this.updateInsumos(id, insumos)
        }

        client.query('COMMIT')

        return result.rows
    }catch(error){
        console.log(error)
        client.query('ROLLBACK')
        throw error
    }finally{
        client.release()
    }
}

exports.updateInsumos = async (produtoId, insumos) => {
    let index = 1

    let columns = Object.keys(insumos[0])
    columns.unshift('produto_id')

    let values = []
    let valuesQuerie = insumos.map((i) => {
        values.push(produtoId, i.insumo_id, i.quantidade)

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