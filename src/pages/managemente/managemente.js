import { firestore } from "../../../configs/firebaseConfig.js"

window.onpopstate = () => {
    window.history.pushState(null, '', window.location.href);
}

var currentSection = 'left'
const btnSectionKeyboard = document.querySelector('#btnSectionKeyboard')
const btnSectionMenu = document.querySelector('#btnSectionMenu')

const btnMenuClose = document.querySelector('#btnMenuClose')
const btnMenuExpand = document.querySelector('#btnMenuExpand')
const menu = document.querySelector('#menuNavegation')

btnMenuExpand.addEventListener('click', ()=>{
    slideElement(menu, 0)
})

btnMenuClose.addEventListener('click', ()=>{
    slideElement(menu, '-100%')
})

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
