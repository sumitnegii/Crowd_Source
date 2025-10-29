// src/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

const firebaseConfig = {
    apiKey: "AIzaSyBa_EF1q5mmlh9LNeSashCTC_UQcsE8gEA",
    authDomain: "helpcrowdbycrowd.firebaseapp.com",
    databaseURL: "https://helpcrowdbycrowd-default-rtdb.firebaseio.com",
    projectId: "helpcrowdbycrowd",
    storageBucket: "helpcrowdbycrowd.firebasestorage.app",
    messagingSenderId: "733901797905",
    appId: "1:733901797905:web:044e8ab37b359968700fb0",
    measurementId: "G-EVJYZ76TBV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);  // Initialize Firebase Storage

// Export services
export { auth, db, storage };  // Export storage here
