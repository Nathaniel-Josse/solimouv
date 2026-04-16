'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { AppUser, Event, Registration, Favorite } from '@/lib/types'

interface ProfilClientProps {
  user: User
  profile: AppUser | null
  activeEvent: Event | null
  registration: Registration | null
  favorites: (Favorite & { exhibitors: { name: string; description: string; category: string } | null })[]
  stampCard: { id: string; stamp_entries: { exhibitors: { name: string } | null }[] } | null
  exhibitorsCount: number
}

export default function ProfilClient({
  user,
  profile,
  activeEvent,
  registration,
  favorites,
  stampCard,
  exhibitorsCount,
}: ProfilClientProps) {
  const router = useRouter()
  const supabase = createClient()
  const [guests, setGuests] = useState(1)
  const [registering, setRegistering] = useState(false)
  const [regError, setRegError] = useState<string | null>(null)
  const [regSuccess, setRegSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState<'profil' | 'favoris' | 'tampon'>('profil')

  const handleRegister = async () => {
    if (!activeEvent) return
    setRegistering(true)
    setRegError(null)

    const { error } = await supabase.from('registrations').insert({
      user_id: user.id,
      event_id: activeEvent.id,
      guests_count: guests,
    })

    if (error) {
      setRegError('Inscription impossible. Vous êtes peut-être déjà inscrit(e).')
    } else {
      setRegSuccess(true)
      router.refresh()
    }
    setRegistering(false)
  }

  const stampsCount = stampCard?.stamp_entries?.length || 0

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <header className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold shrink-0">
          {(profile?.display_name || user.email || 'U')[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-festival-dark">
            Bonjour, {profile?.display_name || 'aventurier(e)'} ! 👋
          </h1>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-8" role="tablist">
        {(['profil', 'favoris', 'tampon'] as const).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors capitalize ${
              activeTab === tab ? 'bg-white shadow text-primary' : 'text-gray-600 hover:text-primary'
            }`}
          >
            {tab === 'profil' ? '👤 Profil' : tab === 'favoris' ? '❤️ Favoris' : '🎯 Carte tampon'}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'profil' && (
        <div className="space-y-6">
          {/* Event registration */}
          {activeEvent && (
            <section className="card" aria-labelledby="inscription-title">
              <h2 id="inscription-title" className="text-xl font-bold text-festival-dark mb-4">
                🎉 Festival {activeEvent.year}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                📍 {activeEvent.location} · {new Date(activeEvent.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>

              {registration || regSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="font-semibold text-green-800">Vous êtes inscrit(e) !</p>
                    <p className="text-sm text-green-700">
                      {(registration?.guests_count || guests) > 0 &&
                        `+ ${registration?.guests_count || guests} accompagnant(s)`}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="guests" className="label">Nombre d'accompagnants</label>
                    <input
                      id="guests"
                      type="number"
                      min={0}
                      max={10}
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="input-field w-32"
                    />
                  </div>
                  {regError && (
                    <p role="alert" className="text-red-600 text-sm">{regError}</p>
                  )}
                  <button
                    onClick={handleRegister}
                    disabled={registering}
                    className="btn-primary disabled:opacity-60"
                  >
                    {registering ? 'Inscription...' : "S'inscrire au festival"}
                  </button>
                </div>
              )}
            </section>
          )}

          {/* Profile info */}
          <section className="card" aria-labelledby="info-title">
            <h2 id="info-title" className="text-xl font-bold text-festival-dark mb-4">Informations</h2>
            <dl className="space-y-3">
              {[
                { label: 'Pseudo', value: profile?.display_name || '—' },
                { label: 'Email', value: user.email || '—' },
                { label: 'Membre depuis', value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('fr-FR') : '—' },
                { label: 'Newsletter', value: profile?.is_in_newsletter ? 'Abonné(e)' : 'Non abonné(e)' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <dt className="text-sm font-semibold text-gray-500">{label}</dt>
                  <dd className="text-sm text-festival-dark">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      )}

      {activeTab === 'favoris' && (
        <section aria-labelledby="favoris-title">
          <h2 id="favoris-title" className="text-xl font-bold text-festival-dark mb-6">
            Mes stands favoris ❤️
          </h2>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favorites.map((fav) => (
                <article key={fav.id} className="card">
                  <h3 className="font-bold">{fav.exhibitors?.name || '—'}</h3>
                  <span className="text-xs text-purple-600 font-semibold">{fav.exhibitors?.category}</span>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{fav.exhibitors?.description}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <p className="text-4xl mb-3">❤️</p>
              <p className="text-gray-500">Aucun favori pour l'instant.</p>
              <p className="text-sm text-gray-400 mt-1">Parcourez les stands et ajoutez vos préférés !</p>
            </div>
          )}
        </section>
      )}

      {activeTab === 'tampon' && (
        <section aria-labelledby="tampon-title">
          <h2 id="tampon-title" className="text-xl font-bold text-festival-dark mb-4">
            Carte tampon 🎯
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Faites tamponner votre carte à chaque stand pour compléter votre collection !
          </p>

          <div className="card text-center">
            <div className="text-5xl mb-4">
              {stampsCount >= exhibitorsCount && exhibitorsCount > 0 ? '🏆' : '🎯'}
            </div>
            <div className="text-4xl font-extrabold text-primary mb-1">
              {stampsCount} / {exhibitorsCount}
            </div>
            <p className="text-gray-500 text-sm mb-6">stands visités</p>

            {exhibitorsCount > 0 && (
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                  style={{ width: `${Math.min((stampsCount / exhibitorsCount) * 100, 100)}%` }}
                />
              </div>
            )}

            {stampCard?.stamp_entries && stampCard.stamp_entries.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-left">
                {stampCard.stamp_entries.map((entry, i) => (
                  <div key={i} className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm">
                    <span className="text-green-600 font-bold">✓</span>{' '}
                    {entry.exhibitors?.name || '—'}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Aucun tampon encore — visitez les stands !</p>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
