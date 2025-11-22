// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your firebaseConfig (use as-is)
const firebaseConfig = {
  apiKey: "AIzaSyCvCoeb3cTz7jQavzCzWQ81iC94M0nA-ko",
  authDomain: "tiksaver-f871a.firebaseapp.com",
  projectId: "tiksaver-f871a",
  storageBucket: "tiksaver-f871a.firebasestorage.app",
  messagingSenderId: "935314057707",
  appId: "1:935314057707:web:47dbcc8facc0962d5d51ae",
  measurementId: "G-71HFQQ36MS"
};

// Initialize Firebase only once to prevent multiple instances
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize services with error handling
let analytics = null;
let auth = null;

try {
  // Initialize Analytics only if supported
  if (typeof window !== 'undefined' && isSupported()) {
    analytics = getAnalytics(app);
  }
  
  // Initialize Auth
  auth = getAuth(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export { app, analytics, auth };
