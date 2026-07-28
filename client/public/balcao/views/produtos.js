import { getQuantCart, addCart, remCart, totalPriceCart, totalProductsCart, forItensCart } from "../carrinho.js"
import { changeScreen } from "../balcao.js"

const categories = ["pedidos", "bebidas", "doces", "almoço"]

var currentCategory = categories[0]

const produtos = [
    {"nome": "Tapioca", "categoria": "pedidos", "preco": 10.00, "tipo": "montavel"}, 
    {"nome": "Cuscuz", "categoria": "pedidos", "preco": 10.00, "tipo": "montavel"},
    {"nome": "Macaxeira", "categoria": "pedidos", "preco": 10.00, "tipo": "montavel"},
    {"nome": "Batata doce", "categoria": "pedidos", "preco": 10.00, "tipo": "montavel"},
    {"nome": "Pão", "categoria": "pedidos", "preco": 10.00, "tipo": "montavel"},
    {"nome": "Crepioca", "categoria": "pedidos", "preco": 10.00, "tipo": "unico"},
    {"nome": "Coca cola lata", "categoria": "bebidas", "preco": 10.00, "tipo": "unico"},
    {"nome": "Agua", "categoria": "bebidas", "preco": 10.00, "tipo": "unico"},
    {"nome": "Agua de coco", "categoria": "bebidas", "preco": 10.00, "tipo": "unico"},
    {"nome": "Café", "categoria": "bebidas", "preco": 10.00, "tipo": "unico"},
    {"nome": "Pote da felicidade", "categoria": "doces", "preco": 10.00, "tipo": "unico"},
    {"nome": "Bolo de pote", "categoria": "doces", "preco": 10.00, "tipo": "unico"},
    {"nome": "Trufa", "categoria": "doces", "preco": 10.00, "tipo": "unico"}
]


const tplOrdersPage = document.createElement('template')
tplOrdersPage.innerHTML = `
    <h1 class="w-full text-5xl font-bold border-b-2 border-[#E5E5E5] p-8">Lanches Express</h1>
    <section class="bg-[#FAFAFA] flex flex-row border-b-2 border-[#E5E5E5] gap-4 px-6 py-4 overflow-x-auto categoriesList"></section>

    <main class="size-full flex-1 overflow-y-auto">
        <ul class="grid grid-cols-3 border-collapse gap content-start w-full productList"></ul>
    </main>

    <footer class="w-full flex justify-between bg-black p-8">
        <div class="flex flex-col gap-1">
            <span class="text-xl text-[#D4D4D4] totalProducts">0 produtos</span>
            <span class="text-4xl font-bold text-white totalPrice">R$ 0,00</span>
        </div>

        <button class="bg-white/50 font-bold text-4xl rounded-2xl px-4 py-6 transition-scale duration-75 active:scale-95 btnCart">
            <i class="ri-shopping-cart-2-line font-light"></i>
            Carrinho
        </button>
    </footer>

    <div class="w-screen h-screen flex items-center justify-center bg-black/40 absolute top-0 left-0 hidden overflow-hidden modal"></div>
`


const tplAssembledProductCard = document.createElement('template')
tplAssembledProductCard.innerHTML = `
    <li class="h-48 flex flex-col items-start justify-between border-r border-b border-[#E5E5E5] p-6 active:bg-[#E5E5E5]">
        <span class="text-xl text-[#737373] name"></span>
        <span class="flex flex-col">
            <span class="text-lg text-[#A3A3A3]">a partir de</span>
            <span class="text-2xl font-bold price"></span>
        </span>
        <button class="font-bold text-xl flex flex-row">
            Montar
            <i class="ri-arrow-right-s-line"></i>
        </button>
    </li>
`


const tplSingleProductCard = document.createElement('template')
tplSingleProductCard.innerHTML = `
    <li class="h-48 flex flex-col items-start justify-between border-r border-b border-[#E5E5E5] gap-y-6 p-6 active:bg-[#E5E5E5] touch-manipulation singleProductCard">
        <span class="flex flex-col">

            <span class="text-xl text-[#737373] capitalize name"></span>
            <span class="text-2xl font-bold price"></span>

        </span>
        <button class="font-bold text-xl btnAdd">

            <i class="ri-add-line"></i>
            Adicionar

        </button>
        <div class="w-5/6 self-center flex flex-row justify-between items-center gap-x-3 text-white text-2xl font-bold bg-black p-1 rounded-md hidden quantBox">

            <i class="ri-subtract-line active:bg-white/20 p-2 rounded-sm quantRem touch-manipulation"></i>

            <span class="quantDisplay">10</span>

            <i class="ri-add-line active:bg-white/20 p-2 rounded-sm quantAdd touch-manipulation"></i>
        </div>
    </li>
`


