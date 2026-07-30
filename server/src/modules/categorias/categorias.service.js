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
}

module.exports = CategoriaService