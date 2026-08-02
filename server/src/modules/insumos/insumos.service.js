const InsumoRepository = require('./insumos.repository.js')
const { ValidationError, ConflictError, NotFoundError, UnprocessableEntityError, InsufficientStockError } = require('../../error/AppError.js')

class InsumoService {
    #repository

    constructor(){
        this.#repository = new InsumoRepository()
    }

    async existsInsumoId(id){
        return (await this.#repository.findById(id)).length > 0
    }

    async existsInsumoNome(nome){
        return (await this.#repository.findByName(nome)).length > 0
    }

    async createInsumo(body){
        if(body.nome == undefined) throw new ValidationError('Nome do insumo faltando!', {campo: 'nome', motivo: 'obrigatorio'})

        if(body.tipo_medida == undefined) throw new Error('Tipo de medida do insumo faltando!', {campo: 'tipo_medida', motivo: 'obrigatorio'})

        if(await this.existsInsumoNome(body.nome)) throw new ConflictError('Ja existe um insumo com esse nome!', {campo: 'nome'}) 

        let values = {
            nome: body.nome,
            tipo_medida: body.tipo_medida,
            quantidade_atual: body.quantidade_atual ?? 0,
            quantidade_minima: body.quantidade_minima ?? 0
        }

        return (await this.#repository.save(values))[0]
    }

    async findAllInsumos(query){
        let statusList = ['ativo', 'inativo', 'excluido']
        let statusQuery = query.status ? query.status.split(',') : ['ativo']

        let statusInvalid = statusQuery.filter((s) => !statusList.includes(s))
        if(statusInvalid.length > 0) throw new ValidationError(`Status invalido: ${statusInvalid.join(', ')}`, {campo: 'status', motivo: 'invalido'})

        return await this.#repository.findAll(statusQuery)
    }

    async findByIdInsumo(id){
        if(id == undefined) throw new ValidationError("Id faltando!", {campo: 'id', motivo: 'obrigatorio'})

        let insumo = (await this.#repository.findById(id))[0]

        if(!insumo) throw new NotFoundError('Insumo nao encontrado')

        return insumo
    }

    async findBellowInsumos(query){
        let statusList = ['ativo', 'inativo', 'excluido']
        let statusQuery = query.status ? query.status.split(',') : ['ativo']

        let statusInvalid = statusQuery.filter((s) => !statusList.includes(s))
        if(statusInvalid.length > 0) throw new ValidationError(`Status invalido: ${statusInvalid.join(', ')}`, {campo: 'status', motivo: 'invalido'}) 

        return await this.#repository.findBellow(statusQuery)
    }

    async updateInsumo(id, body){
        let camposList = ['nome', 'tipo_medida', 'quantidade_atual', 'quantidade_minima', 'status']

        if(id == undefined) throw new ValidationError("Id do insumo faltando!", {campo: 'id', motivo: 'obrigatorio'}) 

        let insumo = (await this.#repository.findById(id))[0]

        if(!insumo) throw new NotFoundError('Insumo nao encontrado')

        let camposBody = Object.keys(body)
        let camposInvalid = camposBody.filter((c) => !camposList.includes(c))

        if(camposBody.length == 0) throw new ValidationError('Nenhum campo para atualizar!')
        if(camposInvalid.length > 0) throw new ValidationError(`Campos invalidos: ${camposInvalid.join(', ')}`, {campo: camposInvalid, motivo: 'invalido'})

        if(body.nome != undefined && (await this.existsInsumoNome(body.nome))) throw new ConflictError('Ja existe um insumo com esse nome!', {campo: 'nome'})

        if((body.status != undefined) && (!['ativo', 'inativo'].includes(body.status))) throw new Validation('Status deve ser: ativo ou inativo', {campo: 'status', motivo: 'invalido'})

        if((body.status != undefined) && (insumo.status == 'excluido')) throw new UnprocessableEntityError('Insumo excluido nao pode ter seu status modificado!', {statusAtual: 'excluido'})

        return await this.#repository.update(id, body)
    }

    async removeInsumo(id){
        if(id == undefined) throw new ValidationError('Id do insumo faltando!', {campo: 'id', motivo: 'obrigatorio'})

        let insumo = (await this.#repository.findById(id))[0]

        if(!insumo){ throw new Error('Insumo nao encontrado!') }
        if(insumo.status == 'excluido') throw new UnprocessableEntityError('Insumo ja exluido!', {statusAtual: 'excluido'})

        return await this.#repository.update(id, {status: 'excluido'})
    }

    async ajustInsumo(id, body){
        let delta;
        let updatedInsumo;
        let tiposList = ['entrada', 'saida', 'ajuste']
        let motivosList = ['compra', 'perda', 'ajuste_manual']
        let camposList = ['tipo', 'motivo', 'quantidade']

        if(id == undefined) throw new ValidationError('Id do insumo faltando!', {campo: 'id', motivo: 'obrigatorio'})

        let insumo = (await this.#repository.findById(id))[0]
        let quantidadeAtual = Number(insumo.quantidade_atual)

        if(!insumo) throw new NotFoundError('Insumo nao encontrado')

        let camposBody = Object.keys(body)
        let camposInvalid = camposBody.filter((c) => !camposList.includes(c))

        if(camposInvalid.length > 0) throw new ValidationError(`Campos invalidos: ${camposInvalid.join(', ')}`, {campo: camposInvalid, motivo: 'invalido'})

        if(body.tipo == undefined) throw new ValidationError('Tipo da movimentacao faltando!', {campo: 'tipo', motivo: 'obrigatorio'})

        if(!tiposList.includes(body.tipo)) throw new ValidationError('Tipo deve ser: entrada, saida ou ajuste', {campo: 'tipo', motivo: 'invalido'})

        if(body.motivo == undefined) throw new ValidationError('Motivo da movimentacao faltando!', {campo: 'motivo', motivo: 'obrigatorio'})

        if(body.motivo == 'venda') throw new ValidationError('Motivo deve ser: compra, perda ou ajuste_manual', {campo: 'motivo', motivo: 'invalido'})

        if(!motivosList.includes(body.motivo)) throw new ValidationError('Motivo deve ser: compra, perda ou ajuste_manual', {campo: 'motivo', motivo: 'invalido'})

        if(body.quantidade == undefined) throw new ValidationError('Quantidade da movimentacao faltando!', {campo: 'quantidade', campo: 'obrigatorio'})

        switch (body.tipo) {
            case 'ajuste':
                delta = body.quantidade - quantidadeAtual
                
                updatedInsumo = await this.#repository.ajust(id, delta, {
                    tipo: body.tipo, 
                    motivo: body.motivo,
                    movimentacao_quantidade: delta
                })
                
                break;

            case 'entrada':
                delta = +body.quantidade

                updatedInsumo = await this.#repository.ajust(id, delta, {
                    tipo: body.tipo, 
                    motivo: body.motivo,
                    movimentacao_quantidade: body.quantidade
                })

                break

            case 'saida':
                delta = -body.quantidade

                let newQuantidadeAtual = quantidadeAtual + delta

                if(newQuantidadeAtual < 0) throw new InsufficientStockError('Valor de saida maior que a quantidade atual do insumo!')

                updatedInsumo = await this.#repository.ajust(id, delta, {
                    tipo: body.tipo, 
                    motivo: body.motivo,
                    movimentacao_quantidade: body.quantidade
                })

                break
        
            default:
                break;
        }

        return updatedInsumo
    }
}


module.exports = InsumoService