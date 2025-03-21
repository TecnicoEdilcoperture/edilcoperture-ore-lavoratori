// config.js
console.log("Inizializzazione Firebase...");

try {
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

    // Verifica che Firebase sia disponibile
    if (typeof firebase === 'undefined') {
        console.error("Firebase SDK non è caricato. Verifica i tag script nel tuo HTML.");
        throw new Error("Firebase SDK non disponibile");
    }

    // Inizializza Firebase se non è già inizializzato
    if (!firebase.apps || firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
        console.log("Firebase inizializzato correttamente");
        
        // Configurazione per migliorare la connettività
        if (firebase.firestore) {
            firebase.firestore().settings({
                cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
                ignoreUndefinedProperties: true
            });
            
            // Definisci db globalmente
            window.db = firebase.firestore();
            console.log("Firestore configurato correttamente");
        } else {
            console.error("Firestore non disponibile");
        }
    } else {
        console.log("Firebase già inizializzato");
    }
} catch (error) {
    console.error("Errore durante l'inizializzazione di Firebase:", error);
    console.log("Continuazione dell'app in modalità offline");
}