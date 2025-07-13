// firebase.js

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// ✅ Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzO6pQyxNybvgVOq3thsLmBH1Id4AU7UA",
  authDomain: "cert-submit-37f08.firebaseapp.com",
  projectId: "cert-submit-37f08",
  storageBucket: "cert-submit-37f08.firebasestorage.app",
  messagingSenderId: "334128645732",
  appId: "1:334128645732:web:e37d0140813162a276c171",
  measurementId: "G-14W3P4Q3NL"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ Firebase Services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// ✅ Sign in with Google function
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const idToken = await result.user.getIdToken(); // 🔥 Send this to your backend

    // Optional: Send token to backend
    const res = await fetch("https://cert-submit.onrender.com/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: idToken }),
    });

    const data = await res.json();
    console.log("✅ Verified by backend:", data);

    return data.user; // name, email, etc.
  } catch (error) {
    console.error("❌ Google Sign-In Failed:", error);
    throw error;
  }
};
