import { Modal, getCategories, getProducts } from '../../../global.js'
import { firestore, app} from '../../../configs/firebaseConfig.js'

const db = firestore.getFirestore(app)

const btnConfirm = document.querySelector('.btnConfirm')

var cart = JSON.parse(sessionStorage.getItem('cart'))

var productsList = document.querySelector('.productsList')



function loadProducts(){
    

    cart.forEach((product)=>{
        console.log(cart)
        createProductElement(product)
    })
}

loadProducts()

function createProductElement(product){
    let productElement = document.createElement('div')
    productElement.setAttribute('class', 'products')
    
    let productName = document.createElement('span')
    productName.setAttribute('class', 'productName')
    productName.innerText = product.name
    productElement.appendChild(productName)

    let spanButtons = document.createElement('span')
    spanButtons.setAttribute('class', 'spanButtons')

    let btnObservation = document.createElement('button')
    btnObservation.setAttribute('class', 'btnObservation')
    let iconObservation = document.createElement('i')
    iconObservation.setAttribute('class', 'ri-edit-box-line')
    btnObservation.appendChild(iconObservation)
    spanButtons.appendChild(btnObservation)

    let btnDelete = document.createElement('button')
    btnDelete.setAttribute('class', 'btnDelete')
    let iconDelete = document.createElement('i')
    iconDelete.setAttribute('class', 'ri-delete-bin-line')
    btnDelete.appendChild(iconDelete)
    spanButtons.appendChild(btnDelete)

    productElement.appendChild(spanButtons)
    productsList.appendChild(productElement)
}