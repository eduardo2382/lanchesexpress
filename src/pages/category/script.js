import { Modal, getCategories, getSubCategories } from '../../../global.js'
import { firestore, app} from '../../../configs/firebaseConfig.js'

const db = firestore.getFirestore(app)

const modal = new Modal()

const btnAddCategory = document.querySelector('#btnAddCategory')

btnAddCategory.addEventListener('click', ()=>{
    modal.showModal()
    modalNewCategory()
})

loadCategories()



// Cria o modal para adicionar a categoria
function modalNewCategory(){
    modal.cleanModal()
    let name = modal.newInput('text', 'Nome da Categoria:')
    let btnConfirm = modal.newButton('Confirmar')
    btnConfirm.addEventListener('click', ()=>{
        if(name.value){
            modal.hideModal()
            addNewCategory(name.value)
            loadCategories()
        }
    })
}
// Adiciona a categoria ao banco de dados
async function addNewCategory(value){
    await firestore.setDoc(firestore.doc(db, 'categories', value), {
        name: value,
        id: crypto.randomUUID()
    })
}

// Carrega as categorias na tela para o usuario
async function loadCategories(){
    let categories = await getCategories()
    
    let list = document.querySelector('#categoriesList')

    list.innerHTML = ''

    if(categories.length > 0){
        list.innerHTML = ''
        categories.forEach((doc)=>{
            createCategoryElement(doc.data().name, doc.data().id)
        })
    }

    observeDeleteCategory()
    observeCategory()
}
// Cria o elemento de cada categoria
function createCategoryElement(name, id){
    let category = document.createElement('div')
    category.setAttribute('class', 'categories')
    category.setAttribute('key', id)

    let categoryName = document.createElement('span')
    categoryName.innerHTML += name

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

function observeCategory(){
    let categories = document.querySelectorAll('.categories span')

    categories.forEach((category)=>{
        category.addEventListener('click', ()=>{
            sessionStorage.setItem('currentCategory', category.parentNode.getAttribute('key'))
            window.location.href = '../product/index.html'
        })
    })  
}



// Função que percorre todos os botoes de deletar uma categoria e adiciona um observador
function observeDeleteCategory(){
    let buttons = document.querySelectorAll('.btnDeleteCategory')

    buttons.forEach((button)=>{
        button.addEventListener('click', ()=>{
            deleteSubCategories(button.getAttribute('key'))
            deleteCategory(button.getAttribute('key'))
        })
    })
}
// Deleta uma categoria no banco de dados
async function deleteCategory(key){
    let categories = await getCategories()

    

    categories.forEach(async (doc)=>{
        if(doc.data().id == key){
            await firestore.deleteDoc(firestore.doc(db, 'categories', doc.data().name))
            loadCategories()
        }
    })

}

async function deleteSubCategories(key){
    let subCategories = await getSubCategories()

    subCategories.forEach(async (doc)=>{
        if(doc.data().idCategory == key){
            await firestore.deleteDoc(firestore.doc(db, 'subCategories', doc.data().name))
        }
    })
}