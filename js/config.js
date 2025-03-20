// Configurazione Firebase semplificata
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

    // Inizializza Firebase se non è già inizializzato
    if (!firebase.apps || firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
    } 

    // Configurazione per migliorare la connettività
    firebase.firestore().settings({
        cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
        ignoreUndefinedProperties: true
    });

    // Definisci db globalmente
    window.db = firebase.firestore();
    
    console.log("Firebase inizializzato correttamente");

} catch (error) {
    console.error("Errore durante l'inizializzazione di Firebase:", error);
    // Non mostrare l'alert per evitare di bloccare l'interfaccia
    console.log("Continuazione dell'app in modalità offline");
}