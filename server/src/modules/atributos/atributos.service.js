const AtributoRepository = require('./atributos.repository.js')

class AtributoService {
    #repository

    constructor(){
        this.#repository = new AtributoRepository()
    }

    async existsAtributoId(id){
        return (await this.#repository.findById(id)).length > 0
    }

    async existsAtributoNome(nome){
        return (await this.#repository.findByName(nome)).length > 0
    }

    async createAtributo(body){
        if(body.nome == undefined){ throw new Error('Nome do atributo faltando!') }

        if(await this.existsAtributoNome(body.nome)){ throw new Error('Ja existe um atributo com esse nome') }

        return await this.#repository.save(body.nome)
    }

    async findAllAtributos(query){
        let { incluirInativos } = query

        return await this.#repository.findAll(incluirInativos == 'true')
    }

    async findByIdAtributo(id){
        if(id == undefined){ throw new Error('Id do atributo faltando!') }

        return await this.#repository.findById(id)
    }

    async updateAtributo(id, body){
        if(id == undefined){ throw new Error('Id do atributo faltando!') }

        if( !(await this.existsAtributoId(id)) ){ throw new Error('Atributo nao encontrado!') }

        if(Object.keys(body).length == 0){ throw new Error('Nenhum campo para atualizar!') }

        if( (body.nome != undefined) && (await this.existsAtributoNome(body.nome)) ){ throw new Error('Ja existe um atributo com esse nome!') }

        return await this.#repository.update(id, body)
    }

    async deleteAtributo(id){
        if(id == undefined){ throw new Error('Id do atributo faltando!') }

        if( !(await this.existsAtributoId(id)) ){ throw new Error('Atributo nao encontrado!') }

        return await this.#repository.delete(id)
    }
}

module.exports = AtributoService