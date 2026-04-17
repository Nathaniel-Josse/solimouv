import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Mentions légales & Politique de confidentialité',
  description: "Mentions légales, politique de confidentialité et gestion des données personnelles de la PWA Solimouv' — Association Up Sport!",
}

const toc = [
  { href: '#qui', label: 'Qui sommes-nous ?' },
  { href: '#donnees', label: 'Ce qu\'on collecte' },
  { href: '#pourquoi', label: 'Pourquoi ?' },
  { href: '#durees', label: 'Combien de temps ?' },
  { href: '#droits', label: 'Vos droits' },
  { href: '#cookies', label: 'Cookies' },
  { href: '#reclamation', label: 'Réclamation' },
]

function SectionCard({ id, icon, title, children }: { id: string; icon: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="card scroll-mt-24">
      <h2 className="flex items-center gap-3 text-xl font-bold text-festival-dark mb-5">
        <span className="text-2xl">{icon}</span>{title}
      </h2>
      {children}
    </section>
  )
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[1fr_2fr] border border-gray-200 rounded-lg overflow-hidden text-sm">
      <div className="bg-orange-50 text-primary font-medium px-4 py-2.5 border-r border-orange-200">{label}</div>
      <div className="px-4 py-2.5 text-gray-600">{value}</div>
    </div>
  )
}

