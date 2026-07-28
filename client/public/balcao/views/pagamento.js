import { forItensCart } from '../carrinho.js'
import { changeScreen } from '../balcao.js'

var totalItemsCart = 0
var totalPriceCart = 0
var totalPriceOrder = 0;
var totalPayablePrice = 0;
var totalPaidPrice = 0;

var paymentsMethods = [
    {name: 'dinheiro', price: 0},
    {name: 'debito', price: 0},
    {name: 'credito', price: 0},
    {name: 'pix', price: 0},
]

const tplPaymentPage = document.createElement('template')
tplPaymentPage.innerHTML = `
    <header class="shrink-0 flex flex-row gap-2 border-b-2 border-[#E5E5E5] py-6 px-6">
        <button class="button-return">
            <i class="ri-arrow-left-line text-4xl rounded-md p-1 active:bg-[#f1f1f1]"></i>
        </button>
        <h1 class="w-full text-4xl font-bold">Pagamento</h1>
    </header>


    <main class="w-full flex flex-col flex-1 min-h-0 p-6">
        <div class="flex flex-col max-h-full min-h-0 px-6 border border-[#E5E5E5] rounded-xl sumaryOrder">
            <div class="flex flex-col max-h-full min-h-0 gap-4 border-b border-[#E5E5E5] py-4">
                <div class="flex flex-row shrink-0 justify-between items-center">
                    <span class="text-xl font-bold">Resumo do pedido</span>
                    <span class="text-md text-[#737373] total-items"></span>
                </div>
                <div class="flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto order-list"></div>
            </div>
            <div class="flex flex-col gap-2 border-b border-[#E5E5E5] py-4">
            <div class="flex flex-row justify-between items-center sub-total-container">
                    <span class="text-md text-[#525252]">Subtotal</span>
                    <span class="text-md text-black sub-total-price"></span>
                </div>
                <div class="flex flex-row justify-between items-center">
                    <span class="text-xl font-bold">Total</span>
                    <span class="text-xl font-bold total-price">R$ 18,00</span>
                </div>
                <div class="flex flex-row justify-between items-center paid-container hidden">
                    <span class="text-md text-[#525252]">Já pago</span>
                    <span class="text-md text-black paid-price"></span>
                </div>
            </div>
            <div class="flex flex-row justify-between py-4">
                <span class="text-xl font-bold">Saldo a pagar</span>
                <span class="text-xl font-bold payable-price">R$ 7,00</span>
            </div>
        </div>
        
    </main>


    <footer class="flex flex-col gap-4 px-6">
        <div class="flex flex-row gap-3 discountContainer">
            <button class="w-1/2 text-lg text-black border border-[#E5E5E5] p-3 rounded-xl active:bg-[#F1F1F1] btn-discount">
                <i class="ri-subtract-line quantRem"></i>
                Aplicar desconto
            </button>
            <button class="w-1/2 text-lg text-black border border-[#E5E5E5] p-3 rounded-xl active:bg-[#F1F1F1] btn-addition">
                <i class="ri-add-line active:bg-white/20 p-2 rounded-sm quantAdd touch-manipulation"></i>
                Adicionar acréscimo
            </button>
        </div>
        <div class="flex flex-col gap-2 registered-payment-container hidden">
            <span class="text-[#737373] font-bold">Pagamentos registrados</span>
            <div class="w-full flex flex-col gap-2 payments-list"></div>
        </div>
        <div class="flex flex-col gap-4 pb-6 payment-method">
            <div>
                <span class="font-bold">Forma de pagamento</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
                <span class="w-full flex items-center justify-center bg-black text-xl text-white font-bold p-6 rounded-lg active:bg-black/85 btn-payment cash">Dinheiro</span>
                <span class="w-full flex items-center justify-center bg-black text-white font-bold p-6 rounded-lg active:bg-black/85 btn-payment debit">Débito</span>
                <span class="w-full flex items-center justify-center bg-black text-white text-xl font-bold p-6 rounded-lg active:bg-black/85 btn-payment credit">Crédito</span>
                <span class="w-full flex items-center justify-center bg-black text-white text-xl font-bold p-6 rounded-lg active:bg-black/85 btn-payment pix">Pix</span>
            </div>
        </div>
    </footer>

    <div class="w-screen h-screen flex items-center justify-center bg-black/40 absolute top-0 left-0 overflow-hidden modalInput hidden">

        <section class="w-full flex flex-col absolute bottom-0 translate-y-full bg-white rounded-t-2xl px-6 py-8 transition-transform duration-300 hidden modal-container">
            <div class="flex flex-row justify-between items-start">
                <span>
                    <h2 class="font-bold text-2xl modal-title">Adicionar acréscimo</h2>
                    <span class="text-[#737373] modal-sub-title">Informe o valor adicional do pedido.</span>
                </span>

                <i class="ri-close-line text-3xl text-[#737373] p-2 active:bg-[#f1f1f1] rounded-md modal-close"></i>
            </div>

            <div class="flex flex-col mt-4 gap-2">
                <span class="text-lg">Valor</span>
                <input type="number" placeholder="R$ 0,00" name="" id="" class="font-bold text-2xl border-2 border-black rounded-2xl p-4 outline-none modal-input">
            </div>

            <button class="w-full text-white text-2xl font-bold bg-black/40 mt-6 p-4 rounded-2xl modal-button">Aplicar acréscimo</button>

        </section>
    </div>

    <div class="w-screen h-screen flex items-center justify-center bg-black/40 absolute top-0 left-0 overflow-hidden modalSpinner hidden">
        <section class="w-44 h-44 flex items-center justify-center bg-white rounded-xl spinner">
            <div class="size-2/5 border-8 border-l-black border-black/30 rounded-full animate-spin"></div>
        </section>
    </div>
`

