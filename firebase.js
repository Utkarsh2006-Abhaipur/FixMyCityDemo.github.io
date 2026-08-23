import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDU1F5eJplYnQ7HrIBcxvK3jA3ZMECyq2w",
    authDomain: "civicissuereporter-2fa6d.firebaseapp.com",
    projectId: "civicissuereporter-2fa6d",
    storageBucket: "civicissuereporter-2fa6d.firebasestorage.app",
    messagingSenderId: "1008677836126",
    appId: "1:1008677836126:web:57b8e4b15322b7c17aabcf"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

export {
    app,
    db,
    auth
};