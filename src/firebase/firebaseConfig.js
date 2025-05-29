// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-mmjY5ls_t5rTcIYmFKQGE9BnoP7eaOM",
  authDomain: "restaurante-app-f5555.firebaseapp.com",
  projectId: "restaurante-app-f5555",
  storageBucket: "restaurante-app-f5555.firebasestorage.app",
  messagingSenderId: "401944273724",
  appId: "1:401944273724:web:876578d366a7d0df117439",
  measurementId: "G-R71YEBPCF4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
