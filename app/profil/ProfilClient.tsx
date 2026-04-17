'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import type { AppUser, Event, Registration, Favorite } from '@/lib/types'
import {
  updateDisplayName,
  updateNewsletter,
  registerForEvent,
  removeFavoriteById,
} from '@/app/actions'

interface ProfilClientProps {
  user: User
  profile: AppUser | null
  activeEvent: Event | null
  registration: Registration | null
  favorites: (Favorite & { exhibitors: { name: string; description: string; category: string } | null })[]
  stampCard: { id: string; stamp_entries: { exhibitors: { name: string } | null }[] } | null
  exhibitorsCount: number
}

function memberSince(createdAt: string): string {
  const days = Math.floor((Date.now() - new Date(createdAt).getTime()) / 86_400_000)
  if (days < 1) return "aujourd'hui"
  if (days < 30) return `${days} jour${days > 1 ? 's' : ''}`
  const months = Math.floor(days / 30.44)
  if (months < 12) return `${months} mois`
  const years = Math.floor(months / 12)
  return `${years} an${years > 1 ? 's' : ''}`
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
  const [guests, setGuests] = useState(1)
  const [registering, setRegistering] = useState(false)
  const [regError, setRegError] = useState<string | null>(null)
  const [regSuccess, setRegSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState<'profil' | 'favoris' | 'tampon'>('profil')
  const [localFavorites, setLocalFavorites] = useState(favorites)
  const [displayName, setDisplayName] = useState(profile?.display_name || '')
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(profile?.display_name || '')
  const [savingName, setSavingName] = useState(false)
  const [newsletter, setNewsletter] = useState(profile?.is_in_newsletter ?? false)
  const [savingNewsletter, setSavingNewsletter] = useState(false)
  const [simStamps, setSimStamps] = useState(0)
  const SIM_MAX = 2

  const saveDisplayName = async () => {
    const trimmed = nameInput.trim()
    if (!trimmed || trimmed === displayName) { setEditingName(false); return }
    setSavingName(true)
    const { error } = await updateDisplayName(user.id, trimmed)
    if (!error) {
      setDisplayName(trimmed)
      router.refresh()
    }
    setSavingName(false)
    setEditingName(false)
  }

  const toggleNewsletter = async () => {
    const next = !newsletter
    setNewsletter(next)
    setSavingNewsletter(true)
    await updateNewsletter(user.id, next)
    setSavingNewsletter(false)
  }

  const removeFavorite = async (favoriteId: string) => {
    setLocalFavorites((prev) => prev.filter((f) => f.id !== favoriteId))
    await removeFavoriteById(favoriteId)
  }

  const handleRegister = async () => {
    if (!activeEvent) return
    setRegistering(true)
    setRegError(null)

    const { error } = await registerForEvent(user.id, activeEvent.id, guests)

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
            Bonjour, {displayName || 'aventurier(e)'} ! 👋
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
            <dl className="space-y-1">
              {/* Display name */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <dt className="text-sm font-semibold text-gray-500">Pseudo</dt>
                <dd className="text-sm text-festival-dark">
                  {editingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        autoFocus
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') saveDisplayName(); if (e.key === 'Escape') setEditingName(false) }}
                        className="input-field py-1 text-sm w-36"
                        maxLength={40}
                        aria-label="Nouveau pseudo"
                      />
                      <button onClick={saveDisplayName} disabled={savingName} className="text-xs font-semibold text-primary hover:underline disabled:opacity-50">
                        {savingName ? '…' : 'Sauver'}
                      </button>
                      <button onClick={() => { setEditingName(false); setNameInput(displayName) }} className="text-xs text-gray-400 hover:text-gray-600">
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>{displayName || '—'}</span>
                      <button
                        onClick={() => { setNameInput(displayName); setEditingName(true) }}
                        className="p-1 rounded text-gray-400 hover:text-primary hover:bg-gray-100 transition-colors"
                        aria-label="Modifier le pseudo"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 0110 16.414H8v-2a2 2 0 01.586-1.414z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </dd>
              </div>

              {/* Email (read-only) */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <dt className="text-sm font-semibold text-gray-500">Email</dt>
                <dd className="text-sm text-festival-dark">{user.email || '—'}</dd>
              </div>

              {/* Member since */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <dt className="text-sm font-semibold text-gray-500">Membre depuis</dt>
                <dd className="text-sm text-festival-dark text-right">
                  {profile?.created_at ? (
                    <>
                      <span className="font-medium">{memberSince(profile.created_at)}</span>
                      <span className="block text-xs text-gray-400">
                        {new Date(profile.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </>
                  ) : '—'}
                </dd>
              </div>

              {/* Newsletter */}
              <div className="flex justify-between items-center py-2">
                <dt className="text-sm font-semibold text-gray-500">Newsletter</dt>
                <dd>
                  <button
                    role="switch"
                    aria-checked={newsletter}
                    onClick={toggleNewsletter}
                    disabled={savingNewsletter}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60 ${newsletter ? 'bg-primary' : 'bg-gray-300'}`}
                    aria-label="Abonnement à la newsletter"
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${newsletter ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </dd>
              </div>
            </dl>
          </section>
        </div>
      )}

      {activeTab === 'favoris' && (
        <section aria-labelledby="favoris-title">
          <h2 id="favoris-title" className="text-xl font-bold text-festival-dark mb-6">
            Mes stands favoris ❤️
          </h2>
          {localFavorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {localFavorites.map((fav) => (
                <article key={fav.id} className="card flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-festival-dark leading-tight">{fav.exhibitors?.name || '—'}</h3>
                    <button
                      onClick={() => removeFavorite(fav.id)}
                      className="shrink-0 p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      aria-label={`Retirer ${fav.exhibitors?.name} des favoris`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                  <span className="text-xs text-purple-600 font-semibold">{fav.exhibitors?.category}</span>
                  <p className="text-sm text-gray-600 line-clamp-2">{fav.exhibitors?.description}</p>
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
              {simStamps >= SIM_MAX ? '🏆' : '🎯'}
            </div>
            <div className="text-4xl font-extrabold text-primary mb-1">
              {simStamps} / {SIM_MAX}
            </div>
            <p className="text-gray-500 text-sm mb-4">stands visités</p>

            <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                style={{ width: `${(simStamps / SIM_MAX) * 100}%` }}
              />
            </div>

            <button
              onClick={() => setSimStamps((s) => Math.min(s + 1, SIM_MAX))}
              disabled={simStamps >= SIM_MAX}
              className="btn-primary mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📷 Scanner un QR Code
            </button>

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
