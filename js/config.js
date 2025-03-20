// Configurazione Firebase - VERSIONE CORRETTA
console.log("Inizializzazione Firebase...");

try {
    // Verifico se Firebase è già inizializzato
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
        console.log("Firebase inizializzato correttamente con projectId:", firebase.app().options.projectId);
    } else {
        // Usa l'app già inizializzata
        console.log("Firebase già inizializzato, uso l'istanza esistente");
    }

    // Configurazione aggiuntiva per migliorare la connettività
    const firestoreSettings = {
        cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
        experimentalForceLongPolling: true,
        ignoreUndefinedProperties: true
    };
    
    firebase.firestore().settings(firestoreSettings);
    console.log("Impostazioni Firestore configurate:", firestoreSettings);

    // Definisci db globalmente per un accesso più facile
    window.db = firebase.firestore();
    
    // Esegui un test di connessione
    window.db.collection('test').doc('connection').set({
        timestamp: new Date().toISOString(),
        test: true
    })
    .then(() => {
        console.log("✅ Test di connessione a Firestore completato con successo");
    })
    .catch(error => {
        console.error("❌ Test di connessione a Firestore fallito:", error);
    });

} catch (error) {
    console.error("Errore durante l'inizializzazione di Firebase:", error);
    alert("Si è verificato un errore nell'inizializzazione di Firebase. Controlla la console per i dettagli.");
}