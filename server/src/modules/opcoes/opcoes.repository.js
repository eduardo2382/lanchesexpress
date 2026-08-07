const pool = require('../../database/connection.js')

exports.save = async (nome, tipo) => {
    let result = await pool.query("INSERT INTO opcoes(nome, tipo) VALUES ($1, $2) RETURNING *", [nome, tipo])

    return result.rows
}

exports.findAll = async (statusQuery) => {
    let result = await pool.query("SELECT * FROM opcoes WHERE status = ANY($1)", [statusQuery])

    return result.rows
}

exports.findById = async (id) => {
    let result = await pool.query("SELECT * FROM opcoes WHERE id = $1", [id])

    return result.rows
}

exports.findOpcoesArryId = async (arr) => {
    let result = await pool.query("SELECT * FROM opcoes WHERE id = ANY($1)", [arr])

    return result.rows
}

exports.findByName = async (nome) => {
    let result = await pool.query("SELECT * FROM opcoes WHERE nome = $1 AND status = 'ativo'", [nome])

    return result.rows
}

exports.update = async (id, body) => {
    let campos = Object.keys(body)
    let values = Object.values(body)

    campos = campos.map((val, idx)=> `${val} = $${idx+1}`)
    values.push(id)

    let querie = `UPDATE opcoes SET ${campos.join(', ')} WHERE id = $${campos.length + 1} RETURNING *`

    let result = await pool.query(querie, values)

    return result.rows
}