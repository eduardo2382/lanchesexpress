import { renderPedido } from "./views/produtos.js"
import { renderPagamento } from "./views/pagamento.js"
import { renderConfirmacao } from "./views/confirmacao.js"

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

        case 'confirmacao':
            renderConfirmacao(app, dados)
            renderConfirmacao()
            break
    }
}

changeScreen('produtos')