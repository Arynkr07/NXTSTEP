// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { sub } from "framer-motion/client";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqsPSSWqh3YGqCFwTQKV0MVIg-cm542wk",
  authDomain: "nxtstep-4.firebaseapp.com",
  projectId: "nxtstep-4",
  storageBucket: "nxtstep-4.firebasestorage.app",
  messagingSenderId: "269421076819",
  appId: "1:269421076819:web:3a4a49ac75e1f5b6a3c1a6",
  measurementId: "G-QL7STD7WPY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);