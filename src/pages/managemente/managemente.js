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


const categoriesList = document.querySelector('#categoriesList')
const productsList = document.querySelector('#productsList')
var currentCategory = ''

async function loadCategories(){
    let categories = await getCategories()

    categoriesList.style.display = 'flex'
    productsList.style.display = 'none'

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

    categoriesList.style.display = 'none'
    productsList.style.display = 'flex'

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
    productName.innerHTML += name

    product.appendChild(productName)

    productsList.appendChild(product)
}

function observeProducts(){
    let products = document.querySelectorAll(".products")

    products.forEach((product)=>{
        product.addEventListener('click', ()=>{
            loadCategories()

            firestore.setDoc(firestore.doc(db, 'products', crypto.randomUUID()), {
                name: 'Pedido',
                id: crypto.randomUUID()
            })
        })
    })
}