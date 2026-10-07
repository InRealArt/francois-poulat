# Paiement Stripe — Acompte sur ReservationModal

> Design validé le 2026-08-28 · Mis à jour le 2026-10-07
> Statut : **implémenté et testé en mode test** (2026-10-07), non commité

## Objectif

Brancher l'action « réserver » des formats à prix fixe (`src/components/sections/Formats.tsx` → `ReservationModal.tsx`, 6 formats) sur un vrai paiement Stripe.
`CustomOrderModal` (sur-mesure) reste en email uniquement — pas de Stripe.

## Décisions verrouillées

- On encaisse **l'acompte** (`priceDeposit` de `src/lib/content.ts`), pas le prix total.
- **Stripe Checkout hébergé** (redirection), paiement immédiat. SDK serveur uniquement (`stripe`), pas de SDK client.
- Devise = celle du toggle EUR/USD → `currency: "eur"` ou `"usd"`.
- **Pas de webhooks** : flux synchrone. Retour sur `/order/success?session_id=...` → `GET /api/checkout/verify` qui fait `stripe.checkout.sessions.retrieve`, vérifie `payment_status === "paid"`, puis envoie l'email équipe via Brevo.
- **Taux de change** : `GET https://open.er-api.com/v6/latest/EUR` → `rates.USD` (gratuit, sans clé). Cache en mémoire 1h, fallback `1.08` en cas d'échec (ne jamais bloquer le checkout). Taux live **partout** (cartes `Formats.tsx` + modal), avec la mention « taux approximatif — montant définitif calculé au moment du paiement ».
- Montant USD : `unit_amount = Math.round(depositEur * rate) * 100`.
- Le serveur valide `formatId` contre `formats` dans `content.ts` — **jamais de prix venant du client**. Rejet des formats `contactOnly`.
- `metadata` de la session : `formatId`, `name`, `address`, `depositEur` (référence EUR pour la compta).

## Déjà fait

- [x] Skill projet `.claude/skills/stripe-payments-expert/` (script de check de version, règles de robustesse, patterns Next.js)
- [x] `pnpm add stripe@latest server-only@latest` → stripe 23.0.0 (API épinglée `2026-09-30.endive`), server-only 0.0.1 — *non commité*
- Volontairement **non installés** : `@stripe/stripe-js`, `@stripe/react-stripe-js`

## Prérequis (côté utilisateur)

Ajouter dans `.env` :

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Turnstile en local** : la vraie clé refuse `localhost`. `.env.development.local` (ignoré par git, lu seulement par `pnpm dev`, prioritaire sur `.env`) contient les clés de test officielles de Cloudflare, qui valident toujours le captcha :

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
CLOUDFARE_TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

La prod (`pnpm build` / Vercel) utilise les vraies clés.

Compte Stripe : celui de l'entité qui **reçoit** l'argent (InRealArt) — IBAN + KYC. Pas de Stripe Connect (un compte standard suffit).

## Étapes sur le dashboard Stripe (à faire par toi)

> Les noms de menus peuvent légèrement varier selon la version du dashboard. Le plus simple est d'utiliser la barre de recherche en haut du dashboard (taper « API keys », « Payment methods », etc.).

### Phase 1 — Mode test (nécessaire pour démarrer le dev)

1. **Créer / se connecter au compte** sur https://dashboard.stripe.com avec le compte de l'entité qui **reçoit** l'argent (InRealArt).
2. **Passer en mode test** : activer le toggle « Test mode » (ou le *sandbox*) en haut du dashboard. Tout ce qui suit dans cette phase se fait en mode test.
3. **Récupérer la clé secrète de test** : *Developers → API keys* → copier la **Secret key** `sk_test_...`.
   - La *Publishable key* (`pk_test_...`) **n'est pas nécessaire** (pas de SDK client).
   - Ne jamais commiter cette clé ni la partager dans un canal public.
4. **La coller dans `.env`** (voir section Prérequis), puis redémarrer `pnpm dev`.
5. **Vérifier les moyens de paiement** : *Settings → Payment methods* → s'assurer que **Cards** est activé. Les autres (Apple Pay, Google Pay, Link…) sont optionnels ; Checkout les affiche automatiquement s'ils sont activés.
6. **Rien à configurer côté webhooks** : on n'utilise pas de webhook, ne crée pas d'endpoint.

➡️ À ce stade, je peux implémenter et tester avec la carte `4242 4242 4242 4242` (date future quelconque, CVC quelconque).

### Phase 2 — Personnalisation (recommandé avant la prod)

7. **Infos publiques de l'entreprise** : *Settings → Business → Public details*
   - Nom public (affiché sur la page Checkout)
   - Email et téléphone du support client
   - URL du site
