// Service Worker registration - TEMPORANEAMENTE DISABILITATO PER DEBUGGING
console.log("⚠️ Service Worker temporaneamente disabilitato per debugging");

// Riattivare questo codice quando il problema di sincronizzazione è risolto
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}
*/

// Cancella eventuali Service Worker esistenti
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
        for (const registration of registrations) {
            registration.unregister();
            console.log('Service Worker disattivato');
        }
    });
}