const tplModalOptions = document.createElement('template')
tplModalOptions.innerHTML = `
    <section class="w-5/6 max-h-5/6 absolute flex flex-col bottom-0 translate-y-full bg-white rounded-t-2xl menuOptions transition-transform duration-300">
        <div class="flex flex-row items-center justify-between border-b-2 border-[#E5E5E5] p-8">
            <h2 class="font-bold text-5xl titleProduct">Cuscuz</h2>
            <i class="ri-close-line text-5xl text-[#737373] active:bg-[#f1f1f1] rounded-md btnClose"></i>
        </div>

        <div class="flex-1 overflow-y-auto">
            <div class="flex flex-col gap-4 px-8 py-6 titleOption">
                <h3 class="font-bold text-2xl ">Recheio</h3>
                <ul class="flex flex-col gap-3 listOptions"></ul>
            </div>
            <div class="flex flex-col gap-4 px-8 py-6">
                <h3 class="font-bold text-2xl ">Recheio</h3>
                <ul class="flex flex-col gap-3"></ul>
            </div>
            <div class="flex flex-col gap-4 px-8 py-6">
                <h3 class="font-bold text-2xl ">Recheio</h3>
                <ul class="flex flex-col gap-3"></ul>
            </div>
        </div>

        <div class="flex flex-col gap-6 border-t-2 border-[#E5E5E5] p-8 rodape">
            <div class="flex flex-row items-center justify-between">
                <span class="text-xl font-bold text-[]">Quantidade</span>
                <div class="flex flex-row items-center gap-4 text-black font-bold border border-[#D4D4D4] p-1 rounded-lg">
                    <i class="ri-subtract-line text-4xl text-black active:bg-black/20 p-3 rounded-sm quantRem"></i>
                    <span class="text-3xl quantDisplay">1</span>
                    <i class="ri-add-line text-4xl active:bg-black/20 p-3 rounded-sm quantAdd"></i>
                </div>
            </div>

            <button class="w-full flex justify-between bg-black text-white font-bold text-2xl rounded-xl p-6 active:bg-black/85 btnAddProduct">
                <span>
                    <i class="ri-add-line"></i>
                    Adicionar
                </span>
                <span class="priceBaseProduct">
                    R$ 12,00
                </span>
            </button>
        </div>
    </section>
`

const tplMenuCart = document.createElement('template')
tplMenuCart.innerHTML = `
    <section class="h-full w-2/3 absolute flex flex-col top-0 right-0 translate-x-full bg-white menuCart transition-transform duration-300">
        <div class="flex flex-row items-center justify-between border-b-2 border-[#E5E5E5] p-8">
            <h2 class="font-bold text-4xl">Carrinho</h2>
            <i class="ri-close-line text-5xl text-[#737373] active:bg-[#f1f1f1] rounded-md closeCart"></i>
        </div>
        <div class="flex-1 overflow-y-auto p-8">
            <ul class="flex flex-col gap-4 productListCart"></ul>
        </div>  
        <div class="w-full flex flex-col gap-y-4 p-8 border-t-2 border-[#E5E5E5]">
            <div class="w-full flex flex-row justify-between items-center">
                <span class="text-2xl text-[#737373]">Total</span>
                <span class="text-3xl font-bold priceCart"></span>
            </div>
            <button class="w-full bg-black text-white font-bold text-2xl rounded-xl p-6 active:bg-black/85 btnCompleteOrder">Finalizar pedido</button>
        </div>
    </section>
`

const tplProductCart = document.createElement('template')
tplProductCart.innerHTML = `
    <li class="w-full text-2xl flex flex-col gap border border-[#E5E5E5] rounded-xl py-4 px-6">
        <div class="flex flex-row items-center justify-between gap-1">
            <div class="flex flex-row items-center gap-2">
                <span class="size-8 flex flex-row items-center justify-center font-bold bg-black text-xl text-white rounded-sm quantItemCart">10</span>
                <span class="text-2xl font-bold line-clamp-1 nameItemCart"></span>
            </div>
            <i class="ri-delete-bin-line text-3xl text-[#A3A3A3] p-2 active:text-black btnDeleteCart"></i>
        </div>
        <div class="text-[#737373] priceItemCart"></div>
    </li>
`


function closeModalOptions(modal, menuOptions){
    menuOptions.classList.toggle('translate-y-full')
    menuOptions.classList.toggle('translate-y-0')

    menuOptions.addEventListener('transitionend', ()=>{
        modal.classList.add('hidden')
        modal.innerHTML = ''
    }, {once:true})
}


