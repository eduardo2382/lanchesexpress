import { renderPedido } from "./views/produtos.js"

const app = document.querySelector('.app')

export function changeScreen(tela, dados){
    app.innerHTML = ''

    switch(tela){
        case 'produtos':
            renderPedido(app)
            break
    }
}

changeScreen('produtos')