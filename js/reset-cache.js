// Script di risoluzione problemi
console.log("Avvio procedura di reset della cache e dei dati locali...");

function resetApp() {
    // 1. Pulisci localStorage
    localStorage.clear();
    console.log("✅ LocalStorage pulito");

    // 2. Pulisci sessionStorage
    sessionStorage.clear();
    console.log("✅ SessionStorage pulito");

    // 3. Pulisci cache delle richieste
    if ('caches' in window) {
        caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => {
                caches.delete(cacheName)
                    .then(() => console.log(`✅ Cache ${cacheName} eliminata`))
                    .catch(err => console.error(`❌ Errore nell'eliminazione della cache ${cacheName}:`, err));
            });
        });
    }

    // 4. Pulisci IndexedDB
    const dbNames = ['firestore/ediplan-ore-lavoro', 'firestore'];
    dbNames.forEach(dbName => {
        try {
            const request = indexedDB.deleteDatabase(dbName);
            
            request.onsuccess = () => console.log(`✅ Database IndexedDB ${dbName} eliminato`);
            request.onerror = () => console.error(`❌ Errore nell'eliminazione del database ${dbName}`);
        } catch (e) {
            console.error(`❌ Errore nell'accesso al database ${dbName}:`, e);
        }
    });

    // 5. Cancella registrazione Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            for (const registration of registrations) {
                registration.unregister();
                console.log('✅ Service Worker cancellato');
            }
        });
    }

    // 6. Attendi 2 secondi e poi ricarica
    setTimeout(() => {
        console.log("🔄 Ricaricamento della pagina...");
        alert("Reset completato! La pagina verrà ricaricata.");
        window.location.href = window.location.origin + window.location.pathname + "?reset=true";
    }, 2000);
}

// Esegui il reset
resetApp();