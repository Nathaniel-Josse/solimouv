import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'À propos — Up Sport! & Solimouv\'',
  description: 'Découvrez l\'association Up Sport! et l\'histoire du festival Solimouv\', engagés pour le sport inclusif à Paris.',
}

export default function AProposPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="section-title text-4xl">À propos 💙</h1>
        <p className="section-subtitle text-lg">
          Qui sommes-nous ? Quelle est l'histoire de Solimouv' ?
        </p>
      </header>

      {/* Up Sport! */}
      <section className="card mb-8" aria-labelledby="upsport-title">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🏛️</span>
          <h2 id="upsport-title" className="text-2xl font-extrabold text-festival-dark">Up Sport!</h2>
        </div>
        <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
          <p>
            <strong>Up Sport!</strong> est une association loi 1901 basée à Paris, fondée avec la conviction que le
            sport est un vecteur puissant d'inclusion sociale et de bien-être pour tous.
          </p>
          <p>
            Notre mission : rendre le sport accessible à toutes et tous, quelles que soient les origines, les
            capacités physiques, les orientations ou les situations de vie. Nous agissons pour les familles,
            les jeunes, les seniors, les personnes réfugiées, la communauté LGBTQIA+ et les personnes en
            situation de handicap.
          </p>
          <p>
            Chaque année, Up Sport! fédère des dizaines d'associations partenaires et mobilise bénévoles
            et professionnel·les du sport autour d'événements fédérateurs.
          </p>
        </div>
      </section>

      {/* Solimouv' */}
      <section className="card mb-8 border-l-4 border-primary" aria-labelledby="festival-title">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🎉</span>
          <h2 id="festival-title" className="text-2xl font-extrabold text-festival-dark">Le festival Solimouv'</h2>
        </div>
        <div className="text-gray-700 space-y-4">
          <p>
            <strong>Solimouv'</strong> est le festival annuel phare d'Up Sport! Il réunit chaque été dans un parc
            parisien des milliers de participant·es autour de stands sportifs, ateliers de bien-être,
            démonstrations et rencontres.
          </p>
          <p>
            Depuis sa première édition en 2019, Solimouv' est devenu un rendez-vous incontournable de
            l'été parisien. Une journée de fête, de sport et de partage, ouverte gratuitement à toutes
            et tous.
          </p>
        </div>
      </section>

      {/* Valeurs */}
      <section aria-labelledby="valeurs-title">
        <h2 id="valeurs-title" className="section-title text-center mb-8">Nos valeurs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              icon: '🌈',
              title: 'Inclusion & Diversité',
              desc: "Nous accueillons chaque personne dans sa singularité, sans discrimination d'aucune sorte.",
            },
            {
              icon: '♿',
              title: 'Accessibilité',
              desc: "Nos événements sont conçus pour être accessibles aux personnes en situation de handicap.",
            },
            {
              icon: '🤝',
              title: 'Solidarité',
              desc: "Créer du lien social entre les différentes communautés est au cœur de notre action.",
            },
            {
              icon: '⚡',
              title: 'Engagement',
              desc: "Nos bénévoles et partenaires s'investissent pour que chaque édition soit un succès.",
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

      {/* CTA */}
      <div className="mt-12 text-center">
        <Link href="/contact" className="btn-primary">
          Nous contacter
        </Link>
      </div>
    </div>
  )
}
