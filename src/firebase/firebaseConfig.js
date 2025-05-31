import { getFirestore } from "firebase/firestore"; // ← AGREGA ESTA LÍNEAnpm 
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBe9xkwmbb2Wm6OM8pfWsdDCmEervtuge0",
  authDomain: "restaurante-47036.firebaseapp.com",
  projectId: "restaurante-47036",
  storageBucket: "restaurante-47036.firebasestorage.app",
  messagingSenderId: "169634170724",
  appId: "1:169634170724:web:4e1f87d8b64ea1967a5c71",
  measurementId: "G-3T452RC53H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

// REVISAR LAS REGLAS DE SEGURIDAD DE FIRESTORE EN LA CONSOLA DE FIREBASE
// Asegúrate de que las reglas permitan a la aplicación leer y escribir en la colección "restaurants".
