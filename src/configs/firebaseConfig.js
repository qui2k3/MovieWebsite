// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase } from "firebase/database";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "api-firebase-moviewebsite.firebaseapp.com",
  projectId: "api-firebase-moviewebsite",
  storageBucket: "api-firebase-moviewebsite.firebasestorage.app",
  messagingSenderId: "590093435285",
  appId: "1:590093435285:web:e284ad54c0c7365953769c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
