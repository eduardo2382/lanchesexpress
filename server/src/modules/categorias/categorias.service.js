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

    async findByNameCategoria(nome){
        let categoria = await this.#repository.findByName(nome)

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