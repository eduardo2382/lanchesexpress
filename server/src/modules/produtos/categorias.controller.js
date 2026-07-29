const CategoriaService = require('./categorias.service.js')

class CategoriaController {
    #service;

    constructor(){
        this.#service = new CategoriaService()
    }

    create = async (req, res) => {
        try{
            let { name } = req.body 

            let newCategoria = await this.#service.createCategoria(name)

            return res.status(201).send(newCategoria)
        }catch(error){
            return res.status(400).json({error: error.message})
        }
    }   

    findByName = async (req, res) => {
        try{
            let { name } = req.params

            let categoria = await this.#service.findByNameCategoria(name)

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
}

module.exports = CategoriaController