function showModalOptions(app, product){
    let modal = app.querySelector('.modal')
    let clone = tplModalOptions.content.cloneNode(true)

    modal.classList.remove('hidden')
    modal.appendChild(clone)

    let menuOptions = modal.querySelector('.menuOptions')
    let btnClose = modal.querySelector(".btnClose")
    let btnAddProduct = modal.querySelector('.btnAddProduct')
    let priceBaseProduct = modal.querySelector('.priceBaseProduct')
    let titleProduct = modal.querySelector('.titleProduct')
    let quantAdd = modal.querySelector('.quantAdd')
    let quantRem = modal.querySelector('.quantRem')
    let quantDisplay = modal.querySelector('.quantDisplay')
    let quantity = 1

    priceBaseProduct.textContent = `R$ ${product.preco},00`
    titleProduct.textContent = product.nome

    menuOptions.addEventListener('click', (e)=>{
        e.stopPropagation()
    })

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            menuOptions.classList.toggle('translate-y-full')
            menuOptions.classList.toggle('translate-y-0')
        })
    })

    btnClose.addEventListener('click', ()=>{
        closeModalOptions(modal, menuOptions)
    })  

    quantAdd.addEventListener('click', ()=>{
        quantity++

        quantDisplay.textContent = quantity
    })

    quantRem.addEventListener('click', ()=>{
        quantity > 1 ? quantity-- : undefined

        quantDisplay.textContent = quantity
    })

    btnAddProduct.addEventListener('click', ()=>{
        addCart(product, quantity)

        updateTotal(app)

        closeModalOptions(modal, menuOptions)
    })
}


function elementItemCart(app, item, price){
    let clone = tplProductCart.content.cloneNode(true)
    let card = clone.querySelector("li")
    let priceItemCart = clone.querySelector('.priceItemCart')
    let nameItemCart = clone.querySelector('.nameItemCart')
    let quantItemCart = clone.querySelector('.quantItemCart')
    let btnDeleteCart = clone.querySelector('.btnDeleteCart')

    priceItemCart.textContent = `R$ ${item.preco * item.quant},00`
    nameItemCart.textContent = item.nome
    quantItemCart.textContent = item.quant

    btnDeleteCart.addEventListener('click', ()=>{    
        remCart(item, true)
        updateQuantityProducts(app)
        updateTotal(app)
        card.remove()
    })

    return clone
}


function showCart(app){
    let modal = app.querySelector('.modal')
    let clone = tplMenuCart.content.cloneNode(true)

    modal.classList.remove('hidden')
    modal.appendChild(clone)

    let menuCart = modal.querySelector('.menuCart')
    let productListCart = modal.querySelector('.productListCart')
    let priceCart = modal.querySelector('.priceCart')
    let closeCart = modal.querySelector('.closeCart')
    let btnCompleteOrder = modal.querySelector('.btnCompleteOrder')

    menuCart.addEventListener('click', (e)=>{
        e.stopPropagation()
    })

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            menuCart.classList.toggle('translate-x-full')
            menuCart.classList.toggle('translate-x-0')
        })
    })

    priceCart.textContent = `R$ ${totalPriceCart()},00`

    productListCart.innerHTML = ''

    forItensCart((item)=>{
        productListCart.appendChild(elementItemCart(app, item))
    })

    closeCart.addEventListener('click', ()=>{
        menuCart.classList.toggle('translate-x-full')
        menuCart.classList.toggle('translate-x-0')

        updateQuantityProducts(app)

        menuCart.addEventListener('transitionend', ()=>{
            modal.classList.add('hidden')
            modal.innerHTML = ''
        }, {once:true})
    })

    btnCompleteOrder.addEventListener('click', ()=>{
        changeScreen('pagamento')
    })

}


function updateTotal(app){
    let totalProducts = app.querySelector('.totalProducts')
    let totalPrice = app.querySelector('.totalPrice')
    let btnCart = app.querySelector('.btnCart')
    let priceCart = app.querySelector('.priceCart')

    let products = totalProductsCart()
    let price = totalPriceCart()

    products > 1 
        ? totalProducts.textContent = `${products} produtos` 
        : totalProducts.textContent = `${products} produto`

    totalPrice.textContent = `R$ ${price},00`

    if(products > 0){
        btnCart.classList.remove('bg-white/50')
        btnCart.classList.add('bg-white')
    }else{
        btnCart.classList.add('bg-white/50')
        btnCart.classList.remove('bg-white')
    }

    priceCart ? priceCart.textContent = `R$ ${price},00` : undefined
}


function updateQuantityProducts(app){
    let singleProductCardList = app.querySelectorAll('.singleProductCard')

    let productsCurrentCategory = produtos.filter(product => product.categoria == currentCategory)

    singleProductCardList.forEach((element)=>{
        let name = element.querySelector('.name').textContent
        let product = productsCurrentCategory.find(p => p.nome == name)
        let quantDisplay = element.querySelector('.quantDisplay')
        let quantity = getQuantCart(product)
        let quantBox = element.querySelector('.quantBox')
        let btnAdd = element.querySelector('.btnAdd')

        if(quantity){
            quantDisplay.textContent = quantity
        }else{
            quantBox.classList.add('hidden')
            btnAdd.classList.remove('hidden')
        }
    })
}


