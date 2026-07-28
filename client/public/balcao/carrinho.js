const cart = {
    itens: []
}

export function addCart(item, quantItem=false){
    let itemCart = cart.itens.find((i) => i.nome == item.nome)

    if(itemCart){
        quantItem ? itemCart.quant += quantItem : itemCart.quant++
        return
    }


    item.quant = quantItem ? quantItem : 1
    cart.itens.push(item)
}

export function remCart(item, all=false){
    cart.itens.forEach((itemCart)=>{
        if(item.nome == itemCart.nome){
            if(itemCart.quant > 1){ 
                itemCart.quant-- 
            }else{ 
                cart.itens = cart.itens.filter(item => item != itemCart)
            }

            all ? cart.itens = cart.itens.filter(item => item != itemCart) : undefined
        }
    })
}

export function getQuantCart(item){
    let itemCart = cart.itens.find((i) => i.nome == item.nome)
    if(itemCart){ return itemCart.quant }
    else { return false }
}

export function totalPriceCart(){
    return cart.itens.reduce((sum, item) => sum + (item.preco * item.quant),0)
}

export function totalProductsCart(){
    if(cart.itens.length > 0){
        return cart.itens.reduce((sum, item)=> sum + item.quant, 0)
    }

    return 0
}

export function forItensCart(func){
    cart.itens.forEach((item)=>{
        func(item)
    })
}

export function cleanCart(){
    cart.itens = []
}
