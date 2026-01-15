UnderstandYourPartner App - Specifica Funzionale Completa
1. OBIETTIVO GENERALE
Creare un'applicazione web che permetta agli utenti di:

Completare un test psicologico di 28 domande
Ricevere un'anteprima dei risultati (teaser gratuito)
Acquistare il report completo
Accedere al report dettagliato post-acquisto
(Opzionale) Ritornare in futuro per rileggere il report


Nota bene: l'applicazione e le domande devono essere in lingua inglese.

2. FLUSSI UTENTE PRINCIPALI
FLUSSO A: Utente Nuovo da Meta Ads (Principale)
1. Landing su app → Micro-intro (opzionale)
2. Inizio test (domanda 1/28)
3. Compilazione progressiva (salvataggio automatico)
4. Completamento test
5. Processing screen (3-5 secondi)
6. Teaser risultati (gratuito)
7. Paywall
8. Pagamento (Stripe)
9. Report completo
10. (Opzionale) Registrazione account per accesso futuro
FLUSSO B: Utente che Abbandona e Ritorna
1. Landing su app
2. Riconoscimento automatico (cookie/localStorage)
3. "Hai un test in corso a domanda X/28 - Continua da dove eri rimasto"
4. Prosegue dal punto 2 del Flusso A
FLUSSO C: Utente Registrato che Torna
1. Login
2. Dashboard personale
3. Accesso a report già acquistato
4. (Futuro) Possibilità di rifare il test

3. PAGINE E SCHERMATE DETTAGLIATE
3.1 MICRO-INTRO (Opzionale - Screen Singolo)
Quando appare: Solo al primo accesso, prima del test
Contenuto:

Titolo: "Test UnderstandYourPartner"
Sottotitolo: "28 domande | ~10 minuti"
Testo: "Rispondi istintivamente. Non ci sono risposte giuste o sbagliate."
CTA primario: "INIZIA IL TEST"
Note legali minime: link a Privacy Policy e Terms

Comportamento:

Scompare automaticamente dopo 5 secondi O
Click su "INIZIA IL TEST"
Non riappare mai per lo stesso utente (cookie)

Design:

Minimal, rassicurante
Mobile-first (bottone grande, tappabile)
Nessuna distrazione


3.2 INTERFACCIA TEST (Core Experience)
Layout Fisso:
┌─────────────────────────────────────┐
│ [Logo]              Domanda 12/28   │ ← Header sticky
│ ━━━━━━━━━━━━━░░░░░░░░░░░░░░░░░░    │ ← Progress bar
├─────────────────────────────────────┤
│                                     │
│  Testo della domanda qui            │
│  (ben spaziato, leggibile)          │
│                                     │
│  ⚪ Fortemente in disaccordo        │
│  ⚪ In disaccordo                   │
│  ⚪ Né d'accordo né in disaccordo   │
│  ⚪ D'accordo                        │
│  ⚪ Fortemente d'accordo            │
│                                     │
│                                     │
│           [AVANTI →]                │ ← Attivo solo dopo selezione
│                                     │
└─────────────────────────────────────┘
Comportamenti:

Navigazione:

Impossibile procedere senza rispondere
Bottone "AVANTI" disabilitato fino a selezione
NO bottone "INDIETRO" (per evitare overthinking)
Salvataggio automatico ad ogni risposta


Progress Bar:

Visual chiaro: X/28 domande
Percentuale completamento visibile
Colore che si riempie progressivamente


Domande:

Una domanda per schermata
Testo grande, leggibile (mobile-first)
Radio buttons grandi e tappabili
Spazio per respiro visivo


Persistenza:

Ogni risposta salvata immediatamente
Se utente abbandona e torna: riprende da dove era
Identificazione: cookie + (opzionale) email se fornita


Mobile Experience:

Radio buttons touch-friendly (min 48px tap target)
Scroll minimizzato (tutto above-the-fold se possibile)
Transizioni fluide tra domande




