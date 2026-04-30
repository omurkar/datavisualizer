import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB89IcJ2NqTxLkFXguhoykxHsQDCaNKLZ4",
  authDomain: "yashdb-5d91c.firebaseapp.com",
  databaseURL: "https://yashdb-5d91c-default-rtdb.firebaseio.com",
  projectId: "yashdb-5d91c",
  storageBucket: "yashdb-5d91c.firebasestorage.app",
  messagingSenderId: "456901180723",
  appId: "1:456901180723:web:09dfbd40173cbc61119246"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
export default app;
