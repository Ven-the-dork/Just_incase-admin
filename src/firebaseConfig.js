import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase config (make sure these values are strings)
const firebaseConfig = {
  apiKey: "AIzaSyCQxzmA4KyslCDEB_J3G9fvpvpDfY6vdk8",
  authDomain: "cvsu-payroll.firebaseapp.com",
  projectId: "cvsu-payroll",
  storageBucket: "cvsu-payroll.firebasestorage.app",
  messagingSenderId: "607770244208",
  appId: "1:607770244208:web:20193ea851c41096f130b5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it
export const auth = getAuth(app);
