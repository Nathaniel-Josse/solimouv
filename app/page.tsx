import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import CountdownTimer from '@/components/CountdownTimer'
import ExhibitorCard from '@/components/ExhibitorCard'
import PWAInstallButton from '@/components/PWAInstallButton'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: { absolute: "Festival du Sport Accessible à Tous | Solimouv' Festival" },
  description: "Découvrez Solimouv' Festival, un événement sportif à Paris ouvert à tous : activités gratuites, inclusives et accessibles pour tous les publics.",
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
      {/* Hero — Bloc 1 */}
      <section
        className="relative text-white overflow-hidden min-h-[600px] flex items-center"
        aria-labelledby="hero-title"
      >
        {/* Background photo */}
        <Image
          src="/images/festival-1.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-festival-dark/85 via-festival-dark/60 to-primary/40" aria-hidden="true" />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-20 text-center">
          {/* Date badge */}
          <span className="inline-block bg-primary text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            {activeEvent
              ? new Date(activeEvent.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
              : '6 juin 2026'
            } — Paris
          </span>

          <h1 id="hero-title" className="text-5xl sm:text-7xl font-extrabold mb-6 leading-tight" style={{ fontFamily: 'var(--font-bricolage)' }}>
            Solimouv&apos;
          </h1>
          <p className="text-xl sm:text-2xl opacity-90 mb-4 max-w-2xl mx-auto font-medium">
            Événement sportif à Paris : trouve ton sport, trouve ta place.
          </p>
          <p className="text-base opacity-75 mb-8 max-w-xl mx-auto">
            Seul ou accompagné, tu fais déjà partie de la famille. Découvre un festival de sport inclusif, accessible et ouvert à tous.
          </p>

          {activeEvent && (
            <div className="mb-8">
              <p className="text-orange-200 mb-3 text-sm font-medium">
                📍 {activeEvent.location}
              </p>
              <CountdownTimer targetDate={activeEvent.date} />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/programme" className="btn-primary text-center">
              Je découvre les activités
            </Link>
            <Link href="/auth/register" className="btn-outline !border-white !text-white hover:!bg-white hover:!text-festival-dark text-center">
              Je m&apos;inscris au festival
            </Link>
          </div>
        </div>
      </section>

      {/* Orange banner — Bloc tagline */}
      <section className="bg-primary py-10 px-4" aria-label="Tagline du festival">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white text-2xl sm:text-3xl font-extrabold" style={{ fontFamily: 'var(--font-bricolage)' }}>
            Le festival où tout le monde a sa place.
          </p>
        </div>
      </section>

      {/* Image duo */}
      <section className="grid grid-cols-2 gap-0 h-64 sm:h-80" aria-hidden="true">
        <div className="relative overflow-hidden">
          <Image src="/images/festival-2.jpg" alt="Festival Solimouv' — activités sportives" fill className="object-cover" />
        </div>
        <div className="relative overflow-hidden">
          <Image src="/images/festival-3.jpg" alt="Festival Solimouv' — participants" fill className="object-cover" />
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
              <p className="text-sm text-gray-600">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured exhibitors — Bloc 2 */}
      {featuredExhibitors && featuredExhibitors.length > 0 && (
        <section className="py-16 px-4 max-w-7xl mx-auto" aria-labelledby="stands-title">
          <div className="text-center mb-10">
            <h2 id="stands-title" className="section-title">Des activités sportives pour tous les profils</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Boxe, danse, fitness, sports adaptés, activités collectives… Peu importe ton niveau ou ton expérience, il y a forcément une activité pour toi. Ici, on ne vient pas performer. On vient essayer, découvrir et prendre plaisir.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredExhibitors.map((exhibitor) => (
              <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} showFavoriteButton={false} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/programme" className="btn-primary">
              Je trouve mon activité
            </Link>
          </div>
        </section>
      )}

      {/* Pink features — Bloc app features */}
      <section className="py-16 px-4" style={{ backgroundColor: '#FFADC9' }} aria-labelledby="features-title">
        <div className="max-w-5xl mx-auto">
          <h2 id="features-title" className="section-title text-center text-festival-dark mb-10">
            Ton expérience Solimouv&apos;
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: '❤️',
                title: 'Le Match Sportif',
                desc: 'Tu hésites entre la boxe, le yoga ou le foot ? Réponds à quelques questions sur notre quiz intégré et découvre la discipline qui matche avec tes envies du moment.',
                href: '/sport-matching',
              },
              {
                icon: '🏟️',
                title: 'Programme & Favoris',
                desc: 'Découvre les associations présentes. Tu peux réserver un atelier ou une initiation spécifique. Ajoute-les à tes favoris pour créer ton parcours personnalisé.',
                href: '/programme',
              },
              {
                icon: '🎯',
                title: 'La Carte Tampon Digitale',
                desc: "C'est le jeu de la journée ! Fais scanner ton billet à l'entrée pour activer ta carte. À chaque stand visité, demande ton tampon digital.",
                href: '/profil',
              },
            ].map((f) => (
              <Link key={f.title} href={f.href} className="block rounded-[14px] bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-3xl mb-3 block">{f.icon}</span>
                <h3 className="font-extrabold text-festival-dark mb-2" style={{ fontFamily: 'var(--font-bricolage)' }}>{f.title}</h3>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Registration — Bloc 4 */}
      <section className="bg-festival-dark text-white py-16 px-4" aria-labelledby="cta-title">
        <div className="max-w-3xl mx-auto text-center">
          <h2 id="cta-title" className="text-3xl font-extrabold mb-4">
            Rejoins l&apos;aventure Solimouv&apos;
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Inscris-toi dès maintenant pour participer au festival, accéder aux activités et recevoir toutes les infos. Crée ton compte, choisis tes activités et vis l'expérience pleinement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="btn-primary text-center">
              Je m&apos;inscris
            </Link>
            <Link href="/sport-matching" className="btn-outline !border-white !text-white hover:!bg-white hover:!text-festival-dark text-center">
              Je découvre mon profil sportif 🎯
            </Link>
          </div>
        </div>
      </section>

      {/* Past editions — Bloc 5 */}
      <section className="py-16 px-4 max-w-5xl mx-auto" aria-labelledby="editions-title">
        <div className="text-center mb-10">
          <h2 id="editions-title" className="section-title">Ils ont vécu Solimouv&apos;</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Des centaines de participants, des dizaines d'activités et surtout des rencontres. Parce qu'ici, on ne vient pas seulement faire du sport, on vient partager un moment et créer du lien.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pastEditions.map((ed) => (
            <article key={ed.year} className="card border-l-4 border-primary">
              <h3 className="text-2xl font-extrabold text-primary mb-1">Édition {ed.year}</h3>
              <p className="text-sm text-gray-600 mb-3">📍 {ed.location}</p>
              <p className="text-sm font-medium text-gray-700">{ed.highlights}</p>
            </article>
          ))}
        </div>
        <div className="text-center mt-10">
          <p className="text-lg font-bold text-festival-dark mb-4" style={{ fontFamily: 'var(--font-bricolage)' }}>
            Et si c'était à ton tour ?
          </p>
          <Link href="/programme" className="btn-primary">
            Je découvre le festival
          </Link>
        </div>
      </section>

      {/* PWA — Bloc 6 */}
      <section className="bg-festival-dark text-white py-16 px-4" aria-labelledby="pwa-title">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4">📱</div>
          <h2 id="pwa-title" className="text-3xl font-extrabold mb-4">
            Le festival dans ta poche
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
            Ajoute Solimouv' à ton téléphone et accède à ton programme personnalisé, tes favoris et ton parcours en temps réel. Une expérience simple, rapide et pensée pour toi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PWAInstallButton className="btn-primary text-center" />
            <Link href="/programme" className="btn-outline !border-white !text-white hover:!bg-white hover:!text-festival-dark text-center">
              Accéder à la web app
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
