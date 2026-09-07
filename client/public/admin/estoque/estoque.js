import {ModalInsumo, ModalSpinner, ModalConfirmar} from '../../shared/js/modal.js'
import { api } from '../../shared/api.js'

const app = document.querySelector('.app')

const btnCreateInsumo = document.querySelector(".button-create-insumo")

const modalCreateInsumo = new ModalInsumo(app)
const modalSpinner = new ModalSpinner(app)

function toFirstUpperCase(string){
    return string.charAt(0).toUpperCase() + string.slice(1)
}

async function editInsumo(payload, payloadEdit) {
    let newPayload = {}

    for(let key of Object.keys(payloadEdit)){
        if(payload[key] != payloadEdit[key]) newPayload[key] = payloadEdit[key]
    }

    if(Object.keys(newPayload).length == 0) return

    try {
        modalSpinner.open()

        await api.insumos.atualizar(payload.id, newPayload)

        modalSpinner.close()

        renderInsumoElements()
    } catch (error) {
        modalSpinner.close()
        window.alert(`Nao foi possivel atualizar o insumo! ${error.message}`)
    }
}

async function deleteInsumo(id){        
    try {
        modalSpinner.open()

        await api.insumos.deletar(id)

        modalSpinner.close()

        insumoElement.remove()
    } catch (error) {
        modalSpinner.close()
        window.alert(`Não foi possivel excluir o insumo! ${error.message}`)
    }
}

async function toggleStatusInsumo(insumoElement){
    let name = insumoElement.querySelector('.insumo-name')
    let newStatus = insumoElement.dataset.status == 'ativo' ? 'inativo' : 'ativo'

    try{
        modalSpinner.open()

        await api.insumos.atualizarStatus(insumoElement.dataset.id, newStatus)

        modalSpinner.close()

        insumoElement.dataset.status = newStatus

        name.classList.toggle('text-[#E5E5E5]')
    }catch(error){
        modalSpinner.close()
        window.alert(`Nao foi possivel atualizar o status do insumo! ${error.message}`)
    }    
}

async function createInsumo(payload){
    try {
        modalSpinner.open()

        let insumoCreated = await api.insumos.criar(payload)

        modalSpinner.close()

        renderInsumoElements()
    } catch (error) {
        modalSpinner.close()
        window.alert(`Não foi possivel criar o insumo! ${error.message}`)
    }
}

btnCreateInsumo.addEventListener('click', async ()=>{
    let payload = await modalCreateInsumo.open()

    if(payload) await createInsumo(payload)
})

async function eventClickEditInsumo(insumoElement){
    let app = document.querySelector('.app')
    let btnEdit = insumoElement.querySelector('.button-edit')
    let nomeInsumo = (insumoElement.querySelector(".insumo-name")).textContent

    btnEdit.addEventListener('click', async (e) => {
        e.stopPropagation()

        let modalEdit = new ModalInsumo(app, 'edit', {
            nameInitial: nomeInsumo,
            quantMinimaInitial: insumoElement.dataset.quantMinima,
            typeInitial: insumoElement.dataset.tipoMedida
        })

        let payloadEdit = await modalEdit.open()

        if(payloadEdit) await editInsumo({
            id: insumoElement.dataset.id,
            nome: nomeInsumo.toLowerCase(),
            tipo_medida: insumoElement.dataset.tipoMedida,
            quantidade_atual: insumoElement.dataset.quantAtual,
            quantidade_minima: insumoElement.dataset.quantMinima
        }, payloadEdit)
    })
}

function eventClickDeleteInsumo(insumoElement){
    let app = document.querySelector('.app')
    let btnDelete = insumoElement.querySelector('.button-delete')
    let insumoName = (insumoElement.querySelector('.insumo-name')).textContent

    btnDelete.addEventListener('click', async (e) => {
        e.stopPropagation()

        let modalConfirm = new  ModalConfirmar(app, {
            titulo: `Deseja deletar o insumo ${insumoName} ?`,
            mensagem: "Essa ação não pode ser desfeita!"
        })

        let confirm = await modalConfirm.open()

        if(confirm) await deleteInsumo(insumoElement.dataset.id)
    })
}

function eventClickToggleStatus(insumoElement){
    let toggleStatus = insumoElement.querySelector('.toggle-status')

    toggleStatus.addEventListener('click', async (e) => {
        e.stopPropagation()

        toggleStatus.classList.toggle('bg-white')
        toggleStatus.classList.toggle('bg-black')

        toggleStatus.classList.toggle('text-white')
        toggleStatus.classList.toggle('text-black')

        toggleStatus.classList.toggle('border-transparent')
        toggleStatus.classList.toggle('border-[#E5E5E5]')

        if(toggleStatus.textContent == 'Ativo') toggleStatus.textContent = 'Inativo'
        else toggleStatus.textContent = 'Ativo'

        await toggleStatusInsumo(insumoElement)
    })
}

