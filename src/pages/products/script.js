// Cick do botão adicionar categoria mostrando o modal
import { Modal } from '../../../global.js'
import { firestore, app} from '../../../configs/firebaseConfig.js'

const db = firestore.getFirestore(app)

const modal = new Modal()

const btnAddCategory = document.querySelector('#btnAddCategory')

btnAddCategory.addEventListener('click', ()=>{
    modal.showModal()
    newCategory()
})

function newCategory(){
    modal.cleanModal()
    let categoryName = modal.newInput('text', 'Nome da Categoria:')
    let btnConfirm = modal.newButton('Confirmar')
    btnConfirm.addEventListener('click', ()=>{
        if(categoryName.value){
            modal.hideModal()
            addNewCategory(categoryName.value)
            loadCategories()
        }
    })
}

async function addNewCategory(value){
    await firestore.setDoc(firestore.doc(db, 'categories', value), {
        name: value,
        id: crypto.randomUUID()
    })
}

async function loadCategories(){
    let categories = await firestore.getDocs(firestore.collection(db, 'categories'))
    let list = document.querySelector('#categoriesList')
    list.innerHTML = ''

    categories.forEach((doc)=>{
        createCategoryElement(doc.data().name, doc.data().id)
    })
}

loadCategories()

function createCategoryElement(name, id){
    let category = document.createElement('div')
    category.setAttribute('class', 'categories')
    category.setAttribute('key', id)

    let categoryName = document.createElement('span')
    categoryName.innerText = name
    category.appendChild(categoryName)

    let btnDelete = document.createElement('button')
    btnDelete.setAttribute('class', 'btnDeleteCategory')
    btnDelete.setAttribute('key', id)
    let deleteIcon = document.createElement('i')
    deleteIcon.setAttribute('class', 'ri-delete-bin-fill')
    btnDelete.appendChild(deleteIcon)
    category.appendChild(btnDelete)

    let categories = document.querySelector('#categoriesList')
    categories.appendChild(category)

}

export { addNewCategory }
