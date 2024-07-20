import { firestore, app} from '../../../configs/firebaseConfig.js'

import { getRequests, Modal } from '../../../global.js'

const db = firestore.getFirestore(app)

const modal = new Modal()

const requests = []

observerRequests()

async function observerRequests(){
    setInterval(async ()=>{
        let tempRequests = await getRequests()

        if(requests.length == 0){
            loadRequests(tempRequests)
        }

    }, 4000)
}

function orderRequests(){
    requests.sort((a, b)=>{
        if(a.time.hour === b.time.hour){

            if(a.time.minute === b.time.minute){
                
                return a.time.second - b.time.second

            }else{
                return a.time.minute - b.time.minute
            }

        }else{
            return a.time.hour - b.time.hour
        }
    })

    console.log(requests)
}

async function loadRequests(tempRequests){
    tempRequests.forEach((request)=>{
        requests.push(request.data())
    })

    orderRequests()
    
    for (let i = 0; i  < requests.length; i++) {
        const request = requests[i]
        
        if(request.state == 'pending'){
            await receiveRequest(request)
        }
    }
}


function receiveRequest(request){
    return new Promise((resolve)=>{
        modal.showModal()
        modal.cleanModal()
        modal.newTittle(`Pedido  ${request.id}`)
        request.products.forEach((product)=>{
            modal.newText(`${product.quantity} - ${product.name}`)
            
        })
        let btnReceive = modal.newButton('Receber pedido')

        btnReceive.addEventListener('click', ()=>{
            modal.hideModal()
            updateState(request)
            resolve(true)
        })
    })
}   

async function updateState(request){
    let requestsFirebase = await getRequests()

    requestsFirebase.forEach((item)=>{
        if(item.data().id == request.id){
            let doc = firestore.doc(db, 'requests', `${item.data().id}`)

            firestore.updateDoc(doc, {
                state: 'confirm'
            })
        }
    })
}

