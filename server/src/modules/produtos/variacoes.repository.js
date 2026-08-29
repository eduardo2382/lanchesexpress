const pool = require('../../database/connection.js')

exports.saveVariavel = async (produtoPai, variacoes) => {
    let client = await pool.connect()

    try {
        await client.query('BEGIN')

        let produtoPaiResult = await client.query(`INSERT INTO produtos(nome, categoria_id, tipo, produto_pai_id, preco_base, vai_para_cozinha) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, Object.values(produtoPai))

        let produto = (produtoPaiResult.rows[0])

        for(variacao of variacoes){
            let variacaoValues = {
                nome: variacao.nome,
                categoria_id: produto.categoria_id,
                tipo: 'simples',
                produto_pai_id: produto.id,
                preco_base: variacao.preco_base,
                vai_para_cozinha: false
            }

            let produtoVariacaoResult = await client.query('INSERT INTO produtos(nome, categoria_id, tipo, produto_pai_id, preco_base, vai_para_cozinha) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', Object.values(variacaoValues))

            let produtoVariacao = produtoVariacaoResult.rows[0]
            console.log(produtoVariacaoResult.rows)

            // atributos
            let indexAtr = 1
            let valuesAtr = []
            let placeholdersAtr = []

            for(let atributo of variacao.atributos){
                valuesAtr.push(produtoVariacao.id, atributo.atributo_id, atributo.valor)

                placeholdersAtr.push(`($${indexAtr}, $${indexAtr+1}, $${indexAtr+2})`)

                indexAtr += 3
            }

            let atributosResult = await client.query(`INSERT INTO produto_atributos(produto_id, atributo_id, valor) VALUES ${placeholdersAtr.join(', ')} RETURNING *`, valuesAtr)

            //insumos
            if(variacao.insumos.length > 0){
                let indexIns = 1
                let valuesIns = []
                let placeholdersIns = []

                for(let insumo of variacao.insumos){
                    valuesIns.push(produto.id, insumo.insumo_id, insumo.quantidade)

                    placeholdersIns.push(`($${indexIns}, $${indexIns+1}, $${indexIns+2})`)

                    indexIns += 3
                }

                let insumosResult = await client.query(`INSERT INTO produto_insumos(produto_id, insumo_id, quantidade) VALUES ${placeholdersIns.join(', ')} RETURNING *`, valuesIns)
            }
        }

        await client.query('COMMIT')

        return produto
    }catch(error) {
        await client.query('ROLLBACK')
        throw error
    }finally{
        await client.release()
    }
}

exports.saveVariacoes = async (produtoPai, variacoes) => {
    let client = await pool.connect()
    let arrayVariacao = []

    try{
        await client.query('BEGIN')

        for(variacao of variacoes){
            let variacaoValues = {
                nome: variacao.nome,
                categoria_id: produtoPai.categoria_id,
                tipo: 'simples',
                produto_pai_id: produtoPai.id,
                preco_base: variacao.preco_base,
                vai_para_cozinha: false
            }

            let produtoVariacaoResult = await client.query('INSERT INTO produtos(nome, categoria_id, tipo, produto_pai_id, preco_base, vai_para_cozinha) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', Object.values(variacaoValues))

            let produtoVariacao = produtoVariacaoResult.rows[0]
            arrayVariacao.push(produtoVariacao)

            // atributos
            let indexAtr = 1
            let valuesAtr = []
            let placeholdersAtr = []

            for(let atributo of variacao.atributos){
                valuesAtr.push(produtoVariacao.id, atributo.atributo_id, atributo.valor)

                placeholdersAtr.push(`($${indexAtr}, $${indexAtr+1}, $${indexAtr+2})`)

                indexAtr += 3
            }

            let atributosResult = await client.query(`INSERT INTO produto_atributos(produto_id, atributo_id, valor) VALUES ${placeholdersAtr.join(', ')} RETURNING *`, valuesAtr)

            //insumos
            if(variacao.insumos.length > 0){
                let indexIns = 1
                let valuesIns = []
                let placeholdersIns = []

                for(let insumo of variacao.insumos){
                    valuesIns.push(produtoVariacao.id, insumo.insumo_id, insumo.quantidade)

                    placeholdersIns.push(`($${indexIns}, $${indexIns+1}, $${indexIns+2})`)

                    indexIns += 3
                }

                let insumosResult = await client.query(`INSERT INTO produto_insumos(produto_id, insumo_id, quantidade) VALUES ${placeholdersIns.join(', ')} RETURNING *`, valuesIns)
            }
        }

        await client.query('COMMIT')

        return arrayVariacao
    }catch(error){
        await client.query('ROLLBACK')
        throw error
    }finally{
        await client.release()
    }
}

exports.findVariacoes = async (produtoPaiId) => {
    let querie = `
    SELECT p.id, p.nome, p.preco_base, p.status, json_agg(json_build_object('atributo_id', pa.atributo_id, 'nome', a.nome, 'valor', pa.valor )) AS atributos FROM produtos p JOIN produto_atributos pa ON pa.produto_id = p.id JOIN atributos a ON pa.atributo_id = a.id WHERE produto_pai_id = $1 GROUP BY p.id;`

    let result = await pool.query(querie, [produtoPaiId])

    return result.rows
}
/*
`
SELECT 
    p.id, 
    p.nome, 
    p.preco_base, 
    p.status, 
    json_agg(
        json_build_object(
            'atributo_id', pa.atributo_id, 
            'nome', a.nome, 
            'valor', pa.valor 
        )
    ) AS atributos 
    FROM produtos p 
    LEFT JOIN produto_atributos pa ON pa.produto_id = p.id 
    LEFT JOIN atributos a ON pa.atributo_id = a.id 
    WHERE produto_pai_id = $1 GROUP BY p.id;
`
*/