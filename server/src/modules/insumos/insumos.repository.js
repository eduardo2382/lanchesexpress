const pool = require('../../database/connection.js')
const MovimentacaoRepository = require('../estoque/movimentacoes.repository.js')

class InsumoRepository{
    #movimentacaoRepository

    constructor(){
        this.#movimentacaoRepository = new MovimentacaoRepository()
    }

    async save({nome, tipo_medida, quantidade_atual, quantidade_minima}){
        let text = "INSERT INTO insumos(nome, tipo_medida, quantidade_atual, quantidade_minima) VALUES ($1, $2, $3, $4) RETURNING *"
        let values = [nome, tipo_medida, quantidade_atual, quantidade_minima]

        let result = await pool.query(text, values)

        return result.rows
    }

    async findAll(statusQuery){
        let result = await pool.query("SELECT * FROM insumos WHERE status = ANY($1)", [statusQuery])

        return result.rows
    }

    async findById(id){
        let result = await pool.query("SELECT * FROM insumos WHERE id = $1", [id])

        return result.rows
    }

    async findByName(nome){
        let result = await pool.query("SELECT * FROM insumos WHERE nome = $1 AND status = 'ativo'", [nome])

        return result.rows
    }

    async findBellow(statusQuery){
        let result = await pool.query("SELECT * FROM insumos WHERE status = ANY($1) AND quantidade_atual < quantidade_minima", [statusQuery])

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

        if(body.tipo_medida != undefined){
            campos.push(`tipo_medida = $${index}`)
            values.push(body.tipo_medida)
            index++
        }

        if(body.quantidade_atual != undefined){
            campos.push(`quantidade_atual = $${index}`)
            values.push(body.quantidade_atual)
            index++
        }

        if(body.quantidade_minima != undefined){
            campos.push(`quantidade_minima = $${index}`)
            values.push(body.quantidade_minima)
            index++
        }

        if(body.status != undefined){
            campos.push(`status = $${index}`)
            values.push(body.status)
            index++
        }

        values.push(id)

        let query = `UPDATE insumos SET ${campos.join(', ')} WHERE id = $${index} RETURNING *`

        let result = await pool.query(query, values)

        return result.rows
    }

    async ajust(id, delta, body){
        const client = await pool.connect()

        try{
            await client.query('BEGIN')

            let insumo = await client.query('UPDATE insumos SET quantidade_atual = quantidade_atual + $1 WHERE id = $2 RETURNING *', [delta, id])

            await this.#movimentacaoRepository.save(client, id, delta, body)

            await client.query('COMMIT')

            return insumo.rows
        }catch(error){
            await client.query('ROLLBACK')
            throw error
        }finally{
            client.release()
        }
    }
}

module.exports = InsumoRepository