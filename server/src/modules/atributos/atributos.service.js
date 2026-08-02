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

        return (await this.#repository.save(body.nome))[0]
    }

    async findAllAtributos(query){
        let statusList = ['ativo', 'inativo', 'excluido']
        let statusQuery = query.status ? query.status.split(',') : ['ativo']    

        let statusInvalid = statusQuery.filter((s) => !statusList.includes(s))
        if(statusInvalid.length > 0){ throw new Error(`Status invalido: ${statusInvalid.join(', ')}`) }

        return await this.#repository.findAll(statusQuery)
    }

    async findByIdAtributo(id){
        if(id == undefined){ throw new Error('Id do atributo faltando!') }

        let atributo = await this.#repository.findById(id)

        if(atributo.length == 0){ throw new Error('Atributo nao encontrado')}

        return atributo[0]
    }

    async updateAtributo(id, body){
        if(id == undefined){ throw new Error('Id do atributo faltando!') }

        let atributo = (await this.#repository.findById(id))[0]

        if(!atributo){ throw new Error('Atributo nao encontrado!') }

        if(Object.keys(body).length == 0){ throw new Error('Nenhum campo para atualizar!') }

        if((body.nome != undefined) && (await this.existsAtributoNome(body.nome))){ throw new Error('Ja existe um atributo com esse nome!') }

        if((body.status != undefined) && (!['ativo', 'inativo'].includes(body.status))){ throw new Error('Status deve ser: ativo ou inativo') }

        if((body.status != undefined) && (atributo.status == 'excluido')){ throw new Error('Atributo excluido nao pode ter seu status modificado!') }

        return await this.#repository.update(id, body)
    }

    async removeAtributo(id){
        if(id == undefined){ throw new Error('Id do atributo faltando!') }

        let atributo = (await this.#repository.findById(id))[0]

        if(!atributo){ throw new Error('Atributo nao encontrado!') }
        if(atributo.status == 'excluido') { throw new Error('Atributo ja exluido!') }

        return await this.#repository.update(id, {status: 'excluido'})
    }
}

module.exports = AtributoService