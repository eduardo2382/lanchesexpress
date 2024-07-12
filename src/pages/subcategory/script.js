import { Modal, getSubCategories } from '../../../global.js'
import { firestore, app} from '../../../configs/firebaseConfig.js'

const currentCategory = sessionStorage.getItem('currentCategory')

const db = firestore.getFirestore(app)

const modal = new Modal()

const btnAddSubCategory = document.querySelector('#btnAddSubCategory')

loadSubCategories()

btnAddSubCategory.addEventListener('click', ()=>{
    modal.showModal()
    modalNewSubCategory()
})

function modalNewSubCategory(){
    modal.cleanModal()
    let name = modal.newInput('text', 'Nome da Sub-categoria:')
    let btnConfirm = modal.newButton('Confirmar')
    btnConfirm.addEventListener('click', ()=>{
        if(name.value){
            modal.hideModal()
            addNewSubCategory(name.value)
            loadSubCategories()
        }
    })
}

async function addNewSubCategory(value){
    await firestore.setDoc(firestore.doc(db, 'subCategories', value), {
        name: value,
        id: crypto.randomUUID(),
        idCategory: currentCategory
    })
}

async function loadSubCategories(){
    let subCategories = await getSubCategories()
    
    let list = document.querySelector('#subCategoriesList')

    list.innerHTML = ''
    
    subCategories.forEach((doc)=>{
        if(doc.data().idCategory == currentCategory){
            createSubCategoryElement(doc.data().name, doc.data().id)
        }
    })

    observeDeleteSubCategory()
    observeSubCategory()
}

function createSubCategoryElement(name, id){
    let SubCategory = document.createElement('div')
    SubCategory.setAttribute('class', 'subCategories')
    SubCategory.setAttribute('key', id)

    let SubCategoryName = document.createElement('span')
    SubCategoryName.innerHTML += name

    SubCategory.appendChild(SubCategoryName)

    let btnDelete = document.createElement('button')
    btnDelete.setAttribute('class', 'btnDeleteSubCategory')
    btnDelete.setAttribute('key', id)
    let deleteIcon = document.createElement('i')
    deleteIcon.setAttribute('class', 'ri-delete-bin-fill')
    btnDelete.appendChild(deleteIcon)
    SubCategory.appendChild(btnDelete)

    let categories = document.querySelector('#subCategoriesList')
    categories.appendChild(SubCategory)

}

function observeSubCategory(){
    let subCategories = document.querySelectorAll('.subCategories span')

    subCategories.forEach((category)=>{
        category.addEventListener('click', ()=>{
            console.log('ola')
            sessionStorage.setItem('currentSubCategory', category.parentNode.getAttribute('key'))
            window.location.href = '../product/index.html'
        })
    })  
}



function observeDeleteSubCategory(){
    let buttons = document.querySelectorAll('.btnDeleteSubCategory')

    buttons.forEach((button)=>{
        button.addEventListener('click', ()=>{
            deleteSubCategory(button.getAttribute('key'))
        })
    })
}

async function deleteSubCategory(key){
    let categories = await getSubCategories()

    categories.forEach(async (doc)=>{
        if(doc.data().id == key){
            await firestore.deleteDoc(firestore.doc(db, 'subCategories', doc.data().name))
            loadSubCategories()
        }
    })

}



