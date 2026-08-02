const OpcaoRepository = require('./opcoes.repository.js')
const { ValidationError, ConflictError, NotFoundError, UnprocessableEntityError } = require('../../error/AppError.js')

class OpcaoService{
    #repository;

    constructor(){
        this.#repository = new OpcaoRepository()
    }

    async existsOpcaoNome(nome){
        return (await this.#repository.findByName(nome)).length > 0
    }

    async createOpcao(body){
        if(body.nome == undefined) throw new ValidationError('Nome da opcao faltando!', {campo: 'nome', motivo: 'obrigatorio'})
        if(body.tipo == undefined) throw new ValidationError('Nome da opcao faltando!', {campo: 'nome', motivo: 'obrigatorio'})

        if(await this.existsOpcaoNome(body.nome)) throw new ConflictError('Ja existe uma opcao com esse nome!')

        return (await this.#repository.save(body.nome, body.tipo))[0]
    }

    async findAllOpcoes(query){
        let statusList = ['ativo', 'inativo', 'excluido']
        let statusQuery = query.status ? query.status.split(',') : ['ativo']    

        let statusInvalid = statusQuery.filter((s) => !statusList.includes(s))
        if(statusInvalid.length > 0) throw new ValidationError(`Status invalido: ${statusInvalid.join(', ')}`, {campo: 'status', motivo: 'invalido'})

        return await this.#repository.findAll(statusQuery)
    }

    async findByIdOpcao(id){
        if(id == undefined) throw new ValidationError('Id da opcao faltando', {campo: 'id', motivo: 'obrigatorio'})

        let opcao = await this.#repository.findById(id)

        if(opcao.length == 0) throw new NotFoundError('Opcao nao encontrada!')

        return opcao[0]
    }

    async updateOpcao(id, body){
        let camposList = ['nome', 'tipo', 'status']

        if(id == undefined) throw new ValidationError('Id da opcao faltando!', {campo: 'id', motivo: 'obrigatorio'})

        let opcao = (await this.#repository.findById(id))[0]

        if(!opcao) throw new NotFoundError('Opcao nao encontrada!') 

        let camposBody = Object.keys(body)
        let camposInvalid = camposBody.filter((c) => !camposList.includes(c))

        if(camposBody.length == 0) throw new ValidationError('Nenhum campo para atualizar!')
        if(camposInvalid.length > 0) throw new ValidationError(`Campos invalidos: ${camposInvalid.join(', ')}`, {campo: camposInvalid, motivo: 'invalido'})

        if((body.nome != undefined) && (await this.existsOpcaoNome(body.nome))) throw new ConflictError('Ja existe uma opcao com esse nome!', {campo: 'nome'})

        if((body.status != undefined) && (!['ativo', 'inativo'].includes(body.status))) throw new ValidationError('Status deve ser: ativo ou inativo', {campo: 'status', motivo: 'invalido'})

        if((body.status != undefined) && (opcao.status == 'excluido')) throw new UnprocessableEntityError('Opcao excluida nao pode ter seu status modificado!', {statusAtual: 'excluido'})

        return (await this.#repository.update(id, body))[0]
    }

    async updateStatusOpcao(id, body){
        let camposList = ['status']

        if(id == undefined) throw new ValidationError('Id da opcao faltando!', {campo: 'id', motivo: 'obrigatorio'})

        let opcao = (await this.#repository.findById(id))[0]

        if(!opcao) throw new NotFoundError('Opcao nao encontrada!') 

        let camposBody = Object.keys(body)
        let camposInvalid = camposBody.filter((c) => !camposList.includes(c))

        if(camposBody.length == 0) throw new ValidationError('Nenhum campo para atualizar!')
        if(camposInvalid.length > 0) throw new ValidationError(`Campos invalidos: ${camposInvalid.join(', ')}`, {campo: camposInvalid, motivo: 'invalido'})

        if((body.status != undefined) && (!['ativo', 'inativo'].includes(body.status))) throw new ValidationError('Status deve ser: ativo ou inativo', {campo: 'status', motivo: 'invalido'})

        if((body.status != undefined) && (opcao.status == 'excluido')) throw new UnprocessableEntityError('Opcao excluida nao pode ter seu status modificado!', {statusAtual: 'excluido'})

        return (await this.#repository.update(id, body))[0]
    }

    async removeOpcao(id){
        if(id == undefined) throw new ValidationError('Id da opcao faltando!', {campo: 'id', motivo: 'obrigatorio'})

        let opcao = (await this.#repository.findById(id))[0]

        if(!opcao){ throw new Error('Opcap nao encontrada!') }
        if(opcao.status == 'excluido') throw new UnprocessableEntityError('Opcao ja exluida!', {statusAtual: 'excluido'})

        return await this.#repository.update(id, {status: 'excluido'})
    }
}



module.exports = OpcaoService