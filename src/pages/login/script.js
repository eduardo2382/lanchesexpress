import { authentication } from '../../../configs/firebaseConfig.js'

const email = document.querySelector('[name=loginEmail]')
const password = document.querySelector('[name=loginPassword')
const btnLogin = document.querySelector('#btnLogin')

const auth = authentication.getAuth()

btnLogin.addEventListener('click', signIn)

async function signIn(){
    console.log(email.value)
    console.log(typeof email)

    await authentication.signInWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential)=>{
            alert('Logado com sucesso!!')
            window.location.href = '../../../index.html'
        })
        .catch(handleAuthError)
}

function handleAuthError(error){
    if(error.code){
        console.log(error.code)
        console.log(error.message)

        switch (error.code){
            case 'auth/missing-password':
                showError("Senha incorreta!")
                break;
            case 'auth/invalid-credential':
                showError("Email ou senha errados!")
                break;
            case 'auth/invalid-email':
                showError('Email inválido!!')
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