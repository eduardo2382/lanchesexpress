// Cick do botão adicionar categoria mostrando o modal
import { Modal } from '../../../global.js'
import { firestore } from '../../../configs/firebaseConfig.js'

const modal = new Modal()

const btnAddCategory = document.querySelector('#btnAddCategory')

btnAddCategory.addEventListener('click', ()=>{
    modal.showModal()
    console.log(modal.newCategory())
})

function addNewCategory(inputList){

}

export { addNewCategory }
