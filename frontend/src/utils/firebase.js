import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCPcfRLnqsl_l6c6hjGN8xQqoCN7xakan0",
  authDomain: "cp-tracker-ba295.firebaseapp.com",
  projectId: "cp-tracker-ba295",
  storageBucket: "cp-tracker-ba295.firebasestorage.app",
  messagingSenderId: "118915758076",
  appId: "1:118915758076:web:af79a0b9a5eec1c41f6479",
  measurementId: "G-YPZWZEHTHV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();