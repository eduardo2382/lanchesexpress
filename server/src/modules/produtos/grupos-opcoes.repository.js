const pool = require('../../database/connection.js')

exports.existsItem = async (itemId) => {
    let result = await pool.query('SELECT * FROM grupo_opcao_itens WHERE id = $1', [itemId])

    return (result.rows).length > 0
}

exports.existsGrupo = async (grupoId) => {
    let result = await pool.query('SELECT * FROM grupos_opcoes WHERE id = $1', [grupoId])

    return (result.rows).length > 0
}

exports.existsGrupo = async (grupoId) => {
    let result = await pool.query('SELECT * FROM grupos_opcoes WHERE id = $1', [grupoId])

    return (result.rows).length > 0
}

exports.findOpcaoItemArryId = async (arrayIds) => {
    let result = await pool.query("SELECT * FROM grupo_opcao_itens WHERE id = ANY($1)", [arrayIds])

    return result.rows
}

exports.saveGruposComplete = async (produtoId, gruposProduto, clientAt) => {
    let client;
    
    clientAt ? client = clientAt : client = await pool.connect()

    try{
        if(!clientAt) await client.query('BEGIN')

        // grupos
        
        if(!Array.isArray(gruposProduto)) gruposProduto = [gruposProduto]

        let indexGrupos = 1
        let valuesGrupos = []
        let placeholdersGrupos = []


        for(let grupo of gruposProduto){ // repeticao para os grupos
            valuesGrupos.push(produtoId, grupo.nome, grupo.tipo_selecao, grupo.tipo_preco, grupo.obrigatorio)
            
            placeholdersGrupos.push(`($${indexGrupos}, $${indexGrupos+1}, $${indexGrupos+2}, $${indexGrupos+3}, $${indexGrupos+4})`)

            indexGrupos += 5
        }
        

        let querieGrupos = `INSERT INTO grupos_opcoes(produto_id, nome, tipo_selecao, tipo_preco, obrigatorio) VALUES ${placeholdersGrupos.join(', ')} RETURNING *`

        let resultGrupos = await client.query(querieGrupos, valuesGrupos)

        // itens

        let indexItens = 1
        let valuesItens = []
        let placeholdersItens = []
        let itensInsumos = []

        gruposProduto.forEach((grupo, i) => {
            let grupoId = resultGrupos.rows[i].id

            for(let item of grupo.itens){
                valuesItens.push(grupoId, item.opcao_id, item.preco)
            
                placeholdersItens.push(`($${indexItens}, $${indexItens+1}, $${indexItens+2})`)

                indexItens += 3

                itensInsumos.push(item.insumos)
            }
        })

        let resultItens = {rows: []}
        if (valuesItens.length > 0) {
            let queryItens = ` INSERT INTO grupo_opcao_itens (grupo_id, opcao_id, preco) VALUES ${placeholdersItens.join(', ')} RETURNING id`;
            resultItens = await client.query(queryItens, valuesItens);
        }

        // insumos

        let indexInsumos = 1;
        let valuesInsumos = [];
        let placeholdersInsumos = [];

        itensInsumos.forEach((insumos, k) => {
            let itemId = resultItens.rows[k].id

            for(let insumo of insumos){
                valuesInsumos.push(itemId, insumo.insumo_id, insumo.quantidade);
                placeholdersInsumos.push(`($${indexInsumos}, $${indexInsumos+1}, $${indexInsumos+2})`);
                indexInsumos += 3;
            }
        })

        if (valuesInsumos.length > 0) {
            let queryInsumos = `INSERT INTO grupo_opcao_item_insumos(grupo_opcao_item_id, insumo_id, quantidade) VALUES ${placeholdersInsumos.join(', ')} RETURNING *`;
            await client.query(queryInsumos, valuesInsumos);
        }

        if(!clientAt) await client.query('COMMIT')

        return resultGrupos.rows

    }catch(error){
        if(!clientAt){
            await client.query('ROLLBACK')
        }
        throw error
    }finally{
        if(!clientAt) await client.release()
    }
}

