const CategoriaRepository = require('./categorias.repository.js')

class CategoriaService {
    #repository;

    constructor(){
        this.#repository = new CategoriaRepository()
    }

    async createCategoria(nome){
        let categoriaExists = await this.#repository.findByName(nome)

        if(categoriaExists.length != 0){
            throw new Error('Categoria ja cadastrada')
        }

        let createdCategoria = await this.#repository.save(nome)

        return createdCategoria
    }

    async findByIdCategoria(id){
        let categoria = await this.#repository.findById(id)

        if(categoria.length == 0){
            throw new Error('Categoria nao encotrada')
        }

        return categoria
    }

    async findAllCategorias(){
        let allCategorias = await this.#repository.findAll()

        return allCategorias
    }

    async existsCategoria(id){
        let categoria = await this.#repository.findById(id)

        return categoria.length != 0
    }

    async updateCategoria(id, body){
        if(id == undefined){ throw new Error('Id faltando') }

        if(!this.existsCategoria(id)){ throw new Error('Categoria não encontrada!') }

        if(Object.keys(body).length == 0){ throw new Error('Nenhum campo para atualizar!') }

        if(body.nome != undefined){
            let existsNome = await this.#repository.findByName(body.nome)

            if(existsNome.length > 0){ throw new Error('Ja existe uma categoria com esse nome!') }
        }

        return updatedCategoria = await this.#repository.update(id, body)        
    }

    async deleteCategoria(id){
        let categoriaExists = await this.#repository.findById(id)

        if(categoriaExists.length == 0){ throw new Error('Categoria não encontrada!') }

        if(categoriaExists[0].ativo == false){throw new Error('Categoria ja destivada!')}

        if(id == undefined){ throw new Error('Id faltando!') }

        let deletedCategoria = await this.#repository.delete(id)


        return deletedCategoria
    }
}

module.exports = CategoriaService