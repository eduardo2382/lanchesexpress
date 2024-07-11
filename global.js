import { addNewCategory } from './src/pages/products/script.js'

('#btnMenuClose')
const btnMenuExpand = document.querySelector('#btnMenuExpand')
const menu = document.querySelector('#menuNavegation')

btnMenuExpand.addEventListener('click', ()=>{
    slideElement(menu, '0%')
})

btnMenuClose.addEventListener('click', ()=>{
    slideElement(menu, '-100%')
})

function slideElement(element, porcent){
    element.style.left = porcent
}

class Modal{
    constructor(){
        this.inputList = []

        this.modal = document.createElement('div')
        this.modal.setAttribute('class', 'modal')

        this.modalContent = document.createElement('div')
        this.modalContent.setAttribute('class', 'modalContent')
        this.modal.appendChild(this.modalContent)

        this.blackout = document.createElement('div')
        this.blackout.setAttribute('class', 'blackout')
        this.modal.appendChild(this.blackout)

        document.body.appendChild(this.modal)
    }

    showModal(){
        this.modal.style.display = 'block'
    }

    hideModal(){
        this.modal.style.display = 'none'
    }

    cleanModal(){
        this.modalContent.innerHTML = ''
    }

    newInput(inputType, placeholder=""){
        let input = document.createElement('input')
        input.setAttribute('type', inputType)
        input.setAttribute('class', 'inputModal')
        input.setAttribute('placeholder', placeholder)
        this.modalContent.appendChild(input)

        this.inputList.push(input)

        return input
    }

    newButton(buttonText){
        let btnModal = document.createElement('input')
        btnModal.setAttribute('type', 'button')
        btnModal.setAttribute('class', 'btnModal')
        btnModal.setAttribute('value', buttonText)
        this.modalContent.appendChild(btnModal)

        btnModal.addEventListener('click', ()=>{
            let filled = 0
            this.inputList.forEach((input)=>{
                if(input.value){
                    filled++
                } 
            })

            if(filled == this.inputList.length){
                this.hideModal()
                addNewCategory(this.inputList)
            } else{
                alert('Preencha todos os campos!!')
            }
        })
    }

    newCategory(){
        this.inputList = []

        this.cleanModal()
        this.newInput('text', 'Nome da Categoria:')
        this.newButton('Confirmar')

        return category
    }
}

export { Modal } 