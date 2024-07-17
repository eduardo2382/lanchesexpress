import { firestore, app } from './configs/firebaseConfig.js'

const db = firestore.getFirestore(app)

const btnMenuClose = document.querySelector('#btnMenuClose')
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
        this.modal = document.createElement('div')
        this.modal.setAttribute('class', 'modal')

        this.modalContent = document.createElement('div')
        this.modalContent.setAttribute('class', 'modalContent')
        this.modal.appendChild(this.modalContent)

        this.blackout = document.createElement('div')
        this.blackout.setAttribute('class', 'blackout')
        this.blackout.addEventListener('click', ()=>{this.hideModal()})
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

        return input
    }

    newButton(buttonText, buttonId=''){
        let btnModal = document.createElement('input')
        btnModal.setAttribute('type', 'button')
        btnModal.setAttribute('class', 'btnModal')
        btnModal.setAttribute('value', buttonText)
        btnModal.setAttribute('id', buttonId)
        this.modalContent.appendChild(btnModal)

        return btnModal
    }   
    
    newTittle(text){
        let tittleModal = document.createElement('h2')
        tittleModal.setAttribute('class', 'titleModal')
        tittleModal.innerText = text
        
        this.modalContent.appendChild(tittleModal)

        return tittleModal
    } 
}

async function getCategories(){
    let collection = await firestore.getDocs(firestore.collection(db, 'categories'))

    let categories = []

    collection.forEach((doc)=>{
        categories.push(doc)
    })

    return categories
}

async function getSubCategories(){
    let collection = await firestore.getDocs(firestore.collection(db, 'subCategories'))

    let subCategories = []

    collection.forEach((doc)=>{
        subCategories.push(doc)
    })

    return subCategories
}

async function getProducts(){
    let collection = await firestore.getDocs(firestore.collection(db, 'products'))

    let products = []

    collection.forEach((doc)=>{
        products.push(doc)
    })

    return products
}

export { Modal, getCategories, getSubCategories, getProducts } 