'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Event } from '@/lib/types'

interface EventsManagerProps {
  initialEvents: Event[]
}

const emptyForm = { year: new Date().getFullYear() + 1, date: '', location: '' }

export default function EventsManager({ initialEvents }: EventsManagerProps) {
  const router = useRouter()
  const supabase = createClient()
  const [events, setEvents] = useState(initialEvents)
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = () => router.refresh()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const { data, error: err } = await supabase
      .from('events')
      .insert({ year: form.year, date: form.date, location: form.location, is_active: false })
      .select()
      .single()

    if (err) {
      setError(err.message)
    } else if (data) {
      setEvents([data, ...events])
      setForm(emptyForm)
      setShowForm(false)
    }
    setSaving(false)
  }

  const toggleActive = async (event: Event) => {
    const { error: err } = await supabase
      .from('events')
      .update({ is_active: !event.is_active })
      .eq('id', event.id)

    if (!err) {
      setEvents(events.map((e) => ({ ...e, is_active: e.id === event.id ? !e.is_active : false })))
      refresh()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet événement ? Cette action est irréversible.')) return
    const { error: err } = await supabase.from('events').delete().eq('id', id)
    if (!err) setEvents(events.filter((e) => e.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{events.length} édition(s)</p>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          + Nouvelle édition
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-festival-dark">Nouvelle édition</h2>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="year" className="label">Année</label>
              <input id="year" type="number" min={2020} max={2040} required className="input-field"
                value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} />
            </div>
            <div>
              <label htmlFor="date" className="label">Date</label>
              <input id="date" type="date" required className="input-field"
                value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label htmlFor="location" className="label">Lieu</label>
              <input id="location" type="text" required className="input-field" placeholder="Parc de la Villette, Paris"
                value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
              {saving ? 'Création...' : 'Créer'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline">
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-6 py-4 font-semibold text-gray-600">Année</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-600">Date</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-600">Lieu</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-600">Statut</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-8">Aucune édition</td>
              </tr>
            )}
            {events.map((event) => (
              <tr key={event.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-6 py-4 font-bold">{event.year}</td>
                <td className="px-6 py-4">{new Date(event.date).toLocaleDateString('fr-FR')}</td>
                <td className="px-6 py-4">{event.location}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleActive(event)}
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      event.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {event.is_active ? '● Active' : '○ Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="text-red-500 hover:text-red-700 text-xs font-medium"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
