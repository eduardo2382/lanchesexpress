const CategoriaRepository = require('./categorias.repository.js')

class CategoriaService {
    #repository;

    constructor(){
        this.#repository = new CategoriaRepository()
    }

    async existsCategoriaId(id){
        return (await this.#repository.findById(id)).length > 0
    }

    async existsCategoriaNome(nome){
        return (await this.#repository.findByName(nome)).length > 0
    }

    async createCategoria(body){
        if(body.nome == undefined){ throw new Error('Nome da categoria faltando!') }

        if(await this.existsCategoriaNome(body.nome)){ throw new Error('Ja existe uma categoria com esse nome') }

        return (await this.#repository.save(body.nome))[0]
    }

    async findAllCategorias(query){
        let statusList = ['ativo', 'inativo', 'excluido']
        let statusQuery = query.status ? query.status.split(',') : ['ativo']    

        let statusInvalid = statusQuery.filter((s) => !statusList.includes(s))
        if(statusInvalid.length > 0){ throw new Error(`Status invalido: ${statusInvalid.join(', ')}`) }

        return await this.#repository.findAll(statusQuery)
    }

    async findByIdCategoria(id){
        if(id == undefined){ throw new Error('Id do atributo faltando!') }

        let categoria = await this.#repository.findById(id)

        if(categoria.length == 0){ throw new Error('Categoria nao encotrada') }

        return categoria[0]
    }

    async updateCategoria(id, body){
        if(id == undefined){ throw new Error('Id da categoria faltando!') }

        let categoria = (await this.#repository.findById(id))[0]

        if(!categoria){ throw new Error('Categoria não encontrada!') }

        if(Object.keys(body).length == 0){ throw new Error('Nenhum campo para atualizar!') }

        if((body.nome != undefined) && (await this.existsCategoriaNome(body.nome))){ throw new Error('Ja existe uma categoria com esse nome!') }

        if((body.status != undefined) && (!['ativo', 'inativo'].includes(body.status))){ throw new Error('Status deve ser: ativo ou inativo!') }

        if((body.status != undefined) && (categoria.status == 'excluido')){ throw new Error('Categoria excluida nao pode ter seu status modificado!') }

        return await this.#repository.update(id, body)        
    }

    async removeCategoria(id){
        if(id == undefined){ throw new Error('Id da categoria faltando!') }

        let categoria = (await this.#repository.findById(id))[0]

        if(!categoria){ throw new Error('Categoria nao encontrada!') }
        if(categoria.status == 'excluido') { throw new Error('Categoria ja exluida') }

        return await this.#repository.update(id, {status: 'excluido'})
    }
}

module.exports = CategoriaService