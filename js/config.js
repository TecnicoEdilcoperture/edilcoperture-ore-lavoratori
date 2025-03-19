// Firebase configuration
const firebaseConfig = {
    apiKey: "inserisci-la-tua-api-key-reale",
    authDomain: "il-tuo-project-id.firebaseapp.com",
    projectId: "il-tuo-project-id",
    storageBucket: "il-tuo-project-id.appspot.com",
    messagingSenderId: "il-tuo-sender-id",
    appId: "il-tuo-app-id"
};
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();