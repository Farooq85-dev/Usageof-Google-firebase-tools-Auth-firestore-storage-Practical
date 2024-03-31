//Initiailize App
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
//Firebase Authentication Cdn
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    updatePassword,
    updateEmail,
    deleteUser,
    signOut,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

//Cloud Firestore Cdn
import {
    getFirestore,
    setDoc,
    doc,
    getDoc,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

//Firebase Storage Cdn 
import {
    getStorage,
    uploadBytesResumable,
    getDownloadURL,
    uploadBytes,
    ref,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-storage.js";

//FirebaseConfig
const firebaseConfig = {
    //Add your Firebase Configs
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {
    auth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    db,
    setDoc,
    doc,
    getDoc,
    updatePassword,
    updateEmail,
    uploadBytesResumable,
    getDownloadURL,
    uploadBytes,
    ref,
    storage,
    deleteUser,
    signOut,
}