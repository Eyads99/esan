// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithRedirect, signInWithPopup, getRedirectResult  } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTsM97AYVKQExH4q8bxQglhEBuPSMPDtU",
  authDomain: "egxsite.firebaseapp.com",
  databaseURL: "https://egxsite-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "egxsite",
  storageBucket: "egxsite.appspot.com",
  messagingSenderId: "163794934935",
  appId: "1:163794934935:web:89545d8ff6a8154c279dd2",
  measurementId: "G-KCPFLH1C13"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const db = getFirestore()
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, analytics,auth, googleProvider, signInWithRedirect, signInWithPopup, getRedirectResult  }