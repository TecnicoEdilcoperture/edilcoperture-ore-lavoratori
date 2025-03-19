// Configurazione Firebase - VERSIONE DI EMERGENZA
if (firebase.apps.length === 0) {
  // Configurazione Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyCE_MXk6bFR2Z36rhbjjukS_6zvNC3SOaw",
    authDomain: "ediplan-ore-lavoro.firebaseapp.com",
    projectId: "ediplan-ore-lavoro",
    storageBucket: "ediplan-ore-lavoro.appspot.com",
    messagingSenderId: "700515290610",
    appId: "1:700515290610:web:6d6da414c787597842af6b",
    measurementId: "G-NGY003GTJV"
  };

  // Inizializza Firebase
  firebase.initializeApp(firebaseConfig);
} else {
  // Usa l'app già inizializzata
  firebase.app();
}

// Ottieni riferimento a Firestore
const db = firebase.firestore();

// Configurazione aggiuntiva per migliorare la connettività
firebase.firestore().settings({
  cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
  experimentalForceLongPolling: true
});

// Verifica che il projectId sia corretto
console.log("Firebase projectId in uso:", firebase.app().options.projectId);