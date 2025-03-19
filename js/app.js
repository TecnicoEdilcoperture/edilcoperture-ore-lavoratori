// Elementi DOM
const loginSection = document.getElementById('loginSection');
const appSection = document.getElementById('appSection');
const loginForm = document.getElementById('loginForm');
const operaioSelect = document.getElementById('operaioSelect');
const pinCode = document.getElementById('pinCode');
const userButton = document.getElementById('userButton');
const userName = document.getElementById('userName');
const registraOreForm = document.getElementById('registraOreForm');
const dataLavoro = document.getElementById('dataLavoro');
const cantiereSelect = document.getElementById('cantiereSelect');
const oreLavorate = document.getElementById('oreLavorate');
const straordinario = document.getElementById('straordinario');
const note = document.getElementById('note');
const riepilogoBody = document.getElementById('riepilogoBody');
const totaleOre = document.getElementById('totaleOre');
const totaleStraordinario = document.getElementById('totaleStraordinario');
const logoutButton = document.getElementById('logoutButton');
const refreshButton = document.getElementById('refreshButton');
const offlineBanner = document.getElementById('offlineBanner');
const oreStrada = document.getElementById('oreStrada');

// Configurazione dati
let operai = [];
let cantieri = [];

// Utente corrente
let currentUser = null;

// Stato connessione
let isOnline = navigator.onLine;

// Alla carica della pagina
document.addEventListener('DOMContentLoaded', function() {
    // Carica dati iniziali
    Promise.all([
        fetchOperai(),
        fetchCantieri()
    ]).then(() => {
        // Imposta la data di oggi
        const oggi = new Date();
        dataLavoro.valueAsDate = oggi;
        
        // Gestisci login
        loginForm.addEventListener('submit', handleLogin);
        
        // Gestisci registrazione ore
        registraOreForm.addEventListener('submit', handleRegistraOre);
        
        // Gestisci logout
        logoutButton.addEventListener('click', handleLogout);
        
        // Gestisci aggiornamento riepilogo
        refreshButton.addEventListener('click', caricaRiepilogo);
        
        // Controlla lo stato online/offline
        checkOnlineStatus();
        window.addEventListener('online', checkOnlineStatus);
        window.addEventListener('offline', checkOnlineStatus);
        
        // Controlla se l'utente è già loggato
        const savedUserId = localStorage.getItem('currentUserId');
        if (savedUserId) {
            const user = operai.find(op => op.id == savedUserId);
            if (user) {
                doLogin(user);
            }
        }
    }).catch(error => {
        console.error('Errore nel caricamento dei dati iniziali:', error);
        alert('Impossibile caricare i dati. Controlla la connessione e riprova.');
    });
});

// Gestisce il login
function handleLogin(e) {
    e.preventDefault();
    
    const userId = operaioSelect.value;
    const pin = pinCode.value;
    
    if (!userId || !pin) {
        alert('Seleziona un operaio e inserisci il PIN');
        return;
    }
    
    const operaio = operai.find(op => op.id == userId);
    
    if (!operaio) {
        alert('Operaio non trovato');
        return;
    }
    
    if (operaio.pin !== pin) {
        alert('PIN non valido');
        return;
    }
    
    doLogin(operaio);
}

// Effettua il login
function doLogin(operaio) {
    currentUser = operaio;
    localStorage.setItem('currentUserId', operaio.id);
    
    // Aggiorna UI
    userName.textContent = operaio.nome;
    userButton.classList.remove('d-none');
    loginSection.classList.add('d-none');
    appSection.classList.remove('d-none');
    
    // Carica riepilogo locale
    caricaRiepilogo();
    
    // Se online, carica dati da Firebase
    if (isOnline) {
        caricaDatiDaFirebase();
    }
}

// Gestisce la registrazione delle ore
// Gestisce la registrazione delle ore
function handleRegistraOre(e) {
    e.preventDefault();
    
    if (!currentUser) {
        alert(getMessage('notLoggedIn'));
        return;
    }
    
    const nuovaRegistrazione = {
        operaioId: currentUser.id,
        operaioNome: currentUser.nome,
        data: dataLavoro.value,
        cantiereId: parseInt(cantiereSelect.value),
        cantiereName: cantieri.find(c => c.id == cantiereSelect.value)?.nome || '',
        ore: parseFloat(oreLavorate.value),
        oreStrada: parseFloat(oreStrada.value) || 0,
        straordinario: parseFloat(straordinario.value) || 0,
        note: note.value,
        timestamp: new Date().toISOString()
    };
    
    // Salva localmente
    let registrazioni = JSON.parse(localStorage.getItem('registrazioniOre') || '[]');
    registrazioni.push(nuovaRegistrazione);
    localStorage.setItem('registrazioniOre', JSON.stringify(registrazioni));
    
    // Aggiorna riepilogo
    caricaRiepilogo();
    
    // Invia al server se online
    if (isOnline) {
        sincronizzaDati();
    }
    
    // Resetta form
    registraOreForm.reset();
    dataLavoro.valueAsDate = new Date();
    
    alert(getMessage('hoursRegisteredSuccess'));
}