3.3 PROCESSING SCREEN
Quando appare: Subito dopo domanda 28/28
Contenuto:
┌─────────────────────────────────────┐
│                                     │
│         [Animazione spinner]        │
│                                     │
│     Stiamo analizzando le tue       │
│          risposte...                │
│                                     │
│  ⏱️ Calcoliamo i tuoi pattern       │
│     interpretativi                  │
│                                     │
└─────────────────────────────────────┘
Durata: 3-5 secondi (artificiale, per aumentare perceived value)
Comportamento:

Nessun bottone cliccabile
Reindirizzamento automatico a Teaser Results
Calcolo effettivo degli score in background


3.4 TEASER RESULTS (Gratuito - Paywall Gate)
Obiettivo: Mostrare abbastanza valore da far desiderare il resto, ma non abbastanza da essere completo
Contenuto Visibile (Free):
┌─────────────────────────────────────┐
│  I Tuoi Risultati                   │
├─────────────────────────────────────┤
│                                     │
│  📊 MISMATCH SCORES                 │
│                                     │
│  Silenzio & Distanza:     🔴 ALTO   │
│  Conflitto & Tensione:    🟡 MEDIO  │
│  Attribuzione Intenzionale: 🟢 BASSO│
│  Bisogno di Rassicurazione: 🔴 ALTO │
│  Riparazione & Chiusura:  🟡 MEDIO  │
│                                     │
│  ⚠️ Hai 3 aree ad alto rischio      │
│     di fraintendimento              │
│                                     │
│  [Grafici base - barre colorate]    │
│                                     │
├─────────────────────────────────────┤
│  🔒 BLOCCATO                        │
│                                     │
│  Sblocca il report completo per     │
│  scoprire:                          │
│                                     │
│  ✓ Quali pattern interpretativi     │
│    dominano la tua relazione        │
│  ✓ Dove leggi bene il tuo partner   │
│  ✓ Dove probabilmente fraintendi    │
│  ✓ I loop ricorrenti che si ripetono│
│  ✓ 3 azioni pratiche personalizzate │
│  ✓ (Opzionale) AI Commentary        │
│                                     │
│  [SBLOCCA REPORT - €9.99] ←         │
│                                     │
│  💳 Pagamento sicuro con Stripe     │
│  📧 Report inviato via email        │
│                                     │
└─────────────────────────────────────┘
Elementi Chiave:

Mismatch Scores Visibili:

I 5 punteggi dimensionali (colori: rosso/giallo/verde)
NO spiegazione di cosa significano (quella è paywall)
Solo labels + intensità


Teaser Statement:

"Hai X aree ad alto rischio"
Crea curiosity gap senza rivelare il cosa


Lista Valore Report:

Cosa sbloccheranno pagando
Focalizzata su benefit concreti
Enfasi su personalizzazione


Social Proof (Opzionale):

"1.247 persone hanno già sbloccato il loro report"
Rating stelle (se hai reviews)


Garanzia (Opzionale):

"Rimborso entro 7 giorni se non soddisfatto"



CTA Design:

Bottone grande, contrastato
Prezzo chiaro (no hidden fees)
Rassicurazioni Stripe (sicurezza)


3.5 CHECKOUT (Stripe Integration)
Flusso:
Teaser Page → Click "SBLOCCA" → Stripe Checkout → Redirect Success
Cosa Serve:

Pre-Checkout:

(Opzionale) Raccolta email se non già fornita
"Riceverai il report a questo indirizzo: xxx@xxx.com"


Stripe Checkout:

Modal/redirect a Stripe Checkout standard
Prodotto: "UnderstandYourPartner - Report Completo"
Prezzo: €9.99 (o variabile per A/B test)
Payment methods: Card, Google Pay, Apple Pay


Success URL:

Redirect a: app.understandyourpartner.com/report?session_id=xxx
Verifica pagamento lato server
Unlock contenuto


Cancel URL:

Ritorno a Teaser Page
(Opzionale) Banner: "Hai cambiato idea? Il tuo report ti aspetta"




