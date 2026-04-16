# Solimouv' — PWA Festival Up Sport!

> PWA Next.js de communication pour le festival annuel Solimouv' (association Up Sport!, Paris).

## Stack

- **Framework** : Next.js 15 (App Router) + TypeScript strict
- **Styles** : Tailwind CSS 3
- **BDD + Auth** : Supabase (PostgreSQL + Row Level Security)
- **Hébergement** : Vercel ou Netlify
- **PWA** : Service Worker manuel + manifest Next.js

## Installation locale

### 1. Cloner le dépôt

```bash
git clone <url-du-repo>
cd solimouv
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Variables d'environnement

Copiez `.env.local.example` en `.env.local` et renseignez vos clés Supabase :

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Configurer la base de données

Dans l'éditeur SQL de Supabase, exécutez le fichier `supabase/schema.sql`.

### 5. Icônes PWA

Placez vos icônes dans `/public/icons/` :
- `icon-16.png` (16×16)
- `icon-32.png` (32×32)
- `icon-192.png` (192×192)
- `icon-512.png` (512×512)

### 6. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Déploiement (Vercel)

1. Connectez votre repo GitHub à Vercel
2. Ajoutez les variables d'environnement dans les settings Vercel
3. Déployez — Vercel détecte Next.js automatiquement

## Arborescence

```
app/
  page.tsx              → Accueil (décompte, stands, CTA, historique)
  programme/            → Programme & stands (filtres)
  sport-matching/       → Quiz matching sport (client-side uniquement)
  associations/         → Associations partenaires
  a-propos/             → À propos Up Sport! + Solimouv'
  contact/              → Contact (mailto)
  auth/login/           → Connexion
  auth/register/        → Inscription
  profil/               → Profil (protégé — inscription, favoris, tampon)
  admin/                → Back-office (protégé role=admin)
  manifest.ts           → Manifest PWA
  sitemap.ts            → Sitemap XML
  robots.ts             → Robots.txt

components/
  Nav.tsx               → Navigation responsive
  Footer.tsx            → Pied de page
  CountdownTimer.tsx    → Décompte temps réel
  ExhibitorCard.tsx     → Carte stand + favoris
  PWAInstallPrompt.tsx  → Bannière installation PWA

lib/
  types.ts              → Types TypeScript
  supabase/client.ts    → Client Supabase (browser)
  supabase/server.ts    → Client Supabase (server)

data/
  matching.json         → Quiz sport matching (7 questions, 15 sports)

public/
  sw.js                 → Service Worker (cache statique)
  icons/                → Icônes PWA

supabase/
  schema.sql            → Schéma BDD + RLS
middleware.ts           → Protection routes /profil et /admin
```

## Rôles & accès

| Rôle | Accès |
|------|-------|
| Non connecté | Pages publiques + quiz |
| `role=user` | + `/profil`, favoris, carte tampon |
| `role=admin` | + `/admin/*` (CRUD événements, stands) |

Pour passer un utilisateur en admin, exécutez dans Supabase :

```sql
update users set role = 'admin' where email = 'admin@example.com';
```

## Accessibilité

- Navigation clavier complète
- Lien "Aller au contenu" (skip link)
- `aria-label`, `aria-current`, `aria-live` sur les éléments interactifs
- Contrastes WCAG AA
- HTML sémantique (h1-h6, article, section, nav, header, footer)
