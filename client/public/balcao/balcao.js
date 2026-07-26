import { renderPedido } from "./views/produtos.js"
import { renderPagamento } from "./views/pagamento.js"

const app = document.querySelector('.app')

export function changeScreen(tela, dados){
    app.innerHTML = ''

    switch(tela){
        case 'produtos':
            renderPedido(app)
            break
        
        case 'pagamento':
            renderPagamento(app)
            break
    }
}

changeScreen('produtos')