3.6 REPORT COMPLETO (Post-Pagamento)
Accesso: Solo dopo pagamento verificato
Contenuto Strutturato:
SEZIONE 1: Header & Summary
┌─────────────────────────────────────┐
│  Il Tuo Report Personale            │
│  UnderstandYourPartner              │
├─────────────────────────────────────┤
│                                     │
│  📊 I tuoi 5 Mismatch Scores        │
│  [Grafici dettagliati - radar chart]│
│                                     │
│  La tua lente interpretativa        │
│  dominante:                         │
│                                     │
│  🔍 "Lettore di Segnali Emotivi"    │
│                                     │
│  Tendi a cercare conferme emotive   │
│  esplicite e interpreti il silenzio │
│  come distanza.                     │
│                                     │
└─────────────────────────────────────┘
SEZIONE 2: Dimensioni Dettagliate
Per ogni dimensione (5 totali):
┌─────────────────────────────────────┐
│  SILENZIO & DISTANZA                │
├─────────────────────────────────────┤
│                                     │
│  Come percepisci il partner (PM): 72│
│  Come reagisci tu (SL): 88          │
│  📍 Mismatch: ALTO (16 punti)       │
│                                     │
│  Cosa significa:                    │
│                                     │
│  Quando il tuo partner è silenzioso,│
│  tu tendi a interpretarlo come      │
│  distacco emotivo, mentre lui/lei   │
│  probabilmente sta solo processando.│
│                                     │
│  Il tuo bisogno di connessione      │
│  costante è alto (SL 88), ma        │
│  percepisci il partner come meno    │
│  espressivo (PM 72).                │
│                                     │
│  Questo gap crea tensione ricorrente│
│  quando:                            │
│  • Dopo un litigio il partner       │
│    si ritira in silenzio            │
│  • Chiedi "tutto ok?" e dice "sì"   │
│    ma tu non ci credi               │
│                                     │
└─────────────────────────────────────┘
Ripeti per tutte e 5 le dimensioni.
SEZIONE 3: Dove Leggi Bene
┌─────────────────────────────────────┐
│  ✅ AREE DI ALLINEAMENTO            │
├─────────────────────────────────────┤
│                                     │
│  Riparazione & Chiusura             │
│  Mismatch: Basso (3 punti)          │
│                                     │
│  In questa area siete allineati.    │
│  Entrambi date importanza simile    │
│  alla chiusura emotiva dopo un      │
│  conflitto.                         │
│                                     │
│  Questo è un punto di forza della   │
│  vostra relazione.                  │
│                                     │
└─────────────────────────────────────┘
SEZIONE 4: Rischi di Fraintendimento
┌─────────────────────────────────────┐
│  ⚠️ PATTERN DI FRAINTENDIMENTO      │
├─────────────────────────────────────┤
│                                     │
│  1. "IL SILENZIO COME PUNIZIONE"    │
│                                     │
│  Cosa vedi:                         │
│  Il partner si chiude dopo un       │
│  conflitto e tu interpreti come     │
│  rifiuto intenzionale.              │
│                                     │
│  Cosa probabilmente è:              │
│  Bisogno di tempo per processare.   │
│                                     │
│  Perché continua:                   │
│  Tu cerchi riconnessione immediata, │
│  lui/lei ha bisogno di spazio.      │
│  Il gap crea escalation.            │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  2. "ATTRIBUZIONE DI INTENTO"       │
│  [...]                              │
│                                     │
└─────────────────────────────────────┘
SEZIONE 5: 3 Azioni Pratiche
┌─────────────────────────────────────┐
│  🎯 COSA PUOI FARE                  │
├─────────────────────────────────────┤
│                                     │
│  1. OSSERVA                         │
│  Quando il tuo partner è silenzioso,│
│  chiediti: "Sto interpretando questo│
│  come rifiuto o è solo il suo modo  │
│  di processare?"                    │
│                                     │
│  2. COMUNICA                        │
│  Prova: "Ho bisogno di sapere che   │
│  va tutto bene quando sei silenzioso│
│  - possiamo trovare un segnale?"    │
│                                     │
│  3. REGOLA                          │
│  Quando senti l'impulso di cercare  │
│  rassicurazione, aspetta 10 minuti. │
│  Spesso l'urgenza diminuisce.       │
│                                     │
└─────────────────────────────────────┘
SEZIONE 6: AI Commentary (Opzionale)
┌─────────────────────────────────────┐
│  💬 RIFLESSIONE GUIDATA (AI)        │
├─────────────────────────────────────┤
│                                     │
│  Dalle tue risposte emerge un tema  │
│  ricorrente: cerchi conferme        │
│  esplicite in una relazione dove il │
│  partner comunica implicitamente.   │
│                                     │
│  Questo non significa che uno dei   │
│  due abbia torto - significa che    │
│  parlate lingue emotive diverse.    │
│                                     │
│  Domanda per te:                    │
│  Cosa succederebbe se iniziassi a   │
│  fidarti del "non detto" per una    │
│  settimana?                         │
│                                     │
└─────────────────────────────────────┘
Features UX Report:

