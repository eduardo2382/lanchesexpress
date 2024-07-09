import { firestore } from "../../../configs/firebaseConfig.js"

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
        slideRight(bar, '0%')
        slideRight(keyboard, '0%')
        slideRight(menu, '100%')
    }
})

btnSectionMenu.addEventListener('click',()=>{
    let state = currentSection == 'left'
    let bar = document.querySelector('#barFooterSection')
    let keyboard = document.querySelector('#containerKeyboard')
    let menu = document.querySelector('#containerMenu')

    if(state){
        currentSection = 'right'
        slideRight(bar, '50%')
        slideRight(keyboard, '-100%')
        slideRight(menu, '0%')
    }
})

loadCategories()

function loadCategories(){
    showElement(document.querySelector('.categoriesList'), 'flex')
    hideElement(document.querySelector('.subCategories'))
    hideElement(document.querySelector('.productsList'))
}

function loadCategory(category){

}

function slideLeft(element, porcent){
    element.style.left = porcent
}

function slideRight(element, porcent){
    element.style.left = porcent
}

function showElement(element, display='block'){
    element.style.display = display
}

function hideElement(element){
    element.style.display = 'none'
}
