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
        let { nome, tipo_medida } = body

        if(nome == undefined){ throw new Error('Nome faltando!') }

        if(await this.existsInsumoNome(nome)){ throw new Error('Ja existe um insumo com esse nome!') }

        if(tipo_medida == undefined){ throw new Error('Tipo de medida faltando!') }

        let values = {
            nome,
            tipo_medida,
            quantidade_atual: body.quantidade_atual ?? 0,
            quantidade_minima: body.quantidade_minima ?? 0
        }

        return await this.#repository.save(values)
    }

    async findAllInsumos(incluirInativos){
        return await this.#repository.findAll(incluirInativos)
    }

    async findByIdInsumo(id){
        if(id == undefined){ throw new Error("Id faltando!") }

        if(!(await this.existsInsumoId(id))){ throw new Error('Insumo nao encontrado')}

        return await this.#repository.findById(id)
    }

    async findBellowInsumos(){
        return await this.#repository.findBellow()
    }

    async updateInsumo(id, body){
        if(id == undefined){ throw new Error("Id faltando!") }

        if(!(await this.existsInsumoId(id))){ throw new Error('Insumo nao encontrado')}

        if(!(await this.existsInsumoId(id))){ throw new Error('Insumo nao encontrado!') }

        if(Object.keys(body).length == 0){ throw new Error('Nenhum campo para atualizar!') }

        if(body.nome != undefined && (await this.existsInsumoNome(body.nome))){ throw new Error('Ja existe um insumo com esse nome!') }

        return await this.#repository.update(id, body)
    }

    async deleteInsumo(id){
        if(id == undefined){ throw new Error('Id faltando!') }

        if(!(await this.existsInsumoId(id))){ throw new Error('Insumo nao encontrado!')}

        return await this.#repository.delete(id)
    }

    async ajustInsumo(id, body){
        let { tipo, motivo, quantidade } = body
        let delta;
        let updatedInsumo;

        if(id == undefined){ throw new Error('Id do insumo faltando!') }

        if(!(await this.existsInsumoId(id))){ throw new Error('Insumo nao encontrado')}

        let insumo = await this.#repository.findById(id)
        let quantidadeAtual = Number(insumo[0].quantidade_atual)

        if(tipo == undefined){ throw new Error('Tipo da movimentacao faltando!') }

        if(motivo == undefined){ throw new Error('Motivo da movimentacao faltando!') }

        if(motivo == 'venda'){ throw new Error('Motivo invalido!')}

        if(quantidade == undefined){ throw new Error('Quantidade da movimentacao faltando!') }

        switch (tipo) {
            case 'ajuste':
                delta = quantidade - quantidadeAtual
                
                updatedInsumo = await this.#repository.ajust(id, delta, {
                    tipo, 
                    motivo,
                    movimentacao_quantidade: delta
                })
                
                break;

            case 'entrada':
                delta = +quantidade

                updatedInsumo = await this.#repository.ajust(id, delta, {
                    tipo,
                    motivo,
                    movimentacao_quantidade: quantidade
                })

                break

            case 'saida':
                delta = -quantidade

                let newQuantidadeAtual = quantidadeAtual + delta

                if(newQuantidadeAtual < 0){ throw new Error('Valor de saida maior que a quantidade atual do insumo!') }

                updatedInsumo = await this.#repository.ajust(id, delta, {
                    tipo,
                    motivo,
                    movimentacao_quantidade: quantidade
                })

                break
        
            default:
                break;
        }

        return updatedInsumo
    }
}


module.exports = InsumoService