exports.findGruposItensInsumos = async (produtoId) => {
    console.log('ola')
    let querie = `
        SELECT json_agg(
                json_build_object(
                        'id', gp.id,
                        'nome', gp.nome,
                        'obrigatorio', gp.obrigatorio,
                        'tipo_selecao', gp.tipo_selecao,
                        'tipo_preco', gp.tipo_preco,
                        'itens', (
                                SELECT json_agg(
                                        json_build_object(
                                                'grupo_opcao_item_id', oi.id,
                                                'opcao_id', oi.opcao_id,
                                                'nome', op.nome,
                                                'preco', oi.preco,
                                                'insumos', (
                                                        SELECT json_agg(
                                                                json_build_object(
                                                                        'insumo_id', ii.insumo_id,
                                                                        'quantidade', ii.quantidade
                                                                )
                                                        )
                                                        FROM grupo_opcao_item_insumos ii
                                                        WHERE ii.grupo_opcao_item_id = oi.id
                                                )
                                        )
                                )
                                FROM grupo_opcao_itens oi
                                LEFT JOIN opcoes op ON op.id = oi.opcao_id AND gp.status = 'ativo'
                                WHERE oi.grupo_id = gp.id AND oi.status = 'ativo'
                        ),
                        'status', gp.status
                )
        ) AS grupos
        FROM grupos_opcoes gp
        WHERE gp.produto_id = $1 AND gp.status = 'ativo';
    `

    let result = await pool.query(querie, [produtoId])

    console.log(result.rows)


    return result.rows
}

exports.findGrupos = async (produtoId) => {
    let result = await pool.query('SELECT * FROM grupos_opcoes WHERE produto_id = $1', [produtoId])

    return result.rows
}

exports.findGrupoById = async (grupoId) => {
    let result = await pool.query('SELECT * FROM grupos_opcoes WHERE id = $1', [grupoId])

    return result.rows
}

exports.updateGrupo = async (grupoId, body) => {
    let columns = Object.keys(body)
    let values = Object.values(body)

    columns = columns.map((val, idx) => `${val} = $${idx+1}`)
    values.push(grupoId)

    let querie  = `UPDATE grupos_opcoes SET ${columns.join(', ')} WHERE id = $${columns.length + 1} RETURNING *`

    let result = await pool.query(querie, values)

    return result.rows
}

exports.updateItem = async (itemId, body) => {
    let columns = Object.keys(body)
    let values = Object.values(body)

    columns = columns.map((val, idx) => `${val} = $${idx+1}`)
    values.push(itemId)

    let querie = `UPDATE grupo_opcao_itens SET ${columns.join(', ')} WHERE id = $${columns.length + 1} RETURNING *`

    let result = await pool.query(querie, values)

    return result.rows
}

exports.linkOpcao = async (grupoId, body) => {
    let client = await pool.connect()

    try{
        await client.query('BEGIN')

        let values = [grupoId, body.opcao_id, body.preco]
        let querie = `INSERT INTO grupo_opcao_itens(grupo_id, opcao_id, preco) VALUES ($1, $2, $3) RETURNING *`

        let resultGrupoOpcao = (await client.query(querie, values)).rows[0]

        if(body.insumos){
            let index = 1
            let valuesInsumos = []
            let placeholdersInsumos = []

            for(let insumo of body.insumos){
                valuesInsumos.push(resultGrupoOpcao.id, insumo.insumo_id, insumo.quantidade)
                placeholdersInsumos.push(`($${index}, $${index+1}, $${index+2})`)
                index += 3
            }

            let querieInsumos = `INSERT INTO grupo_opcao_item_insumos(grupo_opcao_item_id, insumo_id, quantidade) VALUES ${placeholdersInsumos.join(', ')}` 

            await client.query(querieInsumos, valuesInsumos)
        }

        await client.query('COMMIT')

        return resultGrupoOpcao.rows
    }catch(error){
        await client.query('ROLLBACK')
        throw error
    }finally{
        await client.release()
    }
} 

exports.linkInsumo = async (itemId, body) => {
    let insumos = body.insumos

    let index = 1
    let values = []
    let placeholders = []

    for(let insumo of insumos){
        values.push(itemId, insumo.insumo_id, insumo.quantidade)
        placeholders.push(`($${index}, $${index+1}, $${index+2})`)
        index += 3
    }

    let querie = `INSERT INTO grupo_opcao_item_insumos(grupo_opcao_item_id, insumo_id, quantidade) VALUES ${placeholders.join(', ')} RETURNING *`

    let result = await pool.query(querie, values)

    return result.rows
}

exports.removeGrupo = async (grupoId) => {
    let resultGrupos = await pool.query("UPDATE grupos_opcoes SET status = 'excluido' WHERE id = $1", [grupoId])

    let resultItens = await pool.query("UPDATE grupo_opcao_itens SET status = 'excluido' WHERE grupo_id = $1", [grupoId])
}

exports.removeItem = async (itemId) => {
    let resultItens = await pool.query("UPDATE grupo_opcao_itens SET status = 'excluido' WHERE id = $1", [itemId])

    let resultInsumos = await pool.query("UPDATE grupo_opcao_item_insumos SET status = 'excluido' WHERE grupo_opcao_item_id = $1", [itemId])
}

exports.removeInsumo = async (itemId, insumoId) => {
    let resultInsumo = await pool.query("UPDATE grupo_opcao_item_insumos SET status = 'excluido' WHERE grupo_opcao_item_id = $1 AND insumo_id = $2", [itemId, insumoId])
}