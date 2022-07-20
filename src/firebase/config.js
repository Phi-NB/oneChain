
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'
import 'firebase/compat/storage'
  
const firebaseConfig = {
    apiKey: "AIzaSyBONwzfujMb0hJo-Hs9KmpfDyrgg7ajkKE",
    authDomain: "first-project-266cd.firebaseapp.com",
    projectId: "first-project-266cd",
    storageBucket: "first-project-266cd.appspot.com",
    messagingSenderId: "639161214538",
    appId: "1:639161214538:web:a53a1ba8032bacd917a8b3",
    measurementId: "G-9KB0FNMNWQ"
};
  
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export const storage = firebase.storage()
  
export default db;