8. **Libellé sur le relevé bancaire** (*statement descriptor*) : même section, ex. `INREALART POULAT` (5 à 22 caractères, sans `< > \ ' "` ni `*`).
9. **Branding de la page Checkout** : *Paramètres → Entreprise → Adaptation à votre marque → Checkout et Payment Links*. Les fichiers sont dans `docs/stripe-branding/` (charte inrealart.com : noir `#0a0a0a`, or `#b89c72`, nom en serif majuscule très espacé).

   | Champ Stripe | Valeur |
   |---|---|
   | **Icône** | `stripe-icon.png` (512×512, monogramme « IRA » or sur noir) |
   | **Logo** | `stripe-logo-gold.png` (wordmark INREALART or, fond transparent) |
   | **Privilégier le logo plutôt que l'icône** | ✅ coché |
   | **Couleur de la marque** | `#0a0a0a` |
   | **Couleur d'accentuation** | `#b89c72` |

   Via **Personnaliser** (style avancé, si les options sont proposées) :
   - Police : une serif (la plus proche de Cormorant dans la liste)
   - Bordures : arrondi faible / angles quasi droits (le site utilise `rounded-sm`)

   Notes :
   - `stripe-logo-black.png` est la variante noire, à utiliser si la couleur de marque choisie est claire (le logo or serait illisible sur fond blanc).
   - `preview-logo-on-brand.png` sert uniquement d'aperçu, ne pas l'uploader.
   - Vérifier dans l'aperçu Stripe (mobile **et** desktop) que le texte du bouton « Payer » reste lisible sur l'or.
   - Ces réglages s'appliquent aussi aux reçus email et au portail client.
10. **Reçus clients** : *Settings → Customer emails* → activer l'envoi automatique des reçus pour les paiements réussis.

### Phase 3 — Activation du compte (obligatoire avant la mise en production)

11. **Activer le compte** : cliquer sur « Activate payments » / « Complete account setup » et renseigner :
    - Type d'entité et informations légales (SIREN/SIRET, adresse)
    - Représentant légal : identité + **pièce d'identité**
    - Description de l'activité (vente d'œuvres d'art, acompte sur commande)
