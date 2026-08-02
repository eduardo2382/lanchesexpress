const CategoriaRepository = require('./categorias.repository.js')
const { ValidationError, ConflictError, NotFoundError, UnprocessableEntityError } = require('../../error/AppError.js')

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
        if(body.nome == undefined) throw new ValidationError('Nome da categoria faltando!', {campo: 'nome', motivo: 'obrigatorio'}) 

        if(await this.existsCategoriaNome(body.nome)) throw new ConflictError('Ja existe uma categoria com esse nome', {campo: 'nome'})

        return (await this.#repository.save(body.nome))[0]
    }

    async findAllCategorias(query){
        let statusList = ['ativo', 'inativo', 'excluido']
        let statusQuery = query.status ? query.status.split(',') : ['ativo']    

        let statusInvalid = statusQuery.filter((s) => !statusList.includes(s))
        if(statusInvalid.length > 0) throw new ValidationError(`Status invalido: ${statusInvalid.join(', ')}`, {campo: 'status', motivo: 'invalido'})

        return await this.#repository.findAll(statusQuery)
    }

    async findByIdCategoria(id){
        if(id == undefined) throw new ValidationError('Id do atributo faltando!', {campo: 'id', motivo: 'obrigatorio'})

        let categoria = await this.#repository.findById(id)

        if(categoria.length == 0) throw new NotFoundError('Categoria nao encotrada')

        return categoria[0]
    }

    async updateCategoria(id, body){
        let camposList = ['nome', 'status']
        if(id == undefined) throw new ValidationError('Id da categoria faltando!', {campo: 'id', motivo: 'obrigatorio'})

        let categoria = (await this.#repository.findById(id))[0]

        if(!categoria) throw new NotFoundError('Categoria não encontrada!')

        let camposBody = Object.keys(body)
        let camposInvalid = camposBody.filter((c) => !camposList.includes(c))

        if(camposBody.length == 0) throw new ValidationError('Nenhum campo para atualizar!')
        if(camposInvalid.length > 0) throw new ValidationError(`Campos invalidos: ${camposInvalid.join(', ')}`, {campo: camposInvalid, motivo: 'invalido'})

        if((body.nome != undefined) && (await this.existsCategoriaNome(body.nome))) throw new ConflictError('Ja existe uma categoria com esse nome!', {campo: 'nome'})

        if((body.status != undefined) && (!['ativo', 'inativo'].includes(body.status))) throw new ValidationError('Status deve ser: ativo ou inativo!', {campo: 'status', motivo: 'invalido'})

        if((body.status != undefined) && (categoria.status == 'excluido')) throw new UnprocessableEntityError('Categoria excluida nao pode ter seu status modificado!', {statusAtual: 'excluido'})

        return await this.#repository.update(id, body)        
    }

    async updateCategoria(id, body){
        let camposList = ['status']
        if(id == undefined) throw new ValidationError('Id da categoria faltando!', {campo: 'id', motivo: 'obrigatorio'})

        let categoria = (await this.#repository.findById(id))[0]

        if(!categoria) throw new NotFoundError('Categoria não encontrada!')

        let camposBody = Object.keys(body)
        let camposInvalid = camposBody.filter((c) => !camposList.includes(c))

        if(camposBody.length == 0) throw new ValidationError('Nenhum campo para atualizar!')
        if(camposInvalid.length > 0) throw new ValidationError(`Campos invalidos: ${camposInvalid.join(', ')}`, {campo: camposInvalid, motivo: 'invalido'})

        if((body.status != undefined) && (!['ativo', 'inativo'].includes(body.status))) throw new ValidationError('Status deve ser: ativo ou inativo!', {campo: 'status', motivo: 'invalido'})

        if((body.status != undefined) && (categoria.status == 'excluido')) throw new UnprocessableEntityError('Categoria excluida nao pode ter seu status modificado!', {statusAtual: 'excluido'})

        return await this.#repository.update(id, body)        
    }

    async removeCategoria(id){
        if(id == undefined) throw new ValidationError('Id da categoria faltando!', {campo: 'id', motivo: 'obrigatorio'})

        let categoria = (await this.#repository.findById(id))[0]

        if(!categoria){ throw new Error('Categoria nao encontrada!') }
        if(categoria.status == 'excluido') throw new UnprocessableEntityError('Categoria ja exluida', {statusAtual: 'excluido'})

        return await this.#repository.update(id, {status: 'excluido'})
    }
}

module.exports = CategoriaService