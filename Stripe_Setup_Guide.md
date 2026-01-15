# Guida Configurazione Stripe (Test Mode)

Questa guida ti spiega come configurare Stripe per testare i pagamenti nell'applicazione UnderstandYourPartner.

## 1. Account Stripe e API Keys

1.  Vai su [dashboard.stripe.com](https://dashboard.stripe.com/register) e crea un account (o accedi).
2.  In alto a destra, disabilita il toggle **"Test mode"** (o abilitalo se è spento). Assicurati di essere in **Test Mode** (colore arancione).
3.  Vai su **Developers** > **API keys**.
4.  Copia i valori:
    *   **Publishable key** (inizia con `pk_test_...`) -> *Nota: Wasp gestisce questa parte spesso lato client, ma per ora ci serve lato server la Secret.*
    *   **Secret key** (inizia con `sk_test_...`).

## 2. Configurazione Variabili d'Ambiente

Apri il file `.env.server` nella cartella `app` del progetto e imposta:

```env
# Stripe Secret Key (dalla dashboard)
STRIPE_API_KEY=sk_test_...

# Stripe Webhook Secret (vedi sezione 3)
STRIPE_WEBHOOK_SECRET=whsec_...

# URL del Frontend (per i redirect dopo il pagamento)
WASP_WEB_CLIENT_URL=http://localhost:3000
```

## 3. Configurazione Webhook (Locale)

Per permettere a Stripe di comunicare con il tuo server locale (per sbloccare il report dopo il pagamento), devi usare la Stripe CLI o un servizio di tunneling.

### Metodo A: Stripe CLI (Consigliato)
1.  Scarica e installa [Stripe CLI](https://stripe.com/docs/stripe-cli).
2.  Login: `stripe login`
3.  Avvia l'ascolto dei webhook verso il tuo server locale:
    ```bash
    stripe listen --forward-to localhost:3001/stripe-webhook
    ```
4.  La CLI ti restituirà un **Webhook Signing Secret** che inizia con `whsec_...`.
5.  Copia questo valore e incollalo in `.env.server` alla voce `STRIPE_WEBHOOK_SECRET`.

### Metodo B: Dashboard (Solo se hai un URL pubblico)
Se usi ngrok o simili, puoi configurare l'endpoint `https://tuo-url-ngrok/stripe-webhook` direttamente nella Dashboard Stripe in Developers > Webhooks.

## 4. Testare il Pagamento

1.  Avvia l'app: `wasp start`.
2.  Completa il test e arriva alla pagina di pagamento.
3.  Clicca "Sblocca Ora".
4.  Inserisci i dati della carta di test Stripe:
    *   **Numero**: `4242 4242 4242 4242`
    *   **Scadenza**: Qualsiasi data futura (es. 12/30)
    *   **CVC**: Qualsiasi 3 cifre (es. 123)
    *   **ZIP**: Qualsiasi (es. 12345)
5.  Paga.
6.  Verifica che verrai reindirizzato alla pagina successo e che il report sia sbloccato.

## 5. Prodotti e Prezzi (Opzionale per ora)
Il codice attuale crea un "Price" al volo (`unit_amount: 999`).
Se in futuro vuoi gestire i prezzi da Stripe Dashboard:
1.  Crea un Prodotto su Stripe.
2.  Copia il `price_id`.
3.  Aggiorna il codice in `src/payment/operations.ts` per usare quel `price` invece di `price_data`.

---
**Nota Importante**: Non usare mai le chiavi `sk_live_...` durante lo sviluppo locale!
