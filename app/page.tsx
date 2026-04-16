import type { Metadata } from 'next'
import Link from 'next/link'
import CountdownTimer from '@/components/CountdownTimer'
import ExhibitorCard from '@/components/ExhibitorCard'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Accueil — Solimouv\' Festival Up Sport!',
  description: 'Bienvenue sur Solimouv\', le festival annuel sport & inclusion de l\'association Up Sport! à Paris.',
}

const FESTIVAL_DATE = '2026-06-21T10:00:00'

const pastEditions = [
  { year: 2023, location: 'Parc de la Villette, Paris', highlights: '2 500 participants · 40 stands · 15 associations' },
  { year: 2022, location: 'Bois de Vincennes, Paris', highlights: '1 800 participants · 32 stands · 12 associations' },
  { year: 2019, location: 'Parc des Buttes-Chaumont, Paris', highlights: '1 200 participants · 20 stands · 8 associations' },
]

export default async function HomePage() {
  const supabase = await createClient()

  const { data: activeEvent } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .single()

  const { data: featuredExhibitors } = activeEvent
    ? await supabase
        .from('exhibitors')
        .select('*')
        .eq('event_id', activeEvent.id)
        .limit(6)
    : { data: [] }

  return (
    <>
      {/* Hero */}
      <section
        className="relative bg-gradient-to-br from-primary via-primary-dark to-secondary text-white py-20 px-4 overflow-hidden"
        aria-labelledby="hero-title"
      >
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute top-10 left-10 text-9xl">⚽</div>
          <div className="absolute top-20 right-20 text-8xl">🏀</div>
          <div className="absolute bottom-10 left-1/4 text-7xl">🧘</div>
          <div className="absolute bottom-20 right-10 text-9xl">💃</div>
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-orange-200 font-semibold uppercase tracking-wider text-sm mb-4">
            Association Up Sport! — Paris
          </p>
          <h1 id="hero-title" className="text-4xl sm:text-6xl font-extrabold mb-4 leading-tight">
            Solimouv' 2026 🎉
          </h1>
          <p className="text-xl sm:text-2xl opacity-90 mb-8 max-w-2xl mx-auto">
            Le festival sport & inclusion pour <strong>tous</strong>, sans exception — familles, jeunes, seniors, et toutes les communautés.
          </p>

          {activeEvent ? (
            <div className="mb-8">
              <p className="text-orange-200 mb-4 text-sm font-medium">
                📍 {activeEvent.location} · {new Date(activeEvent.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <CountdownTimer targetDate={activeEvent.date} />
            </div>
          ) : (
            <div className="mb-8">
              <p className="text-orange-200 mb-4 text-sm font-medium">
                📍 Paris, France · Été 2026
              </p>
              <CountdownTimer targetDate={FESTIVAL_DATE} />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="btn-primary bg-white !text-primary hover:bg-orange-50 text-center">
              S'inscrire au festival
            </Link>
            <Link href="/programme" className="btn-outline !border-white !text-white hover:!bg-white/20 text-center">
              Voir le programme
            </Link>
          </div>
        </div>
      </section>

      {/* Values strip */}
      <section className="bg-white py-10 px-4" aria-label="Valeurs du festival">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { icon: '🌈', label: 'Inclusif', desc: 'Pour toutes les communautés' },
            { icon: '♿', label: 'Accessible', desc: 'Tous niveaux, tous âges' },
            { icon: '🤝', label: 'Solidaire', desc: 'Rencontre & partage' },
            { icon: '⚡', label: 'Dynamique', desc: 'Sport & mouvement' },
          ].map((v) => (
            <div key={v.label}>
              <div className="text-4xl mb-2">{v.icon}</div>
              <h2 className="font-bold text-festival-dark">{v.label}</h2>
              <p className="text-sm text-gray-500">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured exhibitors */}
      {featuredExhibitors && featuredExhibitors.length > 0 && (
        <section className="py-16 px-4 max-w-7xl mx-auto" aria-labelledby="stands-title">
          <div className="text-center mb-10">
            <h2 id="stands-title" className="section-title">Stands à la une 🏅</h2>
            <p className="section-subtitle">Découvrez quelques-uns des stands qui seront présents cette année</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredExhibitors.map((exhibitor) => (
              <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} showFavoriteButton={false} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/programme" className="btn-primary">
              Voir tous les stands
            </Link>
          </div>
        </section>
      )}

      {/* CTA Registration */}
      <section className="bg-secondary text-white py-16 px-4" aria-labelledby="cta-title">
        <div className="max-w-3xl mx-auto text-center">
          <h2 id="cta-title" className="text-3xl font-extrabold mb-4">
            Rejoins l'aventure Solimouv' ! 🚀
          </h2>
          <p className="text-purple-200 text-lg mb-8">
            Inscription gratuite — venez nombreux avec famille et amis. Places limitées, inscrivez-vous dès maintenant !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="btn-primary bg-white !text-secondary hover:bg-purple-50 text-center">
              Créer mon compte
            </Link>
            <Link href="/sport-matching" className="btn-outline !border-white !text-white hover:!bg-white/20 text-center">
              Trouver mon sport 🎯
            </Link>
          </div>
        </div>
      </section>

      {/* Past editions */}
      <section className="py-16 px-4 max-w-5xl mx-auto" aria-labelledby="editions-title">
        <div className="text-center mb-10">
          <h2 id="editions-title" className="section-title">Éditions passées 📚</h2>
          <p className="section-subtitle">L'histoire de Solimouv' en quelques chiffres</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pastEditions.map((ed) => (
            <article key={ed.year} className="card border-l-4 border-primary">
              <h3 className="text-2xl font-extrabold text-primary mb-1">Édition {ed.year}</h3>
              <p className="text-sm text-gray-500 mb-3">📍 {ed.location}</p>
              <p className="text-sm font-medium text-gray-700">{ed.highlights}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
