const CategoriaService = require('./categorias.service.js')

class CategoriaController {
    #service;

    constructor(){
        this.#service = new CategoriaService()
    }

    create = async (req, res) => {
        try{
            let { nome } = req.body 

            let createdCategoria = await this.#service.createCategoria(nome)

            return res.status(201).send(createdCategoria)
        }catch(error){
            return res.status(400).json({error: error.message})
        }
    }   

    findById = async (req, res) => {
        try{
            let { id } = req.params

            let categoria = await this.#service.findByIdCategoria(id)

            return res.status(200).json(categoria)
        }catch(error){
            return res.status(400).json({'error': error.message})
        }
    }

    findAll = async (req, res)=>{
        try{
            let allCategorias = await this.#service.findAllCategorias()

            return res.status(200).json(allCategorias)
        }catch(error){
            return res.status(400).json({'error': error.message})
        }
    }

    update = async (req, res) => {
        try{
            let id = req.params.id

            let updatedCategoria = await this.#service.updateCategoria(id, req.body)

            return res.status(200).json(updatedCategoria)
        }catch(error){
            return res.status(400).json({ error: error.message})
        }
    }

    delete = async (req, res) => {
        try{
            let deletedCategoria = await this.#service.deleteCategoria(req.params.id)

            return res.status(200).json(deletedCategoria)
        }catch(error){
            return res.status(400).json({error: error.message})
        }
    }
}

module.exports = CategoriaController