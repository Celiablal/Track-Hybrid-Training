import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDvZtVcsgEKKsXWVM0fHftzMa8-uUTEO8U",
  authDomain: "track-hybrid-training.firebaseapp.com",
  projectId: "track-hybrid-training",
  storageBucket: "track-hybrid-training.firebasestorage.app",
  messagingSenderId: "750951149842",
  appId: "1:750951149842:web:205107cc197f4a85e243cb"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
