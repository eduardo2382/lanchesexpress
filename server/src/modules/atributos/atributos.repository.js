const pool = require('../../database/connection.js')

class AtributoRepository {
    async save(nome){
        let result = await pool.query('INSERT INTO atributos(nome) VALUES ($1) RETURNING *', [nome])

        return result.rows
    }

    async findAll(statusQuery){
        let result = await pool.query("SELECT * FROM atributos WHERE status = ANY($1)", [statusQuery])

        return result.rows
    }

    async findById(id){
        let result = await pool.query('SELECT * FROM atributos WHERE id = $1', [id])

        return result.rows
    }

    async findByName(nome){
        let result = await pool.query("SELECT * FROM atributos WHERE nome = $1 AND status = 'ativo'", [nome])

        return result.rows
    }

    async update(id, body){
        let campos = []
        let values = []
        let index = 1

        if(body.nome != undefined){
            campos.push(`nome = $${index}`)
            values.push(body.nome)
            index++
        }

        if(body.status != undefined){
            campos.push(`status = $${index}`)
            values.push(body.status)
            index++
        }

        values.push(id)

        let query = `UPDATE atributos SET ${campos.join(', ')} WHERE id = $${index} RETURNING *`

        let result = await pool.query(query, values)

        return result.rows
    }
}

module.exports = AtributoRepository