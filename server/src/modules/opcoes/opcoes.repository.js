const pool = require('../../database/connection.js')

class OpcaoRepository {
    async save(nome, tipo){
        let result = await pool.query("INSERT INTO opcoes(nome, tipo) VALUES ($1, $2) RETURNING *", [nome, tipo])

        return result.rows
    }

    async findAll(statusQuery){
        let result = await pool.query("SELECT * FROM opcoes WHERE status = ANY($1)", [statusQuery])

        return result.rows
    }

    async findById(id){
        let result = await pool.query("SELECT * FROM opcoes WHERE id = $1", [id])

        return result.rows
    }

    async findByName(nome){
        let result = await pool.query("SELECT * FROM opcoes WHERE nome = $1 AND status = 'ativo'", [nome])

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

        if(body.tipo != undefined){
            campos.push(`tipo = $${index}`)
            values.push(body.tipo)
            index++
        }

        values.push(id)

        let query = `UPDATE opcoes SET ${campos.join(', ')} WHERE id = $${index} RETURNING *`

        let result = await pool.query(query, values)

        return result.rows
    }
}

module.exports = OpcaoRepository