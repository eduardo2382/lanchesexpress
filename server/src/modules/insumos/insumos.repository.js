const pool = require('../../database/connection.js')
const MovimentacaoRepository = require('../estoque/movimentacoes.repository.js')
const movimentacaoRepository = new MovimentacaoRepository()

exports.save = async ({nome, tipo_medida, quantidade_atual, quantidade_minima}) => {
    let text = "INSERT INTO insumos(nome, tipo_medida, quantidade_atual, quantidade_minima) VALUES ($1, $2, $3, $4) RETURNING *"
    let values = [nome, tipo_medida, quantidade_atual, quantidade_minima]

    let result = await pool.query(text, values)

    return result.rows
}

exports.findAll = async (statusQuery) => {
    let result = await pool.query("SELECT * FROM insumos WHERE status = ANY($1)", [statusQuery])

    return result.rows
}

exports.findById = async (id) => {
    let result = await pool.query("SELECT * FROM insumos WHERE id = $1", [id])

    return result.rows
}

exports.findInsumosArryId = async (arr) => {
    let result = await pool.query("SELECT * FROM insumos WHERE id = ANY($1)", [arr])

    return result.rows
}

exports.findByName = async (nome) => {
    let result = await pool.query("SELECT * FROM insumos WHERE nome = $1 AND status = 'ativo'", [nome])

    return result.rows
}

exports.findBellow = async (statusQuery) => {
    let result = await pool.query("SELECT * FROM insumos WHERE status = ANY($1) AND quantidade_atual < quantidade_minima", [statusQuery])

    return result.rows
}

exports.update = async (id, body) => {
    let campos = Object.keys(body)
    let values = Object.values(body)

    campos = campos.map((val, idx)=> `${val} = $${idx+1}`)
    values.push(id)

    let querie = `UPDATE insumos SET ${campos.join(', ')} WHERE id = $${campos.length + 1} RETURNING *`

    let result = await pool.query(querie, values)

    return result.rows
}

exports.ajust = async (id, delta, body) => {
    const client = await pool.connect()

    try{
        await client.query('BEGIN')

        let insumo = await client.query('UPDATE insumos SET quantidade_atual = quantidade_atual + $1 WHERE id = $2 RETURNING *', [delta, id])

        await movimentacaoRepository.save(client, id, delta, body)

        await client.query('COMMIT')

        return insumo.rows
    }catch(error){
        await client.query('ROLLBACK')
        throw error
    }finally{
        await client.release()
    }
}