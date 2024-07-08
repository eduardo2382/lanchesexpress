import { authentication } from '../../../configs/firebaseConfig.js'

const auth = authentication.getAuth()

const btnLogin = document.querySelector('#btnLogin')

btnLogin.addEventListener('click', signIn)

async function signIn(){
    let email = document.querySelector('[name=loginEmail]').value
    let password = document.querySelector('[name=loginPassword').value
    

    console.log(email)
    console.log(typeof email)

    await authentication.signInWithEmailAndPassword(auth, email, password)
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