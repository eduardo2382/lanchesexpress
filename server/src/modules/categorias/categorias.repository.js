const pool = require("../../database/connection.js")

class CategoriaRepository {
    async save(nome){
        let result = await pool.query('INSERT INTO categorias(nome) VALUES ($1) RETURNING *', [nome])

        return result.rows
    }
    
    async findAll(){
        let result = await pool.query('SELECT * FROM categorias')

        return result.rows
    }

    async findByName(nome){
        let result = await pool.query("SELECT * FROM categorias WHERE nome = $1", [nome])

        return result.rows
    }

    
}

module.exports = CategoriaRepository