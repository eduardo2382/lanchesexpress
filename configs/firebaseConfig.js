import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";

import * as authentication from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

import * as firestore from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyAqM7X4NXouO8ewAniBAglsk1qw3g7Q5dE",
    authDomain: "projeto-lanches-express.firebaseapp.com",
    projectId: "projeto-lanches-express",
    storageBucket: "projeto-lanches-express.appspot.com",
    messagingSenderId: "357794098717",
    appId: "1:357794098717:web:6a0dc687562ae1ffc6a0f4"
};
const app = initializeApp(firebaseConfig);

export { firestore, authentication };