const tplOrderContainer = document.createElement('template')
tplOrderContainer.innerHTML = `
    <div class="flex flex-row justify-between items-center">
        <span class="text-md text-[#525252] order-name">1 × Misto quente</span>
        <span class="text-md text-black order-price">R$ 9,00</span>
    </div>
`

function placeOrder(app){
    let modal = app.querySelector('.modalSpinner')
    let spinner = modal.querySelector('.spinner')

    modal.classList.remove('hidden')

    setTimeout(()=>{
        changeScreen('confirmacao', totalPriceOrder)
    }, 3000)

}

function renderOrderList(app){
    let orderList = app.querySelector(".order-list")

    forItensCart((item)=>{
        let clone = tplOrderContainer.content.cloneNode(true)
        let orderPrice = clone.querySelector(".order-price")
        let orderName = clone.querySelector(".order-name")

        orderPrice.textContent = `R$ ${item.preco},00`
        orderName.textContent = `${item.quant} × ${item.nome}`

        orderList.appendChild(clone)
    })
}

function showModalValue(app, data, limit=false){
    let oldModal = app.querySelector('.modalInput')
    let modal = oldModal.cloneNode(true)
    oldModal.replaceWith(modal)

    let modalContainer = modal.querySelector('.modal-container')
    let modalTitle = modal.querySelector(".modal-title")
    let modalSubTitle = modal.querySelector(".modal-sub-title")
    let modalInput = modal.querySelector('.modal-input')
    let modalButton = modal.querySelector('.modal-button')
    let modalClose = modal.querySelector('.modal-close')

    return new Promise((resolve, reject)=>{
        let fncCloseModal = (result)=>{
            let settled = false

            modalContainer.classList.add('translate-y-full')
            modalContainer.classList.remove('translate-y-0')

            modalContainer.addEventListener('transitionend', ()=>{
                modal.classList.add('hidden')
                modalContainer.classList.add('hidden')
            }, {once:true})

            if(!settled){
                settled = true

                result === undefined ? reject('closed') : resolve(result)
            }
        }

        modal.classList.remove('hidden')
        modalContainer.classList.remove('hidden')

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                modalContainer.classList.toggle('translate-y-full')
                modalContainer.classList.toggle('translate-y-0')
            })
        })

        modalTitle.textContent = data.title
        modalSubTitle.textContent = data.subTitle
        modalButton.textContent = data.textButton

        modalContainer.addEventListener('click', (e)=>{
            e.stopPropagation()
        })

        modalInput.addEventListener('input', ()=>{
            let value = modalInput.value

            if(modalInput.value !== ""){
                modalButton.classList.remove('bg-black/40')
                modalButton.classList.add('bg-black')

                if(limit && value > limit){
                    modalInput.classList.add('border-red-500')

                    modalButton.classList.remove('bg-black')
                    modalButton.classList.add('bg-black/40')
                }else if(limit && value <= limit){
                    modalInput.classList.remove('border-red-500')

                    modalButton.classList.remove('bg-black/40')
                    modalButton.classList.add('bg-black')
                }
            }else{
                modalButton.classList.remove('bg-black')
                modalButton.classList.add('bg-black/40')
            }
        })

        modalButton.addEventListener('click', ()=>{
            let value = modalInput.value

            if(value !== ""){
                if(limit && value <= limit){
                    fncCloseModal(value)
                    modalInput.value = ""
                }else if(!limit){
                    fncCloseModal(value)
                    modalInput.value = ""
                }
            }
        })

        modal.addEventListener('click', () => fncCloseModal())
        modalClose.addEventListener('click', () => fncCloseModal())
    })
}

