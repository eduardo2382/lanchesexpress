import { firestore, app } from "../../../configs/firebaseConfig.js"

import { getCategories, getProducts } from "../../../global.js"

const db = firestore.getFirestore(app)

window.onpopstate = () => {
    window.history.pushState(null, '', window.location.href);
}

var currentSection = 'left'
const btnSectionKeyboard = document.querySelector('#btnSectionKeyboard')
const btnSectionMenu = document.querySelector('#btnSectionMenu')

btnSectionKeyboard.addEventListener('click',()=>{
    let state = currentSection == 'left'
    let bar = document.querySelector('#barFooterSection')
    let keyboard = document.querySelector('#containerKeyboard')
    let menu = document.querySelector('#containerMenu')

    if(!state){
        currentSection = 'left'
        slideElement(bar, '0%')
        slideElement(keyboard, '0%')
        slideElement(menu, '100%')
    }
})

btnSectionMenu.addEventListener('click',()=>{
    let state = currentSection == 'left'
    let bar = document.querySelector('#barFooterSection')
    let keyboard = document.querySelector('#containerKeyboard')
    let menu = document.querySelector('#containerMenu')

    if(state){
        currentSection = 'right'
        slideElement(bar, '50%')
        slideElement(keyboard, '-100%')
        slideElement(menu, '0%')
    }
})

function slideElement(element, porcent){
    element.style.left = porcent
}

function showElement(element, display='block'){
    element.style.display = display
}

function hideElement(element){
    element.style.display = 'none'
}




const categoriesList = document.querySelector('#categoriesList')
const productsList = document.querySelector('#productsList')
var currentCategory = ''
var cart = []

async function loadCategories(){
    let categories = await getCategories()

    showElement(categoriesList, 'flex')
    hideElement(productsList)

    categoriesList.innerHTML = ''

    categories.forEach((doc)=>{
        createCategoryElement(doc.data().name, doc.data().id)
    })

    observeCategories()
}

loadCategories()

function observeCategories(){
    let categories = document.querySelectorAll(".categories")

    categories.forEach((category)=>{
        category.addEventListener('click', ()=>{
            loadProducts(category.getAttribute('key'))
        })
    })
}

function createCategoryElement(name, id){
    let category = document.createElement('div')
    category.setAttribute('class', 'categories')
    category.setAttribute('key', id)

    let categoryName = document.createElement('span')
    categoryName.innerHTML += name

    category.appendChild(categoryName)

    categoriesList.appendChild(category)
}

async function loadProducts(key){
    let products = await getProducts()

    hideElement(categoriesList)
    showElement(productsList, 'flex')

    productsList.innerHTML = ''

    products.forEach((doc)=>{
        if(doc.data().idCategory == key){
            createProductElement(doc.data().name, doc.data().id)
        }
    })

    observeProducts()
}

function createProductElement(name, id){
    let product = document.createElement('div')
    product.setAttribute('class', 'products')
    product.setAttribute('key', id)

    let productName = document.createElement('span')
    productName.setAttribute('class', 'productName')
    productName.innerHTML += name
    product.appendChild(productName)

    productsList.appendChild(product)
}

function observeProducts(){
    let productsName = document.querySelectorAll(".productName")

    productsName.forEach((productName)=>{
        productName.addEventListener('click', ()=>{
            let product = productName.parentNode
            let id = product.getAttribute('key')

            product.classList.toggle('active')

            if(!product.classList.contains('active')){
                removeCart(id)
                removeValue(product)
            } else{
                addCart(id, product)
                createValue(product, id)
            }
        })
    })
}

function removeCart(id){
    cart = cart.filter(item => item.id != id)
}

function subtractCart(id, parentElement){
    let value = parentElement.querySelector('.value')

    cart.forEach((item)=>{
        if(item.id == id){
            if(item.quantity == 1){
                removeCart(id)
                removeValue(parentElement)
                parentElement.classList.toggle('active')
                
            } else{
                item.quantity--
                value.innerText = item.quantity
            }
        }
    })
    
}

function addCart(id, parentElement){
    let value = parentElement.querySelector('.value')

    if(cart.filter(item => item.id == id).length == 0){
        cart.push({
            id: id,
            quantity: 1
        })
    } else{
        cart.forEach((item)=>{
            if(item.id == id){
                item.quantity++
                value.innerText = item.quantity
            }
        })
    }
}

function createValue(parentElement, id){
    let areaValue = document.createElement('div')
    areaValue.setAttribute('class', 'areaValue')

    let addValue = document.createElement('button')
    addValue.setAttribute('class', 'addValue')
    let addIcon = document.createElement('i')
    addIcon.setAttribute('class', 'ri-add-line')
    addValue.appendChild(addIcon)


    let subtractValue = document.createElement('button')
    subtractValue.setAttribute('class', 'subtractValue')
    let subtractIcon = document.createElement('i')
    subtractIcon.setAttribute('class', 'ri-subtract-line')
    subtractValue.appendChild(subtractIcon)

    let value = document.createElement('span')
    value.setAttribute('class', 'value')
    value.innerText = '1'

    areaValue.appendChild(subtractValue)
    areaValue.appendChild(value)
    areaValue.appendChild(addValue)
    parentElement.appendChild(areaValue)

    addValue.addEventListener(('click'), ()=>{
        addCart(id, parentElement)
    })

    subtractValue.addEventListener(('click'), ()=>{
        subtractCart(id, parentElement)
    })
}

function removeValue(parentElement){
    parentElement.removeChild(parentElement.querySelector('.areaValue'))
}