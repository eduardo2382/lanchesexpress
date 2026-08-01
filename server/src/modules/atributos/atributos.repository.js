const pool = require('../../database/connection.js')

class AtributoRepository {
    async save(nome){
        let result = await pool.query('INSERT INTO atributos(nome) VALUES ($1) RETURNING *', [nome])

        return result.rows
    }

    async findAll(incluirInativos){
        let query = 'SELECT * FROM atributos'

        if(!incluirInativos){
            query += ' WHERE ativo = true'
        }

        let result = await pool.query(query)

        return result.rows
    }

    async findById(id){
        let result = await pool.query('SELECT * FROM atributos WHERE id = $1', [id])

        return result.rows
    }

    async findByName(nome){
        let result = await pool.query('SELECT * FROM atributos WHERE nome = $1 AND ativo = true', [nome])

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

        if(body.ativo != undefined){
            campos.push(`ativo = $${index}`)
            values.push(body.ativo)
            index++
        }

        values.push(id)

        let query = `UPDATE atributos SET ${campos.join(', ')} WHERE id = $${index} RETURNING *`

        let result = await pool.query(query, values)

        return result.rows
    }

    async delete(id){
        let result = await pool.query('UPDATE atributos SET ativo = false WHERE id = $1 RETURNING *', [id])

        return result.rows
    }
}

module.exports = AtributoRepository