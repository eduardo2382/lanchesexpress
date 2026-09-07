import { renderCategorias } from "./views/categorias.js"
import { renderProdutos } from "./views/produtosList.js"

const app = document.querySelector('.app')

export function changeScreen(tela, dados){
    app.innerHTML = ''

    switch(tela){
        case 'categorias':
            renderCategorias(app)
            break
        case 'produtos':
            renderProdutos(app, dados)
            break
        case 'produto':
    }
}

changeScreen('categorias')
