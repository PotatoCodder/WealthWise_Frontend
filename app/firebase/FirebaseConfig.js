// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ✅ Use your actual Firebase config here
const firebaseConfig = {
  apiKey: "AIzaSyDMfsEkjq_2YFSPdzwjlqGTVbBjw5I4_Uc",
  authDomain: "wealthwise-349f8.firebaseapp.com",
  projectId: "wealthwise-349f8",
  storageBucket: "wealthwise-349f8.appspot.com",
  messagingSenderId: "870311891010",
  appId: "1:870311891010:web:551a8aa199573784009ddb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
