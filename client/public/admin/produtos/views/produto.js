import {  } from '../../../shared/js/modal.js'

function listenerBtnAddGroup(){
    let btnAddGroup = document.querySelector('.button-add-group')

    btnAddGroup.addEventListener('click', ()=>{
        
    })
}

function listenerSelectTipo(){
    let tipoSelect = document.querySelector('#tipo')
    let btnAddGroup = document.querySelector('.button-add-group')
    let nameBtnAddGroup = btnAddGroup.querySelector('.button-add-group-name')

    tipoSelect.addEventListener('change', ()=>{
        switch (tipoSelect.value) {
            case 'montavel':
                btnAddGroup.classList.contains('hidden') ? btnAddGroup.classList.remove('hidden') : undefined
                btnAddGroup.dataset.tipo = 'opcoes'
                nameBtnAddGroup.textContent = 'Adicionar grupo de opções'
                break;

            case 'variavel':
                btnAddGroup.classList.contains('hidden') ? btnAddGroup.classList.remove('hidden') : undefined
                btnAddGroup.dataset.tipo = 'variacoes'
                nameBtnAddGroup.textContent = 'Adicionar grupo de variações'
                break;

            case 'simples':
                !btnAddGroup.classList.contains('hidden') ? btnAddGroup.classList.add('hidden') : undefined
                break;

            default:
                break;
        }
    })
}
export function renderProduto(){
    listenerSelectTipo()
    listenerBtnAddGroup()
}

renderProduto()