function renderProductCategory(app){
    let productsContainer = app.querySelector('.productList')

    productsContainer.innerHTML = ''

    let productsCurrentCategory = produtos.filter(product => product.categoria == currentCategory)

    productsCurrentCategory.forEach((product)=>{
        if(product.tipo == 'unico'){
            let clone = tplSingleProductCard.content.cloneNode(true)

            clone.querySelector('.name').textContent = product.nome
            clone.querySelector('.price').textContent = `R$ ${product.preco},00`

            let card = clone.querySelector('li')
            let btnAdd = clone.querySelector('.btnAdd')
            let quantBox = clone.querySelector('.quantBox')
            let quantDisplay = clone.querySelector('.quantDisplay')
            let quantAdd = clone.querySelector('.quantAdd')
            let quantRem = clone.querySelector('.quantRem')
            let quantity = 0 

            if(getQuantCart(product)){ quantity = getQuantCart(product)}

            if(quantity){
                quantBox.classList.remove('hidden')
                btnAdd.classList.add('hidden')
                quantDisplay.textContent = quantity
            }

            card.addEventListener('click', (e)=>{
                if(!getQuantCart(product)){ quantity = 1 }
                else{ quantity++ }

                quantDisplay.textContent = quantity

                btnAdd.classList.add('hidden')
                quantBox.classList.remove('hidden')

                addCart(product)
                updateTotal(app)
            })

            quantAdd.addEventListener('click', (e)=>{
                e.stopPropagation()

                quantity += 1
                quantDisplay.textContent = quantity

                addCart(product)
                updateTotal(app)
            })

            quantRem.addEventListener('click', (e)=>{
                e.stopPropagation()

                quantity -= 1
                quantDisplay.textContent = quantity

                remCart(product)
                updateTotal(app)
                
                if(quantity == 0){
                    quantBox.classList.add('hidden')
                    btnAdd.classList.remove('hidden')
                }   
            })

            productsContainer.appendChild(clone)
        }else{
            let clone = tplAssembledProductCard.content.cloneNode(true)

            clone.querySelector('.name').textContent = product.nome
            clone.querySelector('.price').textContent = `R$ ${product.preco},00`

            let card = clone.querySelector('li')

            card.addEventListener('click', ()=>{
                showModalOptions(app, product)
            })

            productsContainer.appendChild(clone)
        }
    })
}


function createCategoriesElement(app){
    let containerCategories = app.querySelector('.categoriesList')

    categories.forEach((categoryName)=>{    
        let button = document.createElement('button')

        if(categoryName == currentCategory){
            button.className = 'bg-black text-white text-lg font-bold border border-transparent rounded-xl px-6 py-4 currentCategory'
        }else{
            button.className = 'text-lg font-bold border border-[#D4D4D4] active:border-[#262626] rounded-xl px-6 py-4'
        }

        button.textContent = categoryName

        containerCategories.appendChild(button)

        button.addEventListener('click', ()=>{
            let currentCategoryElement = containerCategories.querySelector('.currentCategory')
            currentCategoryElement.className = 'text-lg font-bold border border-[#D4D4D4] active:border-[#262626] rounded-xl px-6 py-4'

            button.className = 'bg-black text-white text-lg font-bold border border-transparent rounded-xl px-6 py-4 currentCategory'

            currentCategory = button.textContent
            
            renderProductCategory(app)
        })
    })

    renderProductCategory(app)
}


export async function renderPedido(app){
    let clone = tplOrdersPage.content.cloneNode(true)
    let btnCart;
    let modal;

    currentCategory = categories[0]
    
    app.innerHTML = ''
    app.appendChild(clone)
    updateTotal(app)
    

    btnCart = app.querySelector('.btnCart')
    
    btnCart.addEventListener('click', ()=>{
        totalProductsCart() > 0 ? showCart(app) : undefined
    })

    modal = app.querySelector(".modal")

    modal.addEventListener('click', ()=>{
        let childModal = modal.children[0]

        if(childModal && modal.children[0].classList.contains('menuCart')){
            childModal.classList.toggle('translate-x-full')
            childModal.classList.toggle('translate-x-0')

            updateQuantityProducts(app)

            childModal.addEventListener('transitionend', ()=>{
                modal.classList.add('hidden')
                modal.innerHTML = ''
            }, {once:true})
        }

        if(childModal && modal.children[0].classList.contains('menuOptions')){
            childModal.classList.toggle('translate-y-full')
            childModal.classList.toggle('translate-y-0')

            childModal.addEventListener('transitionend', ()=>{
                modal.classList.add('hidden')
                modal.innerHTML = ''
            }, {once:true})
        }
    })
    createCategoriesElement(app)
}