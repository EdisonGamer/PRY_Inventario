import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, addDoc, doc, updateDoc, increment, getDocs, query, where 
} from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAM62Ni08q2nqxqWg4ZeoeKf0ShLWlCGQQ",
  authDomain: "inventario-repuestos-92cca.firebaseapp.com",
  projectId: "inventario-repuestos-92cca",
  storageBucket: "inventario-repuestos-92cca.appspot.com",
  messagingSenderId: "567640257667",
  appId: "1:567640257667:web:4190fad1a0052eae9c97b6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { 
  db, auth, collection, addDoc, doc, updateDoc, increment, getDocs, query, where, 
  signInWithEmailAndPassword, createUserWithEmailAndPassword 
};
