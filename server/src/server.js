require('dotenv').config()
const app = require('./app.js')

const PORT = process.env.PORT || 8080

async function server(){
    try{
        app.listen(PORT, ()=>{
            console.log(`Servidor rodando na porta: ${PORT}`)
            console.log(`URL local: http://localhost:${PORT}`)
        })
    }catch(error){
        console.log("Falha ao iniciar o servidor: ", error)
        process.exit(1)
    }
}

server()