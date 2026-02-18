/**
 * Firebase configuration
 * 
 * This module initializes Firebase with the project configuration.
 * Firebase app instance is created once and reused across the application.
 */

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

/**
 * Firebase project configuration
 * Using the loki-kanban Firebase project
 */
const firebaseConfig = {
  apiKey: "AIzaSyDExample-replace-with-real-key",
  authDomain: "loki-kanban.firebaseapp.com",
  projectId: "loki-kanban",
  storageBucket: "loki-kanban.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
};

/**
 * Initialize Firebase app (singleton pattern)
 * Prevents multiple initializations in development with hot reload
 */
function initializeFirebase(): FirebaseApp {
  const existingApps = getApps();
  
  if (existingApps.length > 0) {
    return existingApps[0];
  }
  
  return initializeApp(firebaseConfig);
}

// Initialize Firebase
const app = initializeFirebase();

// Initialize Firestore
const db: Firestore = getFirestore(app);

export { app, db };
