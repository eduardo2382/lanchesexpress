const InsumoService = require('./insumos.service.js')

class InsumoController {
    #service

    constructor(){
        this.#service = new InsumoService()
    }

    create = async (req, res) => {
        try{
            let createdInsumo = await this.#service.createInsumo(req.body)

            return res.status(201).json(createdInsumo)
        }catch(error){
            return res.status(400).json({ error: error.message })
        }
    }

    findAll = async (req, res) => {
        try{
            let { incluirInativos } = req.query

            let allInsumos = await this.#service.findAllInsumos(incluirInativos == 'true')

            return res.status(200).json(allInsumos)
        }catch(error){
            return res.status(400).json({ error: error.message })
        }
    }

    findById = async (req, res) => {
        try{
            let insumo = await this.#service.findByIdInsumo(req.params.id)

            return res.status(200).json(insumo)
        }catch(error){
            return res.status(400).json({ error: error.message })
        }
    }

    findBellow = async (req, res) => {
        try{
            let insumosBellow = await this.#service.findBellowInsumos()

            return res.status(200).json(insumosBellow)
        }catch(error){
            return res.status(400).json({ error: error.message })
        }
    }

    update = async (req, res) => {
        try{
            let id = req.params.id

            let updatedInsumo = await this.#service.updateInsumo(id, req.body)

            return res.status(200).json(updatedInsumo)
        }catch(error){
            return res.status(400).json({ error: error.message })
        }
    }

    delete = async (req, res) => {
        try{
            let deletedInsumo = await this.#service.deleteInsumo(req.params.id)

            return res.status(200).json(deletedInsumo)
        }catch(error){
            return res.status(400).json({ error: error.message })
        }
    }
}

module.exports = InsumoController