function Callout({ color, icon, children }: { color: 'orange' | 'blue'; icon: string; children: React.ReactNode }) {
  const cls = color === 'orange'
    ? 'bg-orange-50 border-orange-200 border-l-orange-500 text-orange-900'
    : 'bg-blue-50 border-blue-200 border-l-blue-500 text-blue-900'
  return (
    <div className={`flex gap-3 border border-l-4 rounded-r-xl p-4 mt-4 text-sm ${cls}`}>
      <span className="text-lg shrink-0">{icon}</span>
      <div>{children}</div>
    </div>
  )
}

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">

      {/* Header */}
      <header className="text-center mb-2">
        <span className="inline-block bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
          PWA Solimouv'
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-festival-dark leading-tight mb-2">
          Mentions légales &<br />Politique de confidentialité
        </h1>
        <p className="text-gray-500 text-sm">Dernière mise à jour : juillet 2025 · Association Up Sport!</p>
      </header>

      {/* TOC */}
      <nav aria-label="Sommaire" className="card">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Sommaire</p>
        <div className="flex flex-wrap gap-2">
          {toc.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-orange-50 text-primary border border-orange-200 hover:bg-orange-100 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* 1 */}
      <SectionCard id="qui" icon="🏢" title="Qui sommes-nous ?">
        <p className="text-gray-600 text-sm mb-4">
          L'association <strong>Up Sport! Unis pour le Sport</strong> est responsable de vos données personnelles collectées via la PWA Solimouv'.
        </p>
        <div className="space-y-2">
          <DataRow label="Nom" value="Up Sport! Unis pour le Sport" />
          <DataRow label="Siège social" value="Paris, Île-de-France" />
          <DataRow label="SIRET" value="819 794 413" />
          <DataRow label="Contact RGPD" value="rgpd@upsport.fr" />
          <DataRow label="Site officiel" value="www.unispourlesport.paris" />
        </div>
        <p className="text-xs text-gray-400 mt-3">En accédant à la PWA Solimouv', vous acceptez les conditions décrites dans cette page.</p>
      </SectionCard>

      {/* 2 */}
      <SectionCard id="donnees" icon="📋" title="Quelles données collectons-nous ?">
        <p className="text-gray-600 text-sm mb-4">Voici les informations que nous recueillons selon ce que vous faites sur la PWA :</p>
        <div className="space-y-2">
          <DataRow label="Prénom & email" value="Quand vous créez votre compte" />
          <DataRow label="Mot de passe" value="Chiffré — on ne peut pas le lire, même nous" />
          <DataRow label="Inscriptions ateliers" value="Le ou les ateliers choisis, le nombre de personnes" />
          <DataRow label="Préférences sportives" value="Vos réponses au questionnaire de matching (optionnel)" />
          <DataRow label="Pages consultées" value="Navigation anonyme — pas de nom, juste 'quelqu'un a visité cette page'" />
          <DataRow label="Stands favoris" value="Les stands que vous avez mis en favori (optionnel)" />
          <DataRow label="Carte de tampons" value="Les stands que vous avez visités le jour du festival" />
        </div>
        <div className="bg-red-50 border border-red-200 border-l-4 border-l-red-500 rounded-r-xl p-3 mt-4 text-xs text-red-800">
          <strong>⚠️ Donnée sensible :</strong> Si vous renseignez un besoin d'accessibilité lié à votre santé, cette information est protégée par la loi (Art. 9 RGPD), chiffrée, accessible uniquement aux organisateurs, et supprimée 7 jours après le festival.
        </div>
      </SectionCard>

      {/* 3 */}
      <SectionCard id="pourquoi" icon="🎯" title="Pourquoi collectons-nous ces données ?">
        <p className="text-gray-600 text-sm mb-4">Chaque donnée a une utilité précise :</p>
        <div className="space-y-2">
          <DataRow label="Votre email" value="Pour vous envoyer votre confirmation d'inscription et les rappels avant le festival" />
          <DataRow label="Vos inscriptions" value="Pour que les organisateurs sachent combien de places sont prises" />
          <DataRow label="Préférences sportives" value="Pour vous suggérer les sports et associations qui correspondent à votre profil" />
          <DataRow label="Votre navigation" value="Pour savoir quelles pages fonctionnent bien et améliorer la PWA" />
          <DataRow label="Vos tampons festival" value="Pour valider votre participation aux stands et déclencher une récompense si carte complète" />
          <DataRow label="Besoin d'accessibilité" value="Pour adapter l'accueil à votre situation le jour J — jamais partagé hors équipe organisatrice" />
        </div>
        <Callout color="orange" icon="💡">
          On ne vend jamais vos données, on ne les partage pas avec des annonceurs, et on n'utilise rien à d'autres fins que celles listées ici.
        </Callout>
      </SectionCard>

      {/* 4 */}
      <SectionCard id="durees" icon="🕐" title="Combien de temps gardons-nous vos données ?">
        <p className="text-gray-600 text-sm mb-4">On conserve vos données uniquement le temps nécessaire :</p>
        <div className="overflow-x-auto rounded-xl border border-gray-200 text-sm">
          <table className="w-full min-w-[500px]">
            <thead className="bg-primary text-white">
              <tr>
                <th className="text-left px-4 py-2.5 font-semibold">Donnée</th>
                <th className="text-left px-4 py-2.5 font-semibold">Conservation</th>
                <th className="text-left px-4 py-2.5 font-semibold">Déclencheur</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Compte (email, prénom)', 'Jusqu\'à suppression', 'Votre demande ou 3 ans sans connexion'],
                ['Inscriptions ateliers', '13 mois après festival', 'Automatique'],
                ['Besoin d\'accessibilité', '7 jours après festival', 'Automatique — suppression rapide'],
                ['Préférences sportives', '13 mois (anonymisé)', 'Automatique'],
                ['Carte de tampons', '30 jours après festival', 'Automatique'],
                ['Données de navigation', '13 mois (anonyme)', 'Automatique'],
                ['Formulaire de contact', '3 mois après réponse', 'Automatique'],
              ].map(([data, duration, trigger], i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-orange-50/40'}>
                  <td className="px-4 py-2.5 text-gray-700">{data}</td>
                  <td className={`px-4 py-2.5 font-medium ${data.includes('accessibilité') ? 'text-red-600' : 'text-gray-700'}`}>{duration}</td>
                  <td className="px-4 py-2.5 text-gray-500">{trigger}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* 5 */}
      <SectionCard id="droits" icon="🔐" title="Vos droits">
        <p className="text-gray-600 text-sm mb-4">Vous avez le contrôle sur vos données. À tout moment et gratuitement :</p>
        <ul className="space-y-3">
          {[
            { icon: '👁️', title: 'Accéder à vos données', desc: 'Demander la liste complète de tout ce qu\'on a sur vous (PDF ou fichier texte)' },
            { icon: '✏️', title: 'Corriger vos données', desc: 'Signaler une erreur dans vos informations pour qu\'on la corrige' },
            { icon: '🗑️', title: 'Supprimer vos données', desc: 'Demander qu\'on efface tout — le "droit à l\'oubli". On a 30 jours pour le faire' },
            { icon: '↩️', title: 'Retirer votre consentement', desc: 'Stopper à tout moment la newsletter, les notifications push ou le traitement de vos préférences' },
            { icon: '📤', title: 'Récupérer vos données', desc: 'Obtenir vos données en format réutilisable (JSON ou CSV)' },
            { icon: '🚫', title: 'Vous opposer à un traitement', desc: 'Refuser qu\'on utilise vos données pour certaines finalités (ex. statistiques)' },
          ].map(({ icon, title, desc }) => (
            <li key={title} className="flex items-start gap-3 bg-orange-50 border border-orange-100 rounded-xl p-3 text-sm">
              <span className="text-xl shrink-0">{icon}</span>
              <div>
                <strong className="block text-festival-dark font-semibold mb-0.5">{title}</strong>
                <span className="text-gray-600">{desc}</span>
              </div>
            </li>
          ))}
        </ul>
        <Callout color="orange" icon="📬">
          <strong>Pour exercer vos droits :</strong> <a href="mailto:rgpd@upsport.fr" className="font-semibold underline">rgpd@upsport.fr</a><br />
          <span className="text-xs opacity-80">Réponse sous 30 jours maximum. Une vérification d'identité sera demandée pour les suppressions.</span>
        </Callout>
      </SectionCard>

      {/* 6 */}
      <SectionCard id="cookies" icon="🍪" title="Cookies et mesure d'audience">
        <p className="text-gray-600 text-sm mb-4">Un cookie est un petit fichier déposé sur votre appareil. Voici ce qu'on utilise :</p>
        <ul className="space-y-3 text-sm">
          <li className="flex gap-3">
            <span className="w-3 h-3 rounded-full bg-primary shrink-0 mt-1" />
            <div>
              <strong className="text-primary">Cookies indispensables</strong><br />
              <span className="text-gray-600">Ils font fonctionner la PWA (connexion, préférences). Pas besoin de votre accord pour ceux-là.</span>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="w-3 h-3 rounded-full bg-secondary shrink-0 mt-1" />
            <div>
              <strong className="text-secondary">Cookies d'analyse (Matomo)</strong><br />
              <span className="text-gray-600">Ils comptent les visites pour améliorer la PWA. Ils sont anonymes — on ne sait pas qui vous êtes.</span>
            </div>
          </li>
        </ul>
        <p className="text-xs text-gray-400 mt-4">Vous pouvez changer votre choix à tout moment. Refuser les cookies d'analyse n'affecte pas votre accès à la PWA.</p>
      </SectionCard>

      {/* 7 */}
      <SectionCard id="reclamation" icon="⚖️" title="Réclamation">
        <p className="text-gray-600 text-sm mb-3">
          Si vous pensez que vos données ne sont pas traitées correctement, contactez-nous d'abord à <strong>rgpd@upsport.fr</strong> — on fera tout pour résoudre le problème rapidement.
        </p>
        <p className="text-gray-600 text-sm mb-3">
          Si vous n'êtes pas satisfait de notre réponse, vous pouvez déposer une plainte auprès de la <strong>CNIL</strong>.
        </p>
        <Callout color="blue" icon="🏛️">
          <strong>CNIL — Commission Nationale de l'Informatique et des Libertés</strong><br />
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="font-medium underline">www.cnil.fr</a><br />
          <span className="text-xs opacity-80">3 Place de Fontenoy — TSA 80715 — 75334 Paris Cedex 07</span>
        </Callout>
      </SectionCard>

      {/* Footer note */}
      <p className="text-center text-xs text-gray-400 pt-4">
        PWA Solimouv' · Up Sport! Unis pour le Sport · SIRET 819 794 413 ·{' '}
        <a href="mailto:rgpd@upsport.fr" className="text-primary hover:underline">rgpd@upsport.fr</a>
      </p>
    </div>
  )
}
