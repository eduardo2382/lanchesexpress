require('dotenv').config()
const app = require('./app.js')

const PORT = process.env.PORT || 8080

function server(){
    app.listen(PORT, ()=>{
        console.log(`Servidor rodando na porta: ${PORT}`)
        console.log(`URL local: http://localhost:${PORT}`)
    })
}

process.on('unhandledRejection', (reason) => {
    console.error(`Unhandled Rejection: ${reason}`)
})

process.on('uncaughtException', (err) => {
    console.error(`Uncaught Exception: ${err}`)
    process.exit(1)
})

server()