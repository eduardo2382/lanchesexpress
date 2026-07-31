const pool = require('../../database/connection.js')

class InsumoRepository{
    async save({nome, tipo_medida, quantidade_atual, quantidade_minima}){
        let text = "INSERT INTO insumos(nome, tipo_medida, quantidade_atual, quantidade_minima) VALUES ($1, $2, $3, $4) RETURNING *"
        let values = [nome, tipo_medida, quantidade_atual, quantidade_minima]

        let result = await pool.query(text, values)

        return result.rows
    }

    async findAll(incluirInativos){
        let text = "SELECT * FROM insumos"

        if(!incluirInativos){
            text += " WHERE ativo = true"
        }

        let result = await pool.query(text)

        return result.rows
    }

    async findById(id){
        let result = await pool.query("SELECT * FROM insumos WHERE id = $1", [id])

        return result.rows
    }

    async findByName(nome){
        let result = await pool.query("SELECT * FROM insumos WHERE nome = $1 AND ativo = true", [nome])

        return result.rows
    }

    async findBellow(){
        let result = await pool.query("SELECT * FROM insumos WHERE quantidade_atual < quantidade_minima")

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

        let query = `UPDATE insumos SET ${campos.join(', ')} WHERE id = $${index} RETURNING *`

        let result = await pool.query(query, values)

        return result.rows
    }

    async delete(id){
        let result = await pool.query("UPDATE insumos SET ativo = false WHERE id = $1 RETURNING *", [id])

        return result.rows
    }
}

module.exports = InsumoRepository