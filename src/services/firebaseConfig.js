import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCWBhfit2xp3cFuIQez3o8m_PRt8Oi17zs",
  authDomain: "auth-ceferno.firebaseapp.com",
  projectId: "auth-ceferno",
  storageBucket: "auth-ceferno.appspot.com",
  messagingSenderId: "388861107940",
  appId: "1:388861107940:web:0bf718602145d96cc9d6f1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Obter a instância do Auth (se você também estiver usando)
export const auth = getAuth(app);

