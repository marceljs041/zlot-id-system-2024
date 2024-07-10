import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB9uzGcBQ2HJmfkAn97w8sFf7rgq5eCQ5M",
    authDomain: "zlot-id-system.firebaseapp.com",
    databaseURL: "https://zlot-id-system-default-rtdb.firebaseio.com",
    projectId: "zlot-id-system",
    storageBucket: "zlot-id-system.appspot.com",
    messagingSenderId: "489909281925",
    appId: "1:489909281925:web:46e009258a8e406cf6b5ec",
    measurementId: "G-NLX1NV021Q"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, signInWithPopup, signOut, db };