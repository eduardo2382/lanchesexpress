import { authentication } from '../configs/firebaseConfig.js'

const auth = authentication.getAuth()

auth.onAuthStateChanged((value)=>{
    if(value){
    }else{
        window.location.href = 'src/pages/login/index.html'
    }
})