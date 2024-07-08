import { authentication } from '../../../configs/firebaseConfig.js'

const email = document.querySelector('[name=loginEmail]').value
const password = document.querySelector('[name=loginPassword').value
const btnLogin = document.querySelector('#btnLogin')

const auth = authentication.getAuth()

btnLogin.addEventListener('click', ()=>{
    authentication.signInWithEmailAndPassword(auth, email, password)
        .then((userCredential)=>{
            window.location.href = '../../../index.html'
        })
        .catch(handleAuthError)
})


function handleAuthError(error){
    if(error.code){
        switch (error.code){
            case 'auth/missing-password':
                showError("Senha incorreta!")
                break;
            case 'auth/invalid-credential':
                showError("Email ou senha errados!")
                break;
            default:
                break;
        }
    }
}

function showError(message){
    let panelError = document.querySelector('#panelError')

    if(message == null){
        panelError.style.display = 'none'
    } else{
        panelError.style.display = 'block'
        panelError.innerHTML = message
    }
}