// Carica riepilogo settimanale
function caricaRiepilogo() {
    if (!currentUser) return;
    
    let registrazioni = JSON.parse(localStorage.getItem('registrazioniOre') || '[]');
    
    // Filtra per operaio corrente
    registrazioni = registrazioni.filter(r => r.operaioId == currentUser.id);
    
    // Ordina per data (più recenti prima)
    registrazioni.sort((a, b) => new Date(b.data) - new Date(a.data));
    
    // Limita alle ultime 7 registrazioni
    registrazioni = registrazioni.slice(0, 7);
    
    // Aggiorna tabella
    riepilogoBody.innerHTML = '';
    
    let totOre = 0;
    let totOreStrada = 0;
    let totStraordinario = 0;
    
    if (registrazioni.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="5" class="text-center">${getMessage('noRecentRegistrations')}</td>`;
        riepilogoBody.appendChild(tr);
    } else {
        registrazioni.forEach(reg => {
            const tr = document.createElement('tr');
            
            // Formatta data
            const dataParts = reg.data.split('-');
            const dataFormattata = `${dataParts[2]}/${dataParts[1]}/${dataParts[0]}`;
            
            tr.innerHTML = `
                <td>${dataFormattata}</td>
                <td>${reg.cantiereName}</td>
                <td>${reg.ore}</td>
                <td>${reg.oreStrada || 0}</td>
                <td>${reg.straordinario || 0}</td>
            `;
            
            riepilogoBody.appendChild(tr);
            
            totOre += parseFloat(reg.ore) || 0;
            totOreStrada += parseFloat(reg.oreStrada) || 0;
            totStraordinario += parseFloat(reg.straordinario) || 0;
        });
    }
    
    // Aggiorna totali
    totaleOre.textContent = totOre.toFixed(1);
    document.getElementById('totaleOreStrada').textContent = totOreStrada.toFixed(1);
    totaleStraordinario.textContent = totStraordinario.toFixed(1);
}

// Gestisce il logout
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUserId');
    
    // Aggiorna UI
    userButton.classList.add('d-none');
    appSection.classList.add('d-none');
    loginSection.classList.remove('d-none');
    
    // Resetta form
    loginForm.reset();
    registraOreForm.reset();
    dataLavoro.valueAsDate = new Date();
}

// Controlla stato connessione
function checkOnlineStatus() {
    isOnline = navigator.onLine;
    
    if (isOnline) {
        offlineBanner.classList.add('d-none');
        sincronizzaDati();
    } else {
        offlineBanner.classList.remove('d-none');
    }
}


// Sincronizza dati con Firebase
function sincronizzaDati() {
    if (!isOnline) return;
    
    console.log('Sincronizzazione dati con Firebase...');
    
    // Rimuovi qualsiasi toast di sincronizzazione esistente
    const existingToasts = document.querySelectorAll('.sync-toast');
    existingToasts.forEach(toast => toast.remove());
    
    // Crea un nuovo toast per la sincronizzazione
    const toastContainer = document.createElement('div');
    toastContainer.className = 'position-fixed top-0 end-0 p-3 sync-toast';
    toastContainer.style.zIndex = '9999';
    
    toastContainer.innerHTML = `
        <div class="toast show" role="alert">
            <div class="toast-header bg-primary text-white">
                <strong class="me-auto">Sincronizzazione</strong>
            </div>
            <div class="toast-body">
                <div class="d-flex align-items-center">
                    <div class="spinner-border spinner-border-sm text-primary me-2"></div>
                    <span>Sincronizzazione dati in corso...</span>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(toastContainer);
    
    let registrazioni = JSON.parse(localStorage.getItem('registrazioniOre') || '[]');
    const registrazioniDaSincronizzare = registrazioni.filter(reg => !reg.sincronizzato);
    
    if (registrazioniDaSincronizzare.length === 0) {
        // Aggiorna il toast per indicare il successo
        toastContainer.innerHTML = `
            <div class="toast show" role="alert">
                <div class="toast-header bg-success text-white">
                    <strong class="me-auto">Sincronizzazione</strong>
                </div>
                <div class="toast-body">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-check-circle text-success me-2"></i>
                        <span>Tutti i dati sono sincronizzati</span>
                    </div>
                </div>
            </div>
        `;
        
        // Rimuovi il toast dopo 2 secondi
        setTimeout(() => {
            toastContainer.remove();
        }, 2000);
        
        return;
    }
    
    // Gestione degli errori per assicurarsi che il toast venga rimosso in ogni caso
    try {
        // Esegui sincronizzazione e gestisci promesse
        Promise.all(registrazioniDaSincronizzare.map(reg => {
            return db.collection('registrazioniOre').add({
                operaioId: reg.operaioId,
                operaioNome: reg.operaioNome,
                data: reg.data,
                cantiereId: reg.cantiereId,
                cantiereName: reg.cantiereName,
                ore: reg.ore,
                oreStrada: reg.oreStrada || 0,
                straordinario: reg.straordinario || 0,
                note: reg.note,
                timestamp: reg.timestamp,
                sincronizzatoIl: firebase.firestore.FieldValue.serverTimestamp()
            }).catch(e => {
                console.error("Errore nella sincronizzazione:", e);
                return null; // Restituisci null invece di far fallire la Promise.all
            });
        }))
        .then(results => {
            // Conta i risultati di successo (non null)
            const successCount = results.filter(r => r !== null).length;
            
            // Aggiorna stato sincronizzazione
            if (successCount > 0) {
                registrazioni.forEach(reg => {
                    if (registrazioniDaSincronizzare.some(r => r.timestamp === reg.timestamp)) {
                        reg.sincronizzato = true;
                    }
                });
                localStorage.setItem('registrazioniOre', JSON.stringify(registrazioni));
            }
            
            // Aggiorna toast
            toastContainer.innerHTML = `
                <div class="toast show" role="alert">
                    <div class="toast-header bg-${successCount === registrazioniDaSincronizzare.length ? 'success' : 'warning'} text-white">
                        <strong class="me-auto">Sincronizzazione</strong>
                    </div>
                    <div class="toast-body">
                        <div class="d-flex align-items-center">
                            <i class="fas fa-${successCount === registrazioniDaSincronizzare.length ? 'check-circle text-success' : 'exclamation-triangle text-warning'} me-2"></i>
                            <span>${successCount === registrazioniDaSincronizzare.length ? 'Sincronizzazione completata' : `Sincronizzati ${successCount}/${registrazioniDaSincronizzare.length} record`}</span>
                        </div>
                    </div>
                </div>
            `;
            
            setTimeout(() => toastContainer.remove(), 3000);
        })
        .catch(error => {
            console.error('Errore generale nella sincronizzazione:', error);
            toastContainer.innerHTML = `
                <div class="toast show" role="alert">
                    <div class="toast-header bg-danger text-white">
                        <strong class="me-auto">Sincronizzazione</strong>
                    </div>
                    <div class="toast-body">
                        <div class="d-flex align-items-center">
                            <i class="fas fa-times-circle text-danger me-2"></i>
                            <span>Errore nella sincronizzazione</span>
                        </div>
                    </div>
                </div>
            `;
            setTimeout(() => toastContainer.remove(), 3000);
        });
    } catch (e) {
        // Gestisce errori generali e garantisce la rimozione del toast
        console.error('Errore critico nella sincronizzazione:', e);
        toastContainer.innerHTML = `
            <div class="toast show" role="alert">
                <div class="toast-header bg-danger text-white">
                    <strong class="me-auto">Sincronizzazione</strong>
                </div>
                <div class="toast-body">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-exclamation-circle text-danger me-2"></i>
                        <span>Errore critico nella sincronizzazione</span>
                    </div>
                </div>
            </div>
        `;
        setTimeout(() => toastContainer.remove(), 3000);
    }
}

// Carica dati da Firebase
function caricaDatiDaFirebase() {
    if (!isOnline || !currentUser) return;
    
    console.log('Caricamento dati da Firebase...');
    
    db.collection('registrazioniOre')
        .where('operaioId', '==', currentUser.id)
        .orderBy('data', 'desc')
        .limit(30)  // Ultimi 30 giorni
        .get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('Nessun dato trovato su Firebase');
                return;
            }
            
            let registrazioni = JSON.parse(localStorage.getItem('registrazioniOre') || '[]');
            let nuoveRegistrazioni = false;
            
            snapshot.forEach(doc => {
                const datiServer = doc.data();
                
                // Controlla se questa registrazione è già presente in locale
                const esisteLocalmente = registrazioni.some(reg => 
                    reg.operaioId === datiServer.operaioId && 
                    reg.data === datiServer.data && 
                    reg.timestamp === datiServer.timestamp);
                
                if (!esisteLocalmente) {
                    // Aggiungi i dati dal server alle registrazioni locali
                    registrazioni.push({
                        ...datiServer,
                        sincronizzato: true
                    });
                    nuoveRegistrazioni = true;
                }
            });
            
            if (nuoveRegistrazioni) {
                localStorage.setItem('registrazioniOre', JSON.stringify(registrazioni));
                caricaRiepilogo();
                
                // Notifica all'utente
                const toast = document.createElement('div');
                toast.className = 'position-fixed bottom-0 end-0 p-3';
                toast.style.zIndex = 11;
                toast.innerHTML = `
                    <div class="toast show" role="alert">
                        <div class="toast-header">
                            <strong class="me-auto">Aggiornamento</strong>
                            <button type="button" class="btn-close" onclick="this.parentElement.parentElement.parentElement.remove()"></button>
                        </div>
                        <div class="toast-body">
                            Nuove registrazioni caricate dal server.
                        </div>
                    </div>
                `;
                document.body.appendChild(toast);
                
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 5000);
            }
        })
        .catch(error => {
            console.error('Errore durante il caricamento dei dati da Firebase:', error);
        });
}

