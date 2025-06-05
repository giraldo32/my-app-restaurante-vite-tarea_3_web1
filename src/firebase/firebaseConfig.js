import { getFirestore } from "firebase/firestore"; 
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";



const firebaseConfig = {
  apiKey: "AIzaSyDKnaa1sQqL23Z8lZPebgBdtFA-WPzygFs",
  authDomain: "restaurante-proyecto-3.firebaseapp.com",
  projectId: "restaurante-proyecto-3",
  storageBucket: "restaurante-proyecto-3.firebasestorage.app",
  messagingSenderId: "311626024753",
  appId: "1:311626024753:web:b2e42e33e81a06ccde5210",
  measurementId: "G-1PLCBMR4SG"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);


