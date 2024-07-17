import { firestore, app} from '../../../configs/firebaseConfig.js'

const db = firestore.getFirestore(app)

async function getRequests(){
    let collection = await firestore.getDocs(firestore.collection(db, 'requests'))

    let requests = []

    collection.forEach((doc)=>{
        requests.push(doc)
    })

    return requests
}

function createElementRequest(element){
    let main = document.querySelector('main')

    let request = document.createElement('div')
    request.setAttribute('class', 'requests')
    request.innerText = `Pedido ${element.id}`

    main.appendChild(request)
}

setInterval(async ()=>{
    let requests = await getRequests()

    document.querySelector('main').innerHTML = ''

    requests.forEach((request)=>{
        createElementRequest(request)
    })
}, 1000)