function createInsumoElement(insumo){
    let unidade;

    switch (insumo.tipo_medida) {
        case 'unidade':
            unidade = 'un'
            break;

        case 'peso':
        unidade = 'g'
        break;

        case 'volume':
        unidade = 'ml'
        break;
    }

    let quantMinima = `${insumo.quantidade_minima} ${unidade}`
    let quantAtual = `${insumo.quantidade_atual} ${unidade}`
    let toggleStatusClass = insumo.status == 'ativo' ? 'bg-black text-white border-transparent' : 'bg-white text-black border-[#E5E5E5]'
    let inactiveClassName = insumo.status == 'inativo' ? 'text-[#E5E5E5]' : ''

    let insumoElement = document.createElement('li')
    insumoElement.className = "w-full text-xl pr-2 pl-3 py-3 border border-[#E5E5E5] rounded-lg shadow-sm"
    insumoElement.dataset.quantMinima = insumo.quantidade_minima
    insumoElement.dataset.quantAtual = insumo.quantidade_atual
    insumoElement.dataset.tipoMedida = insumo.tipo_medida
    insumoElement.dataset.id = insumo.id
    insumoElement.dataset.status = insumo.status

    insumoElement.innerHTML = `
        <div class="w-full flex flex-row items-center justify-between border-b border-b-[#262626] pb-3">
            <span class="max-w-3/6 ${inactiveClassName} font-bold text-lg insumo-name capitalize">${toFirstUpperCase(insumo.nome)}</span>
            <span class="flex items-center gap-2">
                <button class="font-bold px-2 py-1 text-lg border ${toggleStatusClass} rounded-lg cursor-pointer toggle-status">${toFirstUpperCase(insumo.status)}</button>
                <span class="text-2xl text-black">
                    <i class="p-1.5 border border-[#E5E5E5] rounded-lg active:border-black ri-pencil-line cursor-pointer button-edit"></i>
                    <i class="p-1.5 border border-[#E5E5E5] rounded-lg active:border-black ri-delete-bin-line cursor-pointer button-delete"></i>
                </span>
            </span>
        </div>
        <div class="w-full flex flex-col text-base pt-3">
            <span class="flex flex-row justify-between">
                <span class="font-medium">Tipo de medida</span>
                <span class="text-[#737373] ">${toFirstUpperCase(insumo.tipo_medida)}</span>
            </span>
            <span class="flex flex-row justify-between">
                <span class="font-medium">Quantidade minima</span>
                <span class="text-[#737373] data-quantidade-minima="${insumo.quantidade_minima}"">${quantMinima}</span>
            </span>
            <span class="flex flex-row justify-between">
                <span class="font-medium">Quantidade atual</span>
                <span class="text-[#737373] data-quantidade-atual="${insumo.quantidade_atual}"">${quantAtual}</span>
            </span>
        </div>
    `
    eventClickToggleStatus(insumoElement)
    eventClickEditInsumo(insumoElement)
    eventClickDeleteInsumo(insumoElement)

    return insumoElement
}

async function renderInsumoElements(){
    let alertInsumos = document.querySelector('.alert-insumos')
    let listInsumos = document.querySelector('.list-insumos')

    listInsumos.innerHTML = ''

    try {
        modalSpinner.open()

        let insumos = await api.insumos.listar({status: ['ativo', 'inativo']})
        //[{id: 1, nome: 'frango', tipo_medida: 'peso', quantidade_minima: 40, quantidade_atual: 500, status: 'ativo'}]
        //await api.insumos.listar({status: ['ativo', 'inativo']})

        modalSpinner.close()
        
        if(insumos.length > 0){
            listInsumos.classList.contains('hidden') ? listInsumos.classList.remove('hidden') : undefined

            insumos.forEach(insumo => {
                listInsumos.appendChild(createInsumoElement(insumo))
            });

            return
        }

        !listInsumos.classList.contains('hidden') ? listInsumos.classList.add('hidden') : undefined
        alertInsumos.classList.contains('hidden') ? alertInsumos.classList.remove('hidden') : undefined
    } catch (error) {
        modalSpinner.close()
        window.alert(`Não foi possivel carregar os insumos! ${error.message}`)
    }
}

renderInsumoElements()