// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAM62Ni08q2nqxqWg4ZeoeKf0ShLWlCGQQ",
    authDomain: "inventario-repuestos-92cca.firebaseapp.com",
    projectId: "inventario-repuestos-92cca",
    storageBucket: "inventario-repuestos-92cca.appspot.com",
    messagingSenderId: "567640257667",
    appId: "1:567640257667:web:4190fad1a0052eae9c97b6"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, collection, addDoc, getDocs };
