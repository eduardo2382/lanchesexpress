import { changeScreen } from '../script.js'

var categoriaId, categoriaName, categoriaStatus;

function toFirstUpperCase(string){
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function loadPage(app){
    app.innerHTML += `
        <section class="flex flex-col items-start gap-2">
            <button class="button-back">
                <i class="text-2xl text-black font-bold p-2 rounded-lg active:bg-black/10 ri-arrow-left-line"></i>
            </button>
            <div class="flex flex-col">
                <h2 class="text-2xl font-bold title-categoria">${toFirstUpperCase(categoriaName)}</h2>
                <span class="text-[#A3A3A3] produtos-number">0 produtos - 0 ativos</span>
            </div>
        </section>

        <section class="flex flex-col gap-4">
            <button class="w-full text-white text-xl font-bold bg-black px-3 py-2 rounded-lg active:bg-black/80 create-produto">
                <i class="ri-add-fill"></i>
                Adicionar produto
            </button>

            <ul class="flex flex-col gap-4"></ul>
        </section>
    `

    let btnBack = app.querySelector('.button-back')

    btnBack.addEventListener('click', () => {
        changeScreen('categorias')
    })
}

function eventClickCreateProduto(){
    let btnCreate = document.querySelector('.create-produto')

    btnCreate.addEventListener('click', () => {
        
    })
}

export async function renderProdutos(app, dados){
    ({ categoriaId, categoriaName, categoriaStatus } = dados)

    loadPage(app)

    eventClickCreateProduto()
}