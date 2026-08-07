const pool = require('../../database/connection.js')

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