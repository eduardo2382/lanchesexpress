const pool = require('../../database/connection.js')

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