import { api } from '../../../shared/api.js'

import { changeScreen } from '../script.js'

import {ModalSpinner, ModalConfirmar, ModalInput} from '../../../shared/js/modal.js'

var modalSpinner;


function toFirstUpperCase(string){
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function loadPage(app){
    app.innerHTML += `
        <div>
            <h2 class="text-2xl font-bold">Categorias</h2>
            <span class="text-[#A3A3A3] numbers-categorias">0 categorias - 0 ativas</span>
        </div>

        <section class="flex flex-col mt-2">
            <ul class="flex flex-col gap-4 categorias-list"></ul>
        </section>

        <button class="w-full bg-black px-3 py-2 rounded-lg active:bg-black/80 cursor-pointer create-categoria">
            <i class="text-3xl font-bold text-white ri-add-line"></i>
        </button>
    `
}

function updateCategoriaSum(){
    let categoriasElement = document.querySelectorAll('.categoria-element')
    
    let categoriasNumber = document.querySelector('.numbers-categorias')
    let categoriaActive = 0

    for(let cat of categoriasElement){
        if(cat.dataset.status == 'ativo') categoriaActive++
    }

    categoriasNumber.textContent = `${categoriasElement.length} categorias - ${categoriaActive} ativas`
}

async function toggleInactiveCategoria(button){
    let categoriaElement = button.parentNode;

    while (!categoriaElement.classList.contains('categoria-element')) {
        categoriaElement = categoriaElement.parentNode
    }

    if(categoriaElement.dataset.status == 'ativo') {
        categoriaElement.dataset.status = 'inativo'
    } else{
        categoriaElement.dataset.status = 'ativo'
    }

    await api.categorias.atualizarStatus(categoriaElement.dataset.id, categoriaElement.dataset.status)

    categoriaElement.classList.toggle('text-[#E5E5E5]')

    updateCategoriaSum()
}

async function eventClickToggleStatus(app){
    let toggleStatus = app.querySelectorAll('.toggle-status')

    toggleStatus.forEach((button) => {
        button.addEventListener('click', async (e) => {
            e.stopPropagation()

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

            await toggleInactiveCategoria(button)
        })
    })
}

async function createCategoria(newCategoria){
    try {
        modalSpinner.open()

        let categoriaCreated = await api.categorias.criar({nome: newCategoria.toLowerCase()}) 

        modalSpinner.close()

        renderCategoriasElement()
    } catch (error) {
        modalSpinner.close()
        window.alert(`Não foi possivel criar a categoria! ${error.message}`)
    }
}

async function eventClickCreateCategoria(app){
    let btnCreate = document.querySelector('.create-categoria')

    btnCreate.addEventListener('click', async () => {
        let modalInput = new ModalInput(app, {
            titulo: 'Criar nova categoria:',
            placeholder: 'Nome da categoria'
        })

        let newCategoria = await modalInput.open()

        if(newCategoria) await createCategoria(newCategoria)
    })
}

async function deleteCategoria(categoriaElement) {
    let id = categoriaElement.dataset.id
    
    try {
        modalSpinner.open()

        await api.categorias.deletar(id)

        modalSpinner.close()

        categoriaElement.remove()

        updateCategoriaSum()
    } catch (error) {
        modalSpinner.close()
        window.alert(`Não foi possivel deletar a categoria! ${error.message}`)
    }
}

async function eventClickDeleteCategoria(categoriaElement){
    let app = document.querySelector('.app')
    let btnDelete = categoriaElement.querySelector('.button-delete')
    let categoriaName = (categoriaElement.querySelector('.categoria-name')).textContent

    btnDelete.addEventListener('click', async (e) => {
        e.stopPropagation()

        let modalConfirm = new  ModalConfirmar(app, {
            titulo: `Deseja deletar a categoria ${categoriaName} ?`,
            mensagem: "Essa ação não pode ser desfeita!"
        })

        let confirm = await modalConfirm.open()

        if(confirm) await deleteCategoria(categoriaElement)
    })
}

async function editCategoria(categoriaElement, newName){
    let nameCategoria = categoriaElement.querySelector('.categoria-name')

    try{
        modalSpinner.open()

        let categoriaUpdated = await api.categorias.atualizar(categoriaElement.dataset.id, {"nome": newName.toLowerCase()})

        modalSpinner.close()

        console.log(categoriaUpdated)

        nameCategoria.textContent = toFirstUpperCase(categoriaUpdated.nome)
    }catch(error){
        modalSpinner.close()
        window.alert(`Não foi possivel atualizar a categoria! ${error.message}`)
    }
}

async function eventClickEditCategoria(categoriaElement){
    let app = document.querySelector('.app')
    let btnEdit = categoriaElement.querySelector('.button-edit')
    let nomeCategoria = categoriaElement.querySelector(".categoria-name")

    btnEdit.addEventListener('click', async (e) => {
        e.stopPropagation()

        let modalInput = new  ModalInput(app, {
            titulo: "Editar nome da categoria.",
            placeholder: "Nome da categoria",
            valorInicial: nomeCategoria.textContent
        })

        let nameEdit = await modalInput.open()

        if(nameEdit && nomeCategoria.textContent != nameEdit){
            editCategoria(categoriaElement, nameEdit)
        }
    })
}

function createCategoriaElement(categoria){
    let toggleStatus = categoria.status == 'ativo' ? 'bg-black text-white border-transparent' : 'bg-white text-black border-[#E5E5E5]'
    let textToggleStatus = categoria.status == 'ativo' ? 'Ativo' : 'Inativo'

    let categoriaElement = document.createElement('li')
    categoriaElement.className = `text-xl ${categoria.status == 'inativo' ? 'text-[#E5E5E5]' : ''} flex items-center justify-between bg-white pr-2 pl-3 py-3 border border-[#E5E5E5] rounded-lg shadow-sm active:bg-[#E5E5E5] cursor-pointer categoria-element`
    categoriaElement.dataset.id = categoria.id
    categoriaElement.dataset.status = categoria.status

    categoriaElement.innerHTML = `
        <span class="font-bold categoria-name">${toFirstUpperCase(categoria.nome)}</span>
        <span class="flex items-center gap-2">
            <button class="${toggleStatus} font-bold px-2 py-1 text-lg border rounded-lg cursor-pointer toggle-status">${textToggleStatus}</button>
            <span class="text-2xl text-black">
                <i class="p-1.5 border border-[#E5E5E5] rounded-lg active:bg-[#f1f1f1] ri-pencil-line cursor-pointer button-edit"></i>
                <i class="p-1.5 border border-[#E5E5E5] rounded-lg active:bg-[#F1F1F1] ri-delete-bin-line cursor-pointer button-delete"></i>
            </span>
        </span>
    `

    eventClickEditCategoria(categoriaElement)
    eventClickDeleteCategoria(categoriaElement)

    categoriaElement.addEventListener('click', () => {
        changeScreen('produtos', {categoriaId: categoriaElement.dataset.id, categoriaName: categoria.nome, categoriaStatus: categoriaElement.dataset.status})
    })

    return categoriaElement
}

async function renderCategoriasElement(){
    let categoriasList = document.querySelector('.categorias-list')
    categoriasList.innerHTML = ''

    try {
        modalSpinner.open()
    
        let categorias = await api.categorias.listar({status: ['ativo', 'inativo']})

        modalSpinner.close()

        if(categorias.length == 0) return 

        categorias.forEach((categoria) => {
            categoriasList.appendChild(createCategoriaElement(categoria))
        })

        updateCategoriaSum(categorias)
    } catch (error) {
        modalSpinner.close()
        window.alert(`Não foi possivel carregar as categorias! ${error.message}`)
    }
}

export async function renderCategorias(app){
    loadPage(app)

    modalSpinner = new ModalSpinner(app)

    await renderCategoriasElement(app)

    eventClickToggleStatus(app)

    eventClickCreateCategoria(app)
}