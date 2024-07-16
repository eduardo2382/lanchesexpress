import { Modal, getCategories, getProducts } from '../../../global.js'
import { firestore, app} from '../../../configs/firebaseConfig.js'

const db = firestore.getFirestore(app)

const btnConfirm = document.querySelector('.btnConfirm')

var cart = JSON.parse(sessionStorage.getItem('cart'))

var productsList = document.querySelector('.productsList')

var request = {}

const payments = document.querySelectorAll('.payments')

payments.forEach((button)=>{
    button.addEventListener('click', ()=>{
        payments.forEach((payment)=>{
            payment.classList.remove('active')
        })
        button.classList.toggle('active')

        request.methodPayment = button.getAttribute('key')
    })
})

function loadProducts(){
    productsList.innerHTML = ''

    cart.forEach((product)=>{
        console.log(cart)
        createProductElement(product, product.id)
    })

    request.products = cart

    observeDeleteProduct()
}

loadProducts()

function createProductElement(product, id){
    let productElement = document.createElement('div')
    productElement.setAttribute('class', 'products')
    
    let productName = document.createElement('span')
    productName.setAttribute('class', 'productName')
    productName.innerText = product.name

    let productValue = document.createElement('span')
    productValue.setAttribute('class', 'valueProduct')
    productValue.innerText = `R$ ${product.value}`
    productName.appendChild(productValue)

    productElement.appendChild(productName)


    let spanButtons = document.createElement('span')
    spanButtons.setAttribute('class', 'spanButtons')

    let btnObservation = document.createElement('button')
    btnObservation.setAttribute('class', 'btnObservation')
    btnObservation.setAttribute('key', id)
    let iconObservation = document.createElement('i')
    iconObservation.setAttribute('class', 'ri-edit-box-line')
    btnObservation.appendChild(iconObservation)
    spanButtons.appendChild(btnObservation)

    let btnDelete = document.createElement('button')
    btnDelete.setAttribute('class', 'btnDelete')
    btnDelete.setAttribute('key', id)
    let iconDelete = document.createElement('i')
    iconDelete.setAttribute('class', 'ri-delete-bin-line')
    btnDelete.appendChild(iconDelete)
    spanButtons.appendChild(btnDelete)

    productElement.appendChild(spanButtons)
    productsList.appendChild(productElement)
}

function observeDeleteProduct(){
    let buttons = document.querySelectorAll('.btnDelete')

    buttons.forEach((button)=>{
        button.addEventListener('click', ()=>{
            cart = cart.filter(item => item.id != button.getAttribute('key'))
            loadProducts()
        })
    })
}