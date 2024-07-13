import { Modal, getProducts } from '../../../global.js'
import { firestore, app} from '../../../configs/firebaseConfig.js'

const currentCategory = sessionStorage.getItem('currentCategory')

const db = firestore.getFirestore(app)

const modal = new Modal()

const btnAddProduct = document.querySelector('#btnAddProduct')

loadProducts()

btnAddProduct.addEventListener('click', ()=>{
    modal.showModal()
    modalNewProduct()
})

function modalNewProduct(){
    modal.cleanModal()
    let name = modal.newInput('text', 'Nome do Produto:')
    let btnConfirm = modal.newButton('Confirmar')
    btnConfirm.addEventListener('click', ()=>{
        if(name.value){
            modal.hideModal()
            addNewProduct(name.value)
            loadProducts()
        }
    })
}

async function addNewProduct(value){
    await firestore.setDoc(firestore.doc(db, 'products', value), {
        name: value,
        id: crypto.randomUUID(),
        idCategory: currentCategory
    })
}

async function loadProducts(){
    let products = await getProducts()
    
    let list = document.querySelector('#productsList')

    list.innerHTML = ''
    
    products.forEach((doc)=>{
        if(doc.data().idCategory == currentCategory){
            createProductElement(doc.data().name, doc.data().id)
            doc.data().id
        }
    })

    observeDeleteProduct()
}

function createProductElement(name, id){
    let product = document.createElement('div')
    product.setAttribute('class', 'products')
    product.setAttribute('key', id)

    let productName = document.createElement('span')
    productName.innerHTML += name

    product.appendChild(productName)

    let btnDelete = document.createElement('button')
    btnDelete.setAttribute('class', 'btnDeleteProduct')
    btnDelete.setAttribute('key', id)
    let deleteIcon = document.createElement('i')
    deleteIcon.setAttribute('class', 'ri-delete-bin-fill')
    btnDelete.appendChild(deleteIcon)
    product.appendChild(btnDelete)

    let categories = document.querySelector('#productsList')
    categories.appendChild(product)

}



function observeDeleteProduct(){
    let buttons = document.querySelectorAll('.btnDeleteProduct')

    buttons.forEach((button)=>{
        console.log(button.getAttribute('key'))

        button.addEventListener('click', ()=>{
            modal.cleanModal()
            modal.showModal()
            let btnConfirm = modal.newButton('Confirmar exclusão')
            btnConfirm.addEventListener('click', ()=>{
                deleteProduct(button.getAttribute('key'))
                modal.hideModal()
            })
        })
    })
}

async function deleteProduct(key){
    let products = await getProducts()

    products.forEach(async (doc)=>{
        if(doc.data().id == key){
            await firestore.deleteDoc(firestore.doc(db, 'products', doc.data().name))
            loadProducts()
        }
    })

}



