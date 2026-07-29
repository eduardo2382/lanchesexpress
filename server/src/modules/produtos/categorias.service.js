const CategoriaRepository = require('./categorias.repository.js')

class CategoriaService {
    #repository;

    constructor(){
        this.#repository = new CategoriaRepository()
    }

    async createCategoria(name){
        let categoriaExists = await this.#repository.findByName(name)

        if(categoriaExists.length != 0){
            throw new Error('Categoria ja cadastrada')
        }

        let createdCategoria = await this.#repository.save(name)

        return createdCategoria
    }

    async findByNameCategoria(name){
        let categoria = await this.#repository.findByName(name)

        if(categoria.length == 0){
            throw new Error('Categoria nao encotrada')
        }

        return categoria
    }

    async findAllCategorias(){
        let allCategorias = await this.#repository.findAll()

        return allCategorias
    }
}

module.exports = CategoriaService