const InsumoRepository = require('./insumos.repository.js')

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
        if(body.nome == undefined){ throw new Error('Nome do insumo faltando!') }

        if(body.tipo_medida == undefined){ throw new Error('Tipo de medida do insumo faltando!') }

        if(await this.existsInsumoNome(body.nome)){ throw new Error('Ja existe um insumo com esse nome!') }

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
        if(statusInvalid.length > 0){ throw new Error(`Status invalido: ${statusInvalid.join(', ')}`) }

        return await this.#repository.findAll(statusQuery)
    }

    async findByIdInsumo(id){
        if(id == undefined){ throw new Error("Id faltando!") }

        let insumo = (await this.#repository.findById(id))[0]

        if(!insumo){ throw new Error('Insumo nao encontrado')}

        return insumo
    }

    async findBellowInsumos(query){
        let statusList = ['ativo', 'inativo', 'excluido']
        let statusQuery = query.status ? query.status.split(',') : ['ativo']

        let statusInvalid = statusQuery.filter((s) => !statusList.includes(s))
        if(statusInvalid.length > 0){ throw new Error(`Status invalido: ${statusInvalid.join(', ')}`) }

        return await this.#repository.findBellow(statusQuery)
    }

    async updateInsumo(id, body){
        if(id == undefined){ throw new Error("Id do insumo faltando!") }

        let insumo = (await this.#repository.findById(id))[0]

        if(!insumo){ throw new Error('Insumo nao encontrado')}

        if(Object.keys(body).length == 0){ throw new Error('Nenhum campo para atualizar!') }

        if(body.nome != undefined && (await this.existsInsumoNome(body.nome))){ throw new Error('Ja existe um insumo com esse nome!') }

        if((body.status != undefined) && (!['ativo', 'inativo'].includes(body.status))){ throw new Error('Status deve ser: ativo ou inativo') }

        if((body.status != undefined) && (insumo.status == 'excluido')){ throw new Error('Insumo excluido nao pode ter seu status modificado!') }

        return await this.#repository.update(id, body)
    }

    async removeInsumo(id){
        if(id == undefined){ throw new Error('Id do insumo faltando!') }

        let insumo = await this.#repository.findById(id)

        if(!insumo){ throw new Error('Insumo nao encontrado!') }
        if(insumo.status == 'excluido') { throw new Error('Insumo ja exluido!') }

        return await this.#repository.update(id, {status: 'excluido'})
    }

    async ajustInsumo(id, body){
        let delta;
        let updatedInsumo;
        let tiposList = ['entrada', 'saida', 'ajuste']
        let motivosList = ['compra', 'perda', 'ajuste_manual']

        if(id == undefined){ throw new Error('Id do insumo faltando!') }

        let insumo = (await this.#repository.findById(id))[0]
        let quantidadeAtual = Number(insumo.quantidade_atual)

        if(!insumo){ throw new Error('Insumo nao encontrado')}

        if(body.tipo == undefined){ throw new Error('Tipo da movimentacao faltando!') }

        if(!tiposList.includes(body.tipo)){ throw new Error('Tipo deve ser: entrada, saida ou ajuste') }

        if(body.motivo == undefined){ throw new Error('Motivo da movimentacao faltando!') }

        if(body.motivo == 'venda'){ throw new Error('Motivo invalido!')}

        if(!motivosList.includes(body.motivo)){ throw new Error('Motivo deve ser: compra, perda ou ajuste_manual') }

        if(body.quantidade == undefined){ throw new Error('Quantidade da movimentacao faltando!') }

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

                if(newQuantidadeAtual < 0){ throw new Error('Valor de saida maior que a quantidade atual do insumo!') }

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