// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDmn4i_rPR01HFJdwZpKLKJsOX60iR4NM",
  authDomain: "edilcoperture-ore-lavoratori.firebaseapp.com",
  projectId: "edilcoperture-ore-lavoratori",
  storageBucket: "edilcoperture-ore-lavoratori.appspot.com",
  messagingSenderId: "106929196358",
  appId: "1:106929196358:web:b57d2f21e908b0a0f5a94c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();