Stampabile/Salvabile:

Bottone "Scarica PDF"
Design print-friendly


Condivisibile:

(Opzionale) "Condividi con il partner" → genera link anonimo


Navigazione Interna:

Indice cliccabile per saltare a sezioni
Scroll progressivo fluido


Re-leggibilità:

Salvato permanentemente nell'account
Accessibile in futuro da dashboard




3.7 DASHBOARD UTENTE (Post-Acquisto)
Quando appare: Dopo primo accesso/registrazione post-acquisto
Layout:
┌─────────────────────────────────────┐
│  [Logo] Dashboard    [Logout]       │
├─────────────────────────────────────┤
│                                     │
│  Benvenuto, [Nome/Email]            │
│                                     │
│  📄 I TUOI REPORT                   │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Report #1                     │ │
│  │ Completato: 15 Gen 2025       │ │
│  │ [VISUALIZZA]                  │ │
│  └───────────────────────────────┘ │
│                                     │
│  (Futuro: possibilità di rifare    │
│   test dopo 6 mesi)                 │
│                                     │
└─────────────────────────────────────┘

4. STATI UTENTE E PERSISTENZA
4.1 Utente Anonimo (Non Registrato)
Identificazione: Cookie/localStorage
Può:

Iniziare test
Completare test
Vedere teaser
Acquistare report
Vedere report (sessione corrente)

Non Può:

Riaccedere al report dopo chiusura browser (senza registrazione)

Prompt Registrazione:
Dopo acquisto → "Crea un account per accedere sempre al tuo report"
4.2 Utente Registrato
Identificazione: Email + Password (o Magic Link)
Può:

Tutto quanto utente anonimo
Riaccedere al report in futuro
(Futuro) Rifare test dopo X mesi
(Futuro) Confrontare risultati nel tempo

4.3 Salvataggio Progressivo Test
Dati Salvati ad Ogni Risposta:

ID sessione (cookie/userId)
Domanda corrente (1-28)
Risposte date (array)
Timestamp ultimo aggiornamento

Recovery:

Se utente torna: if (savedTest.exists) → "Continua da domanda X"
Se utente ripulisce cookies: test perse (accettabile per MVP)


5. GESTIONE EMAIL
5.1 Email Richieste
Quando:

(Opzionale) Durante test: "Vuoi salvare i progressi? Lascia la tua email"
Obbligatorio pre-checkout: "Dove invio il report?"

5.2 Email Inviate
1. Conferma Acquisto + Report:
Oggetto: Il tuo Report UnderstandYourPartner è pronto

Ciao,

Grazie per aver completato il test UnderstandYourPartner.

Il tuo report personalizzato è pronto:
[VISUALIZZA REPORT] ← Link diretto

Puoi anche accedere in qualsiasi momento da:
app.understandyourpartner.com/login

---

Hai domande? Rispondi a questa email.

UnderstandYourPartner Team
2. Recovery Abbandono (se email fornita):
Oggetto: Hai lasciato il test a metà

