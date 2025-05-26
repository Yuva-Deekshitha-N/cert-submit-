// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzO6pQyxNybvgVOq3thsLmBH1Id4AU7UA",
  authDomain: "cert-submit-37f08.firebaseapp.com",
  projectId: "cert-submit-37f08",
  storageBucket: "cert-submit-37f08.firebasestorage.app",
  messagingSenderId: "334128645732",
  appId: "1:334128645732:web:e37d0140813162a276c171",
  measurementId: "G-14W3P4Q3NL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);