12. **Compte bancaire de versement** : *Settings → Payouts / Bank accounts* → ajouter l'**IBAN** de l'entité, choisir le rythme des versements.
13. **Activer l'authentification à deux facteurs (2FA)** sur le compte Stripe (*Settings → Personal details*) — fortement recommandé pour un compte qui encaisse.
14. **Récupérer la clé secrète live** : désactiver le mode test → *Developers → API keys* → **Secret key** `sk_live_...`.
15. **La configurer en production** (variables d'environnement Vercel), avec `NEXT_PUBLIC_SITE_URL` = l'URL de prod. **Ne jamais** mettre `sk_live_` dans le `.env` local.
16. **Faire un paiement réel de faible montant** en prod pour valider le flux complet, puis le rembourser depuis le dashboard (*Payments → [le paiement] → Refund*).

### Au quotidien

- Les paiements reçus sont visibles dans *Payments*. Le format, le nom et l'adresse sont dans les **metadata** du paiement.
- **Si un client a payé mais que l'équipe n'a pas reçu l'email** (onglet fermé avant la redirection), le paiement est quand même dans *Payments* : c'est là qu'on vérifie.

## Implémentation (réalisée)

1. [x] **`src/lib/stripe.ts`** : client `server-only`, créé à la première utilisation (`getStripe()`), sans `apiVersion`.
2. [x] **`src/lib/fxRate.ts`** : `getEurToUsd()` avec cache de 1h et repli à `FALLBACK_EUR_TO_USD` (1.08, dans `content.ts`). **`/api/fx-rate`** (GET) expose ce taux au client.
3. [x] **`src/app/api/checkout/route.ts`** (POST) :
   - validation Zod et vérification **Turnstile** ;
   - prix relu côté serveur depuis `formatSizes` (`sizeId`), avec rejet des formats `contactOnly` ;
   - `idempotencyKey = checkout:{attemptId}:{sizeId}:{currency}:{amountMinor}` ;
   - URLs success/cancel localisées ;
   - metadata sur la session et sur le PaymentIntent.
4. [x] **`src/lib/orderEmail.ts`** : `sendTeamEmail()` (Brevo, template commun), aussi utilisé par `/api/custom-order`.
5. [x] **`src/lib/payments/fulfill.ts`** : relit la session et vérifie `paid`, envoie l'email puis pose `metadata.fulfilled_at` sur le PaymentIntent.
   *Écart avec le design* : pas de route `GET /api/checkout/verify`. La page success (Server Component) appelle directement `fulfillCheckoutSession`, ce qui revient au même avec un aller-retour en moins.
6. [x] **`ReservationModal.tsx`** :
   - appel de `/api/checkout` (un `attemptId` par ouverture du modal) puis `window.location.assign(url)` ;
   - réinitialisation via `pageshow` en cas de retour depuis Stripe (bfcache) ;
   - le bloc `paymentPreview` est remplacé par `paymentNote`.
7. [x] **Taux live** : hook `useEurToUsd()` dans `Formats.tsx`, transmis au modal. `convertFromEur()` est partagé avec le serveur pour garantir le même arrondi.
8. [x] **Pages** : `src/app/[locale]/order/success/page.tsx` (états paid, pending, invalid) et `src/app/[locale]/order/cancel/page.tsx`, toutes deux en `noindex`.
9. [x] **i18n** :
   - `reservationModal` : `approxRate`, `paymentNote`, `redirecting`, nouveau `submit` ;
   - `formats.approxRate` ;
   - nouveaux namespaces `checkout`, `orderConfirmation`, `orderCancelled`.
10. [x] **Tests** :
    - `tsc` OK ;
    - lint OK sur `src/` (les erreurs restantes sont dans `.history/`) ;
    - paiement 4242 en USD (900 € × 1,125 = 1 013 $) : la page success s'affiche et `fulfilled_at` est posé.

**Supprimé** : `src/app/api/reservation/route.ts`, remplacé par `/api/checkout` qui intègre Turnstile.

### Conformité consommateur (ajouté le 2026-10-07)

- **Case CGV obligatoire** dans le modal :
  - elle n'est pas précochée et contient des liens vers `/terms-and-conditions` et vers `#withdrawal` ;
  - le serveur exige `acceptTerms: true` (Zod `z.literal(true)`) ;
  - la preuve d'acceptation est enregistrée dans les metadata de la session : `termsAccepted`, `termsVersion`. L'horodatage est `session.created`.
  - ⚠️ **`TERMS_VERSION`** (`src/lib/content.ts`) doit être mis à jour en même temps que `cgv.reference` à chaque modification des CGV.
- **Facture d'acompte** : `invoice_creation` est activé. Stripe crée et finalise une facture numérotée, payée, qui indique le solde restant. Le lien vers cette facture figure dans l'email client et sur la page success.
- **Email de confirmation client** (L221-13, support durable), envoyé par Brevo en en/fr. Il contient :
  - le récapitulatif de la commande ;
  - le lien vers la facture et vers son PDF ;
  - la version des CGV acceptée et le lien vers les CGV ;
  - le texte complet des articles 9 (rétractation et formulaire type) et 10 (garanties légales), repris depuis les traductions `cgv.*` pour toujours rester identique aux CGV.
- **Idempotence** : deux marqueurs posés sur le PaymentIntent, `fulfilled_at` pour l'email équipe et `customer_notified_at` pour l'email client.
- La page success n'annonce l'email que s'il a été envoyé.

**À faire dans le dashboard** : *Settings → Invoices* (paramètres de facturation) :
- raison sociale, adresse, SIRET ;
- mention TVA, selon le régime validé par le comptable ;
- préfixe de numérotation (par défaut, un préfixe aléatoire du type `955585CE-0001`).

**Expéditeur des emails (Brevo)** :
- `no-reply@inrealart.com` était rejeté par Brevo, car le domaine `inrealart.com` n'y est pas authentifié. Les formulaires n'avaient donc jamais délivré d'email.
- Provisoirement, l'expéditeur est `teaminrealart@gmail.com`, le seul expéditeur validé. Brevo le réécrit en `teaminrealart@7786982.brevosend.com`, ce qui expose à un risque de spam chez les clients.
- Avant la prod : authentifier `inrealart.com` dans *Brevo → Senders, Domains → Domains* (enregistrements DNS DKIM et DMARC), puis remettre `SENDER_EMAIL` dans `src/lib/orderEmail.ts`.
- Pour vérifier une livraison : *Brevo → Transactional → Logs*. Brevo accepte la requête avant de rejeter l'envoi, donc le code ne voit pas ce genre d'erreur.

**Reste à faire côté juridique** :
- l'article 14 des CGV contient encore un emplacement vide pour le médiateur de la consommation ;
- le régime de TVA est à valider ;
- la politique de confidentialité doit mentionner Stripe, Brevo et Cloudflare.

### Tester soi-même

- `pnpm dev` → `/fr#formats` → « Commander » → carte `4242 4242 4242 4242`, date future, CVC quelconque.
- **Refus** : `4000 0000 0000 0002`. **3DS** : `4000 0027 6000 3184`.
- **Actualiser la page success** : aucun second email ne doit partir.
- **Bouton « Retour » sur Stripe** : la page `/order/cancel` s'affiche.

## Points d'attention

- **Onglet fermé avant la redirection** (risque inhérent au flux sans webhook) : le paiement est encaissé mais aucun email n'est envoyé. Contrôle manuel via le dashboard Stripe.
- **Turnstile** : la vérification se fait dans `/api/checkout`. Un token est à usage unique, donc il est réinitialisé après chaque erreur.
- **Double envoi** : si deux onglets ouvrent la page success exactement au même moment, deux emails peuvent partir (pas de verrou sans base de données). Ce cas est jugé acceptable.

## Stack

Next.js 16.3.x · next-intl (`localePrefix: "as-needed"`, locales en/fr, défaut en) · Zod v4 · Brevo (`@getbrevo/brevo`) · Cloudflare Turnstile · pnpm