// Funzione per recuperare gli operai dal server
async function fetchOperai() {
    try {
        // Determina se siamo in locale o in produzione
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const serverUrl = isLocal ? 'http://localhost:3000' : 'https://api.edilcoperture.com'; // Aggiorna con il tuo dominio reale
        
        console.log("Fetching operai from:", isLocal ? "local server" : "production server");
        
        let response;
        
        if (isLocal) {
            // In locale, usa l'API del server
            response = await fetch(`${serverUrl}/api/esporta-operai`);
        } else {
            // In produzione, usa i dati di fallback direttamente
            throw new Error('Utilizzo dati di fallback');
        }
        
        const data = await response.json();
        
        if (data.success) {
            operai = data.operai;
            
            // Popola il select degli operai
            operaioSelect.innerHTML = '<option value="">Seleziona...</option>';
            operai.forEach(operaio => {
                const option = document.createElement('option');
                option.value = operaio.id;
                option.textContent = operaio.nome;
                operaioSelect.appendChild(option);
            });
            
            return true;
        } else {
            throw new Error('Errore nel recupero degli operai');
        }
    } catch (error) {
        console.error('Errore nel caricamento degli operai:', error);
        // Usa operai di fallback in caso di errore
        operai = [
            { id: 1, nome: "Mario Rossi", pin: "1234" },
            { id: 2, nome: "Giuseppe Verdi", pin: "5678" },
            { id: 3, nome: "Antonio Bianchi", pin: "9012" }
        ];
        
        // Popola il select con i dati di fallback
        operaioSelect.innerHTML = '<option value="">Seleziona...</option>';
        operai.forEach(operaio => {
            const option = document.createElement('option');
            option.value = operaio.id;
            option.textContent = operaio.nome;
            operaioSelect.appendChild(option);
        });
        
        return false;
    }
}