Ciao,

Abbiamo notato che hai iniziato il test UnderstandYourPartner
ma non l'hai completato.

I tuoi progressi sono salvati. Bastano altri 5 minuti.

[COMPLETA IL TEST] ← Link diretto a domanda corrente

Alla prossima,
UnderstandYourPartner

6. PRICING & VARIANTI (A/B Test Ready)
6.1 Opzioni Pricing
Opzione A - Single Price:

€9.99 → Report completo

Opzione B - Tiered:

€4.99 → Report base (no AI commentary)
€9.99 → Report completo + AI

Opzione C - Launch Discount:

€14.99 €7.99 → "Primi 500 utenti"

6.2 Upsell Futuro (Non MVP)

€19.99 → Report + 30min consulenza video
€2.99/mese → Accesso a tutti i test futuri + tracking progressi


7. ANALYTICS & TRACKING ESSENZIALI
7.1 Eventi da Tracciare
Test Flow:

test_started
test_question_answered (quale domanda, tempo impiegato)
test_abandoned (a quale domanda)
test_completed

Paywall:

teaser_viewed
checkout_initiated
payment_completed
payment_failed

Report:

report_viewed
report_downloaded_pdf (se implementato)

7.2 Metriche Chiave

Completion Rate: % chi completa 28/28 domande
Paywall Conversion: % chi paga dopo teaser
Avg Time per Question: ottimizzazione UX
Abandonment Points: quali domande causano abbandoni


8. CONTENUTI TESTO DA PREPARARE
8.1 Le 28 Domande
Formato richiesto per ogni domanda:
{
  id: 1,
  text: "Quando il mio partner è silenzioso, penso che sia arrabbiato/a con me",
  dimension: "silence_distance",
  type: "PM", // o "SL"
  scale: likert_5
}
Nota: Servono le 28 domande finalizzate PRIMA dello sviluppo.
8.2 Testi Dimensioni
Per ogni dimensione:

Titolo (es: "Silenzio & Distanza")
Descrizione PM (100 parole)
Descrizione SL (100 parole)
Descrizione Mismatch Alto/Medio/Basso (50 parole ciascuno)

8.3 Pattern di Fraintendimento

5-7 pattern ricorrenti predefiniti
Titolo + spiegazione (200 parole max)
Trigger conditions (quando appare nel report)

8.4 Azioni Pratiche

Pool di 15-20 azioni pratiche
Categorizzate per dimensione
Algoritmo seleziona le 3 più rilevanti in base a scores


9. REQUISITI NON FUNZIONALI
9.1 Performance

Load Time: < 2s per qualsiasi pagina
Test Transitions: < 300ms tra domande
Mobile-First: 100% usabile su smartphone

9.2 Sicurezza

HTTPS ovunque
Stripe PCI-compliant
Dati test criptati a riposo
No storage dati sensibili in localStorage (solo session ID)

9.3 Privacy

Cookie consent (GDPR)
Privacy Policy chiara
Possibilità cancellazione account
No vendita dati terzi

9.4 Compatibilità

Browser: Chrome, Safari, Firefox (ultime 2 versioni)
Mobile: iOS Safari, Chrome Android
No requirement IE


10. EDGE CASES & GESTIONE ERRORI
10.1 Utente Paga ma Non Vede Report
Cause:

Stripe webhook fallito
Browser crashed post-payment

Soluzione:

Email automatica con link diretto al report
Link contiene token verifica pagamento
Supporto via email

10.2 Utente Abbandona a Domanda 27/28
Azione:

Email recovery dopo 2 ore
Retargeting Meta ad (pixel custom event)

10.3 Payment Failure
Messaggi:

"Pagamento non riuscito. Riprova o usa un altro metodo"
Possibilità re-try immediato
Link supporto

10.4 Bug nel Calcolo Score
Prevenzione:

Unit tests su logica scoring
Validazione input lato server

Fallback:

Se calcolo fallisce → email team + rimborso automatico
Mai mostrare report con dati errati