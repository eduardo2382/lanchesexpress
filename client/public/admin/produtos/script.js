import { renderCategorias } from "./views/categorias.js"

const app = document.querySelector('.app')

export function changeScreen(tela, dados){
    

    switch(tela){
        case 'categorias':
            renderCategorias(app)
            break
    }
}

changeScreen('categorias')