async function applyPayment(app, type) {
    let registeredPaymentContainer = app.querySelector('.registered-payment-container')
    let paymentsList = app.querySelector('.payments-list')

    let value;
    let nameFormat = (str)=>{
        return str[0].toUpperCase() + str.slice(1)
    }

    let data = {
        title: `Receber via ${nameFormat(type)}`,
        subTitle: `Saldo restante: ${formatCurrency(totalPayablePrice)}.`,
        textButton: 'Confirmar pagamento'
    }

    try {
        value = await showModalValue(app, data, totalPayablePrice)

        value = parseFloat(value)

        totalPayablePrice -= value
        updatePayable(app)

        totalPaidPrice += value
        updatePaid(app)

        registeredPaymentContainer.classList.remove('hidden')

        paymentsList.innerHTML = ''

        paymentsMethods.forEach((method)=>{
            if(method.name == type){
                method.price += value
            }

            if(method.price > 0){
                let element = `
                    <div class="flex flex-row justify-between border border-[#E5E5E5] rounded-xl px-4 py-3">
                        <span>${nameFormat(method.name)}</span>
                        <span>${formatCurrency(method.price)}</span>
                    </div>
                `

                paymentsList.innerHTML += element
            }
        })

        if(totalPayablePrice == 0){
            placeOrder(app)
        }
    } catch (error) {
    }
}

async function applyAddition(app){
    try {
        let value = await showModalValue(app, {
            title: "Aplicar acréscimo",
            subTitle: "Informe o valor adicional do pedido.",
            textButton: "Aplicar acréscimo"
        })

        value = parseFloat(value)

        totalPriceOrder += value
        updateTotalPrice(app)

        totalPayablePrice += value
        updatePayable(app)
    } catch (error) {
    }
}

async function applyDiscount(app){
    try {
        let value = await showModalValue(app, {
            title: "Aplicar desconto",
            subTitle: "Informe o valor que será descontado do pedido.",
            textButton: "Aplicar desconto"
        }, totalPayablePrice)

        value = parseFloat(value)

        totalPayablePrice -= value
        updatePayable(app)

        totalPaidPrice += value
        updatePaid(app)

        if(totalPayablePrice == 0){
            placeOrder(app)
        }
    } catch (error) {
    }
}

function formatCurrency(value){
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
    })
}

function updatePayable(app){
    let payablePriceElement = app.querySelector('.payable-price')

    payablePriceElement.textContent = `${formatCurrency(totalPayablePrice)}`
}

function updateTotalPrice(app){
    let totalPriceElement = app.querySelector('.total-price')

    totalPriceElement.textContent = `${formatCurrency(totalPriceOrder)}`
}

function updatePaid(app){
    let paidContainer = app.querySelector('.paid-container')
    let paidPrice = app.querySelector('.paid-price')

    paidContainer.classList.contains('hidden') ? paidContainer.classList.remove('hidden') : undefined

    paidPrice.textContent = `- ${formatCurrency(totalPaidPrice)}`
}

export function renderPagamento(app){
    let clone = tplPaymentPage.content.cloneNode(true)
    app.appendChild(clone)

    let btnReturn = app.querySelector('.button-return')

    let totalItems = app.querySelector('.total-items')

    let totalPrice = app.querySelector('.total-price')
    let subTotalPrice = app.querySelector('.sub-total-price')
    let payablePrice = app.querySelector('.payable-price')

    let btnDiscount = app.querySelector('.btn-discount')
    let btnAddition = app.querySelector('.btn-addition')

    let btnPayments = app.querySelectorAll('.btn-payment')

    forItensCart((item)=>{
        totalItemsCart += item.quant
        totalPriceCart += item.preco*item.quant
    })

    totalPriceOrder = totalPriceCart
    totalPayablePrice = totalPriceCart

    totalItemsCart == 1 
        ? totalItems.textContent = `1 item`
        : totalItems.textContent = `${totalItemsCart} items`

    subTotalPrice.textContent = `R$ ${totalPriceCart},00`
    updateTotalPrice(app)
    updatePayable(app)

    btnReturn.addEventListener('click', ()=>{
        changeScreen('produtos')
    })

    btnDiscount.addEventListener('click', ()=>{
        if(totalPayablePrice > 0){
            applyDiscount(app)
        }
    })

    btnAddition.addEventListener('click', ()=>{
        applyAddition(app)
    })

    btnPayments.forEach(async (button) => {
        button.addEventListener('click', ()=>{
            if(totalPayablePrice > 0){
                if(button.classList.contains('debit')){
                    applyPayment(app, 'debito')
                }else if(button.classList.contains('credit')){
                    applyPayment(app, 'credito')
                }else if(button.classList.contains('pix')){
                    applyPayment(app, 'pix')
                }else if(button.classList.contains('cash')){
                    applyPayment(app, 'dinheiro')
                }
            }
        })
    });

    renderOrderList(app)
}
