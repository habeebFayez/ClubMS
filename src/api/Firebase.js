// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";




// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyArvdhaEJXfLJMm0UIZN_12Y5W9RwP8pEc",
    authDomain: "cmsystem-f147d.firebaseapp.com",
    projectId: "cmsystem-f147d",
    storageBucket: "cmsystem-f147d.appspot.com",
    messagingSenderId: "894581001420",
    appId: "1:894581001420:web:ee2fc688f975bca17c0669",
    measurementId: "G-0Z12ZPGWW4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db =getStorage(app);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);