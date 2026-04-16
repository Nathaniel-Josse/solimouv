# Solimouv' — PWA Festival Up Sport!

## Projet
PWA Next.js de communication pour le festival annuel Solimouv' (association Up Sport!, Paris).
Utilisateurs cibles : familles, jeunes, seniors, personnes réfugiées, communauté LGBTQIA+, personnes en situation de handicap.

## Stack
- **Framework** : Next.js (App Router)
- **BDD + Auth** : Supabase (PostgreSQL + Row Level Security)
- **Hébergement** : Vercel ou Netlify
- **Automatisation** : Make
- **Versionning** : GitHub

## PWA
- `manifest.json` + service worker obligatoires
- Mobile-first, responsive
- Lighthouse score > 70
- Accessibilité WCAG de base (contrastes, nav clavier)

## Arborescence

```
/                        → Accueil (décompte, stands en avant, CTA inscription, historique éditions, prompt install PWA)
/programme               → Programme & Ateliers (filtres, inscription événement, favoris stands)
/sport-matching          → Quiz matching sport (public, sans inscription, résultat non stocké)
/associations            → Associations partenaires
/a-propos                → À propos Up Sport! + Solimouv'
/contact                 → Contact (mailto)
/auth/login              → Auth (hors nav — modal ou page dédiée)
/auth/register
/profil                  → Protégé (informations, favoris, carte tampon)
/admin                   → Protégé role=admin, hors nav publique (événements, stands, contenus, stats)
```

## Base de données

```sql
users           (id, email, display_name, role enum('user','admin') default 'user', is_in_newsletter bool, created_at, updated_at)
events          (id, year int UNIQUE, date, location, is_active bool, created_at)
registrations   (id, user_id FK, event_id FK, guests_count int default 0, created_at) UNIQUE(user_id, event_id)
exhibitors      (id, event_id FK, name, description, category, picture_url, association_name, created_at, updated_at)
favorites       (id, user_id FK, exhibitor_id FK, created_at) UNIQUE(user_id, exhibitor_id)
stamp_cards     (id, user_id FK, event_id FK, created_at) UNIQUE(user_id, event_id)
stamp_entries   (id, card_id FK, exhibitor_id FK, stamped_at) UNIQUE(card_id, exhibitor_id)
```

## Sport Matching
- Quiz statique — questions/réponses/sports dans `/data/matching.json`
- Scoring côté client uniquement (TypeScript pur)
- Aucune donnée stockée en BDD
- Structure JSON : `{ questions[], answers[], sports[] }`

## Conventions
- TypeScript strict, pas de `any`
- Composants dans `/components`, pages dans `/app`
- Variables d'environnement Supabase dans `.env.local` (ne jamais committer)
- RLS activé sur toutes les tables Supabase
- Auth gérée exclusivement par Supabase Auth — ne jamais stocker de mot de passe

## Rôles & Accès
- `role=user` : accès public + profil + favoris + carte tampon
- `role=admin` : accès `/admin/*` en plus
- `events.is_active` : une seule édition active à la fois — gérée manuellement par le Tech Lead

## SEO (SM-2)
- Balises meta, Open Graph, Twitter Card sur chaque page
- HTML sémantique (h1-h6, article, section, nav)
- `sitemap.xml` généré
- Schema.org `Event` + `Organization`
- Lazy loading images, compression

## Livraison client
- README GitHub : architecture, stack, instructions déploiement
- Guide utilisation pour l'asso (non-tech)
- Tout doit être repris de façon autonome par le client
