const pool = require('../../database/connection.js')

exports.save = async (nome) => {
    let result = await pool.query('INSERT INTO atributos(nome) VALUES ($1) RETURNING *', [nome])

    return result.rows
}

exports.findAll = async (statusQuery) => {
    let result = await pool.query("SELECT * FROM atributos WHERE status = ANY($1)", [statusQuery])

    return result.rows
}

exports.findById = async (id) => {
    let result = await pool.query('SELECT * FROM atributos WHERE id = $1', [id])

    return result.rows
}

exports.findByName = async (nome) => {
    let result = await pool.query("SELECT * FROM atributos WHERE nome = $1 AND status = 'ativo'", [nome])

    return result.rows
}

exports.update = async (id, body) => {
    let campos = Object.keys(body)
    let values = Object.values(body)

    campos = campos.map((val, idx)=> `${val} = $${idx+1}`)
    values.push(id)

    let querie = `UPDATE atributos SET ${campos.join(', ')} WHERE id = $${campos.length + 1} RETURNING *`

    let result = await pool.query(querie, values)

    return result.rows
}