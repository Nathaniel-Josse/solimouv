import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: "À Propos | Solimouv' Festival" },
  description: "Découvrez l'association engagée pour un sport accessible à tous à Paris, derrière le festival Solimouv'.",
}

export default function AProposPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="section-title text-4xl">Une association engagée pour un sport accessible à tous</h1>
        <p className="section-subtitle text-lg max-w-2xl mx-auto">
          Solimouv' est porté par une association engagée pour rendre le sport accessible à tous à Paris. À travers ses actions, elle accompagne des publics variés et défend une vision du sport comme un outil de lien social, d'inclusion et de bien-être.
        </p>
      </header>

      {/* Qui sommes-nous */}
      <section className="card mb-8" aria-labelledby="upsport-title">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🏛️</span>
          <h2 id="upsport-title" className="text-2xl font-extrabold text-festival-dark">Qui sommes-nous ?</h2>
        </div>
        <div className="text-gray-700 space-y-4">
          <p>
            <strong>Up Sport!</strong> est une association sportive solidaire basée à Paris, qui œuvre depuis plusieurs années pour développer des pratiques sportives inclusives.
          </p>
          <p>
            Notre objectif est simple : permettre à chacun de pratiquer une activité physique, quels que soient son parcours, son niveau ou sa situation. Nous travaillons en collaboration avec un réseau d'acteurs engagés pour construire des projets accessibles et ouverts à tous.
          </p>
        </div>
      </section>

      {/* Notre mission */}
      <section className="card mb-8 border-l-4 border-primary" aria-labelledby="mission-title">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🎯</span>
          <h2 id="mission-title" className="text-2xl font-extrabold text-festival-dark">Notre mission : le sport pour tous</h2>
        </div>
        <div className="text-gray-700 space-y-4">
          <p>Nous croyons que le sport doit être accessible à tous. C'est pourquoi nous développons des actions qui favorisent :</p>
          <ul className="space-y-2 ml-4">
            {[
              "l'accès à une activité sportive pour les publics éloignés",
              "la découverte de nouvelles pratiques",
              "la création de lien social à travers le sport",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <span className="text-primary font-bold shrink-0">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p>Le sport devient alors un levier d'inclusion, de confiance et de partage.</p>
        </div>
      </section>

      {/* Valeurs */}
      <section aria-labelledby="valeurs-title">
        <h2 id="valeurs-title" className="section-title text-center mb-8">Nos valeurs : inclusion, solidarité, partage</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              icon: '🌈',
              title: 'Inclusion',
              desc: "Chaque personne doit pouvoir trouver sa place, sans distinction de niveau, d'origine ou de situation.",
            },
            {
              icon: '🤝',
              title: 'Solidarité',
              desc: "Nous favorisons l'entraide, la rencontre et la création de liens entre les participants.",
            },
            {
              icon: '♿',
              title: 'Accessibilité',
              desc: "Nos événements sont conçus pour être accessibles à tous, avec des dispositifs adaptés selon les besoins.",
            },
            {
              icon: '⚡',
              title: 'Partage',
              desc: "Le sport est avant tout une expérience collective, accessible et ouverte. Ces valeurs guident l'ensemble de nos actions.",
            },
          ].map((v) => (
            <article key={v.title} className="card flex gap-4">
              <span className="text-3xl shrink-0">{v.icon}</span>
              <div>
                <h3 className="font-bold text-festival-dark mb-1">{v.title}</h3>
                <p className="text-sm text-gray-600">{v.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Le festival */}
      <section className="card mt-8" aria-labelledby="festival-title">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🎉</span>
          <h2 id="festival-title" className="text-2xl font-extrabold text-festival-dark">Le festival Solimouv'</h2>
        </div>
        <div className="text-gray-700 space-y-4">
          <p>
            <strong>Solimouv'</strong> est né de la volonté de créer un événement sportif à Paris ouvert à tous. Le festival rassemble des associations, des participants et des bénévoles autour d'un objectif commun : rendre le sport accessible et inclusif.
          </p>
          <p>Pendant une journée, chacun peut :</p>
          <ul className="space-y-2 ml-4">
            {[
              "découvrir des activités sportives gratuites",
              "rencontrer des associations engagées",
              "tester, apprendre et partager",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <span className="text-primary font-bold shrink-0">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p>Solimouv' est un espace de découverte, mais aussi de rencontre et d'échange.</p>
        </div>
      </section>

      {/* Final block */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-2">
          Rejoindre Solimouv', c'est participer à une expérience sportive différente.
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Une expérience où l'on vient pour découvrir, mais aussi pour rencontrer et créer du lien.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/programme" className="btn-primary">
            Je découvre le festival
          </Link>
          <Link href="/auth/register" className="btn-outline">
            Je m'inscris
          </Link>
        </div>
      </div>
    </div>
  )
}
