const pool = require('../../database/connection.js')

exports.findByName = async (nome) => {
    let result = await pool.query('SELECT * FROM formas_pagamento WHERE nome = $1', [nome])

    return result.rows
}

exports.findAll = async (statusList) => {
    let result = await pool.query('SELECT * FROM formas_pagamento WHERE status = ANY($1)', [statusList])

    return result.rows
}

exports.findById = async (id) => {
    let result = await pool.query('SELECT * FROM formas_pagamento WHERE id = $1', [id])

    return result.rows
}

exports.createPagamento = async (nome) => {
    let result = await pool.query('INSERT INTO formas_pagamento(nome) VALUES ($1) RETURNING *', [nome])

    return result.rows
}

exports.updatePagamento = async (id, body) => {
    let index = 1
    let placeholder = []
    let values = []

    for(let campo of  Object.keys(body)){
        placeholder.push(`${campo} = $${index}`)
        values.push(body[campo])
        index++
    }

    values.push(id)

    let querie = `UPDATE formas_pagamento SET ${placeholder.join(', ')} WHERE id = $${index} RETURNING *`

    console.log(querie)

    let result = await pool.query(querie, values)

    console.log(result.rows)
    
}