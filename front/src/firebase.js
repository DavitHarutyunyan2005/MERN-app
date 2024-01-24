// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mernapp-d6b11.firebaseapp.com",
    projectId: "mernapp-d6b11",
    storageBucket: "mernapp-d6b11.appspot.com",
    messagingSenderId: "987201569393",
    appId: "1:987201569393:web:78210e49f74e639768d1d0"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);