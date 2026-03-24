// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCoPrWy0aXanMRXk0IXFeeS3zX1OhaPe_M",
  authDomain: "harmonia-75601.firebaseapp.com",
  projectId: "harmonia-75601",
  storageBucket: "harmonia-75601.firebasestorage.app",
  messagingSenderId: "303117886988",
  appId: "1:303117886988:web:64a6ca2ff8fbdbb7567029",
  measurementId: "G-7Y0TQ09FGT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only when supported (not available in React Native)
let analytics: ReturnType<typeof getAnalytics> | null = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export { app, analytics };
