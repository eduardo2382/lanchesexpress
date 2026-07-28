import { changeScreen } from '../balcao.js'
import { cleanCart } from '../carrinho.js'

const tplConfirmacao = document.createElement('template')
tplConfirmacao.innerHTML = `
    <main class="size-full flex flex-col items-center justify-center gap-4">
        <i class="ri-checkbox-circle-fill text-8xl"></i>
        <h1 class="text-4xl font-bold">Pedido concluido</h1>
        <h3 class="text-lg text-[#737373]">Pedido registrado com sucesso</h3>
        <h2 class="text-4xl font-bold total-price">R$ 11,00</h2>
        <button class="text-white text-xl font-bold bg-black p-6 rounded-xl mt-6 active:bg-black/70 button-new-order">Novo pedido</button>
    </main>
`

export function renderConfirmacao(app, totalPrice){
    let clone = tplConfirmacao.content.cloneNode(true)
    app.appendChild(clone)

    let totalPriceElement = app.querySelector('.total-price')
    let btnNewOrder = app.querySelector('.button-new-order')

    cleanCart()

    totalPriceElement.textContent = `${totalPrice.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
    })}`

    btnNewOrder.addEventListener('click', ()=>{
        changeScreen('produtos')
        
    })
}