async function fetchCantieri() {
    try {
        // Determina se siamo in locale o in produzione
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const serverUrl = isLocal ? 'http://localhost:3000' : 'https://api.edilcoperture.com'; // Aggiorna con il tuo dominio reale
        
        console.log("Fetching cantieri from:", isLocal ? "local server" : "production server");
        
        let response;
        
        if (isLocal) {
            // In locale, usa l'API del server
            response = await fetch(`${serverUrl}/api/esporta-cantieri`);
        } else {
            // In produzione, usa i dati di fallback direttamente
            throw new Error('Utilizzo dati di fallback');
        }
        
        const data = await response.json();
        
        if (data.success) {
            cantieri = data.cantieri;
            
            // Popola il select dei cantieri
            cantiereSelect.innerHTML = '<option value="">Seleziona cantiere...</option>';
            cantieri.forEach(cantiere => {
                const option = document.createElement('option');
                option.value = cantiere.id;
                option.textContent = cantiere.nome;
                cantiereSelect.appendChild(option);
            });
        } else {
            throw new Error('Errore nel recupero dei cantieri');
        }
    } catch (error) {
        console.error('Errore nel caricamento dei cantieri:', error);
        // Usa cantieri di fallback in caso di errore
        cantieri = [
            { id: 1, nome: "Cantiere Via Roma 123" },
            { id: 2, nome: "Ristrutturazione Condominio Sole" },
            { id: 3, nome: "Edificio Nuovo Polo" },
            { id: 4, nome: "Villa Serena" }
        ];
        
        // Popola il select con i dati di fallback
        cantiereSelect.innerHTML = '<option value="">Seleziona cantiere...</option>';
        cantieri.forEach(cantiere => {
            const option = document.createElement('option');
            option.value = cantiere.id;
            option.textContent = cantiere.nome;
            cantiereSelect.appendChild(option);
        });
    }
}