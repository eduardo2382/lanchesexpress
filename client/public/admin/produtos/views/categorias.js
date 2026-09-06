import { api } from '../../../shared/api.js'

import {ModalSpinner, ModalConfirmar, ModalInput} from '../../../shared/js/modal.js'

var modalSpinner;

function toggleInactiveCategoriaElement(button){
    let categoriaElement = button.parentNode;

    while (!categoriaElement.classList.contains('categoria-element')) {
        categoriaElement = categoriaElement.parentNode
    }

    categoriaElement.classList.toggle('categoria-inactive')
    categoriaElement.classList.toggle('text-[#E5E5E5]')
}

function eventClickToggleStatus(app){
    let toggleStatus = app.querySelectorAll('.toggle-status')

    toggleStatus.forEach((button) => {
        button.addEventListener('click', () => {
            button.classList.toggle('bg-black')
            button.classList.toggle('bg-white')

            button.classList.toggle('text-white')
            button.classList.toggle('text-black')

            button.classList.toggle('border-transparent')
            button.classList.toggle('border-[#E5E5E5]')

            button.classList.toggle('active')
            button.classList.toggle('inactive')

            if(button.textContent == 'Ativo') button.textContent = 'Inativo'
            else button.textContent = 'Ativo'

            toggleInactiveCategoriaElement(button)
        })
    })
}

function loadEvents(app){
    eventClickToggleStatus(app)
}

function createCategoriaElement(categoria){
    let inactiveCategoria = categoria.status == 'inativo' ? 'text-[#E5E5E5]' : ''
    let textToggleStatus = categoria.status == 'inativo' ? 'Inativo' : 'Ativo'

    return `
        <li class="text-xl ${inactiveCategoria} flex items-center justify-between bg-white pr-2 pl-3 py-3 border border-[#E5E5E5] rounded-lg active:bg-[#E5E5E5] categoria-element">
            <span class="font-bold">
                ${categoria.nome}
            </span>
            <span class="flex items-center gap-2">
                <span class="bg-black text-white font-bold px-2 py-1 text-lg border border-transparent rounded-lg toggle-status">${textToggleStatus}</span>
                <span class="text-2xl">
                    <i class="p-1.5 border border-[#E5E5E5] rounded-lg active:bg-[#f1f1f1] ri-pencil-line"></i>
                    <i class="p-1.5 border border-[#E5E5E5] rounded-lg active:bg-[#F1F1F1] ri-delete-bin-line"></i>
                </span>
            </span>
        </li>
    `
}

async function renderCategoriasElement(app){
    let categoriasNumber = app.querySelector('.numbers-categorias')

    let categoriasList = app.querySelector('.categorias-list')
    categoriasList.innerHTML = ''

    let categoriasActives = 0

    try {
        modalSpinner.open()
    
        let categorias = await api.categorias.listar()

        modalSpinner.close()

        if(categorias.length == 0) return 

        categorias.forEach((categoria) => {
            if(categoria.status == 'ativo') categoriasActives++

            categoriasList.innerHTML += createCategoriaElement(categoria)
        })

        categoriasNumber.textContent = `${categorias.length} categorias - ${categoriasActives} ativas`

    } catch (error) {
        modalSpinner.close()
        window.alert(`Não foi possivel carregar as categorias! ${error.message}`)
    }
}

export async function renderCategorias(app){
    modalSpinner = new ModalSpinner(app)

    await renderCategoriasElement(app)

    loadEvents(app)
}