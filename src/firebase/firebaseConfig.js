import { getFirestore } from "firebase/firestore"; // ← AGREGA ESTA LÍNEAnpm 
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKnaa1sQqL23Z8lZPebgBdtFA-WPzygFs",
  authDomain: "restaurante-proyecto-3.firebaseapp.com",
  projectId: "restaurante-proyecto-3",
  storageBucket: "restaurante-proyecto-3.firebasestorage.app",
  messagingSenderId: "311626024753",
  appId: "1:311626024753:web:b2e42e33e81a06ccde5210",
  measurementId: "G-1PLCBMR4SG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

// REVISAR LAS REGLAS DE SEGURIDAD DE FIRESTORE EN LA CONSOLA DE FIREBASE
// Asegúrate de que las reglas permitan a la aplicación leer y escribir en la colección "restaurants".
