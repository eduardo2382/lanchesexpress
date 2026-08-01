const AtributoService = require('./atributos.service.js')

class AtributoController {
    #service

    constructor(){
        this.#service = new AtributoService()
    }

    create = async (req, res) => {
        try{
            let createdAtributo = await this.#service.createAtributo(req.body)

            return res.status(201).json(createdAtributo)
        }catch(error){
            return res.status(400).json({ error: error.message })
        }
    }

    findAll = async (req, res) => {
        try{
            let allAtributos = await this.#service.findAllAtributos(req.query)

            return res.status(200).json(allAtributos)
        }catch(error){
            return res.status(400).json({ error: error.message })
        }
    }

    findById = async (req, res) => {
        try{
            let atributo = await this.#service.findByIdAtributo(req.params.id)

            return res.status(200).json(atributo)
        }catch(error){
            return res.status(400).json({ error: error.message })
        }
    }

    update = async (req, res) => {
        try{
            let { id } = req.params

            let updatedAtributo = await this.#service.updateAtributo(id, req.body)

            return res.status(200).json(updatedAtributo)
        }catch(error){
            return res.status(400).json({ error: error.message })
        }
    }

    delete = async (req, res) => {
        try{
            let { id } = req.params

            let deletedAtributo = await this.#service.deleteAtributo(id)

            return res.status(200).json(deletedAtributo)
        }catch(error){
            return res.status(400).json({ error: error.message })
        }
    }
}

module.exports = AtributoController