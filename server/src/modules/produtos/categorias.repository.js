const pool = require("../../database/connection.js")

class CategoriaRepository {
    async save(name){
        let value = [name]

        let result = await pool.query('INSERT INTO categorias(nome) VALUES ($1) RETURNING *', value)

        return result.rows
    }
    
    async findAll(){
        let result = await pool.query('SELECT * FROM categorias')

        return result.rows
    }

    async findByName(name){
        let value = [name]

        let result = await pool.query("SELECT * FROM categorias WHERE nome = $1", value)

        return result.rows
    }

    
}

module.exports = CategoriaRepository