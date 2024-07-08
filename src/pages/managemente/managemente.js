window.onpopstate = () => {
    window.history.pushState(null, '', window.location.href);
}

var currentSection = 'left'
const btnSectionKeyboard = document.querySelector('#btnSectionKeyboard')
const btnSectionMenu = document.querySelector('#btnSectionMenu')

btnSectionKeyboard.addEventListener('click',()=>{
    let state = currentSection == 'left'
    let bar = document.querySelector('#barFooterSection')

    if(!state){
        currentSection = 'left'
        bar.classList = 'footerSectionLeft'
    }
})

btnSectionMenu.addEventListener('click',()=>{
    let state = currentSection == 'left'
    let bar = document.querySelector('#barFooterSection')

    if(state){
        currentSection = 'right'
        bar.classList = 'footerSectionRight'
    }
})

function showElement(element){
    element.style.display = 'block'
}

function hideElement(element){
    element.style.display = 'none'
}
