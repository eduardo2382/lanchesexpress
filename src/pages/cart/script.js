import { Modal, getCategories, getProducts } from '../../../global.js'
import { firestore, app} from '../../../configs/firebaseConfig.js'

const db = firestore.getFirestore(app)

const btnConfirm = document.querySelector('.btnConfirm')

var cart = JSON.parse(sessionStorage.getItem('cart'))

var productsList = document.querySelector('.productsList')

var request = []

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
        createProductElement(product, product.id)
    })

    request.products = cart

    updateTotal()
    observeAdd()
    observeSubtract()
}

loadProducts()

function createProductElement(product, id){
    let productElement = document.createElement('div')
    productElement.setAttribute('class', 'products')
    
    let spanProduct = document.createElement('div')
    spanProduct.setAttribute('class', 'spanProduct')

    let productName = document.createElement('span')
    productName.setAttribute('class', 'productName')
    productName.innerText = product.name

    let btnObservation = document.createElement('button')
    btnObservation.setAttribute('class', 'btnObservation')
    btnObservation.setAttribute('key', id)
    let iconObservation = document.createElement('i')
    iconObservation.setAttribute('class', 'ri-pencil-fill')
    btnObservation.appendChild(iconObservation)

    productName.appendChild(btnObservation)
    spanProduct.appendChild(productName)
    

    let productValue = document.createElement('span')
    productValue.setAttribute('class', 'valueProduct')
    productValue.innerText = `R$ ${product.value}`
    spanProduct.appendChild(productValue)

    spanProduct.appendChild(productValue)

    productElement.appendChild(spanProduct)


    let spanValue = document.createElement('span')
    spanValue.setAttribute('class', 'spanValue')

    let btnAdd = document.createElement('button')
    btnAdd.setAttribute('class', 'btnAdd')
    btnAdd.setAttribute('key', id)
    let iconAdd = document.createElement('i')
    iconAdd.setAttribute('class', 'ri-add-line')
    btnAdd.appendChild(iconAdd)

    let productQuantity = document.createElement('span')
    productQuantity.setAttribute('class', 'productQuantity')
    productQuantity.setAttribute('key', id)
    productQuantity.innerText = product.quantity

    let btnSubtract = document.createElement('button')
    btnSubtract.setAttribute('class', 'btnSubtract')
    btnSubtract.setAttribute('key', id)
    let iconSubtract = document.createElement('i')
    iconSubtract.setAttribute('class', 'ri-subtract-line')
    btnSubtract.appendChild(iconSubtract)

    spanValue.appendChild(btnSubtract)
    spanValue.appendChild(productQuantity)
    spanValue.appendChild(btnAdd)
    productElement.appendChild(spanValue)

    productsList.appendChild(productElement)
}

function updateTotal(){
    let totalValue = document.querySelector(".totalValue")

    let value = 0

    cart.forEach((product)=>{
        value = value + (product.value * product.quantity)
    })

    totalValue.innerText = `R$ ${value.toFixed(2)}`
}

function observeAdd(){
    let buttonsAdd = document.querySelectorAll('.btnAdd')
    let productsQuantity = document.querySelectorAll('.productQuantity')
    
    buttonsAdd.forEach((button)=>{
        let buttonKey = button.getAttribute('key')

        button.addEventListener('click', ()=>{
            productsQuantity.forEach((element)=>{
                let elementKey = element.getAttribute('key')

                if(elementKey == buttonKey){
                    cart.forEach((item)=>{
                        if(item.id == buttonKey){
                            item.quantity++
                            element.innerText = item.quantity
                        }
                    })
                }
            })

            updateTotal()
            updateCart()
            
        })
    })
}

function observeSubtract(){
    let buttonsSubtract = document.querySelectorAll('.btnSubtract')
    let productsQuantity = document.querySelectorAll('.productQuantity')

    buttonsSubtract.forEach((button)=>{
        let buttonKey = button.getAttribute('key')

        button.addEventListener('click', ()=>{
            productsQuantity.forEach((element)=>{
                let elementKey = element.getAttribute('key')

                if(elementKey == buttonKey){
                    cart.forEach((item)=>{
                        if(item.id == buttonKey){
                            if(item.quantity > 0){
                                item.quantity--
                                element.innerText = item.quantity
                            } 
                        }
                    })
                }
            })

            updateTotal()  
            updateCart()
        })
    })
}

function updateCart(){
    sessionStorage.setItem('cart', JSON.stringify(cart))
}

function updateRequest(){
    request = {}

    cart.forEach((item)=>{  

    })
}