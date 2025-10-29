// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyBa_EF1q5mmlh9LNeSashCTC_UQcsE8gEA",
//   authDomain: "helpcrowdbycrowd.firebaseapp.com",
//   databaseURL: "https://helpcrowdbycrowd-default-rtdb.firebaseio.com",
//   projectId: "helpcrowdbycrowd",
//   storageBucket: "helpcrowdbycrowd.firebasestorage.app",
//   messagingSenderId: "733901797905",
//   appId: "1:733901797905:web:044e8ab37b359968700fb0",
//   measurementId: "G-EVJYZ76TBV"


// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// export { auth, db };


//// ___________MObile varification code 



import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

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

export { auth, db, RecaptchaVerifier, signInWithPhoneNumber, createUserWithEmailAndPassword };