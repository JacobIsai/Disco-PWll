import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, getDoc, doc } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAMSX_0srpR1i--8y1qRhgKwd5YlrzTEe0",
  authDomain: "disco-d4b2d.firebaseapp.com",
  projectId: "disco-d4b2d",
  storageBucket: "disco-d4b2d.firebasestorage.app",
  messagingSenderId: "488330217705",
  appId: "1:488330217705:web:a694743894305412298878"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export { collection, getDocs, getDoc, doc };
