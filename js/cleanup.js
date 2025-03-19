// Script di pulizia cache
console.log("Iniziando pulizia cache...");

// Pulisci localStorage
localStorage.clear();
console.log("LocalStorage pulito");

// Pulisci sessionStorage
sessionStorage.clear();
console.log("SessionStorage pulito");

// Pulisci indexedDB di Firebase
const clearFirestoreCache = async () => {
  try {
    const dbName = 'firestore/ediplan-ore-lavoro/registrazioniOre';
    const request = window.indexedDB.deleteDatabase(dbName);
    
    request.onsuccess = function() {
      console.log(`Database ${dbName} cancellato con successo`);
    };
    
    request.onerror = function() {
      console.log(`Impossibile cancellare database ${dbName}`);
    };
    
    // Prova anche con il nome generico
    const request2 = window.indexedDB.deleteDatabase('firestore');
    
    request2.onsuccess = function() {
      console.log('Database firestore cancellato con successo');
    };
    
    request2.onerror = function() {
      console.log('Impossibile cancellare database firestore');
    };
    
  } catch (e) {
    console.error("Errore durante la pulizia della cache:", e);
  }
  
  console.log("Pulizia cache completata. Ricaricare la pagina.");
  alert("Cache pulita. La pagina verrà ricaricata.");
  location.reload(true);
};

clearFirestoreCache();