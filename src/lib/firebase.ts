import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAwZD3UiBIScv92Qo4hihPqEROO0stDm9s",
  authDomain: "loki-kanban.firebaseapp.com",
  projectId: "loki-kanban",
  storageBucket: "loki-kanban.firebasestorage.app",
  messagingSenderId: "187584760436",
  appId: "1:187584760436:web:a0d151418b7a8f0d50df21",
  measurementId: "G-D5FFG2SXEH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics (only in browser)
export const initAnalytics = async () => {
  if (typeof window !== 'undefined' && await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

export default app;
