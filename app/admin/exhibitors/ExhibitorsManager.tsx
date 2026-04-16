'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Exhibitor } from '@/lib/types'

const CATEGORIES = ['Sport', 'Santé', 'Culture', 'Social', 'Éducation', 'Autre']

const emptyForm = {
  event_id: '',
  name: '',
  description: '',
  category: 'Sport',
  association_name: '',
  picture_url: '',
}

interface ExhibitorsManagerProps {
  initialExhibitors: Exhibitor[]
  events: { id: string; year: number; location: string }[]
}

export default function ExhibitorsManager({ initialExhibitors, events }: ExhibitorsManagerProps) {
  const supabase = createClient()
  const [exhibitors, setExhibitors] = useState(initialExhibitors)
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filterEvent, setFilterEvent] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      event_id: form.event_id,
      name: form.name,
      description: form.description,
      category: form.category,
      association_name: form.association_name,
      picture_url: form.picture_url,
    }

    if (editId) {
      const { data, error: err } = await supabase
        .from('exhibitors')
        .update(payload)
        .eq('id', editId)
        .select()
        .single()
      if (err) setError(err.message)
      else if (data) setExhibitors(exhibitors.map((ex) => (ex.id === editId ? data : ex)))
    } else {
      const { data, error: err } = await supabase
        .from('exhibitors')
        .insert(payload)
        .select()
        .single()
      if (err) setError(err.message)
      else if (data) setExhibitors([data, ...exhibitors])
    }

    setSaving(false)
    if (!error) {
      setForm(emptyForm)
      setShowForm(false)
      setEditId(null)
    }
  }

  const handleEdit = (ex: Exhibitor) => {
    setForm({
      event_id: ex.event_id,
      name: ex.name,
      description: ex.description,
      category: ex.category,
      association_name: ex.association_name || '',
      picture_url: ex.picture_url || '',
    })
    setEditId(ex.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce stand ?')) return
    const { error: err } = await supabase.from('exhibitors').delete().eq('id', id)
    if (!err) setExhibitors(exhibitors.filter((ex) => ex.id !== id))
  }

  const filtered = filterEvent ? exhibitors.filter((ex) => ex.event_id === filterEvent) : exhibitors

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-3 items-center">
          <select
            value={filterEvent}
            onChange={(e) => setFilterEvent(e.target.value)}
            className="input-field !w-auto"
          >
            <option value="">Toutes les éditions</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>{ev.year} — {ev.location}</option>
            ))}
          </select>
          <p className="text-sm text-gray-500">{filtered.length} stand(s)</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm) }} className="btn-primary">
          + Nouveau stand
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-festival-dark">{editId ? 'Modifier le stand' : 'Nouveau stand'}</h2>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ex-event" className="label">Édition *</label>
              <select id="ex-event" required className="input-field"
                value={form.event_id} onChange={(e) => setForm({ ...form, event_id: e.target.value })}>
                <option value="">Choisir une édition...</option>
                {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.year} — {ev.location}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="ex-name" className="label">Nom du stand *</label>
              <input id="ex-name" type="text" required className="input-field" placeholder="Nom du stand"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label htmlFor="ex-category" className="label">Catégorie *</label>
              <select id="ex-category" required className="input-field"
                value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="ex-asso" className="label">Nom de l'association</label>
              <input id="ex-asso" type="text" className="input-field" placeholder="Nom de l'association"
                value={form.association_name} onChange={(e) => setForm({ ...form, association_name: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="ex-desc" className="label">Description *</label>
              <textarea id="ex-desc" required rows={3} className="input-field resize-none" placeholder="Description du stand..."
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="ex-img" className="label">URL de l'image</label>
              <input id="ex-img" type="url" className="input-field" placeholder="https://..."
                value={form.picture_url} onChange={(e) => setForm({ ...form, picture_url: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
              {saving ? 'Enregistrement...' : editId ? 'Modifier' : 'Créer'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditId(null) }} className="btn-outline">Annuler</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-4 font-semibold text-gray-600">Nom</th>
              <th className="text-left px-4 py-4 font-semibold text-gray-600 hidden md:table-cell">Association</th>
              <th className="text-left px-4 py-4 font-semibold text-gray-600">Catégorie</th>
              <th className="px-4 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="text-center text-gray-400 py-8">Aucun stand</td></tr>
            )}
            {filtered.map((ex) => (
              <tr key={ex.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{ex.name}</td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{ex.association_name || '—'}</td>
                <td className="px-4 py-3">
                  <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded-full">{ex.category}</span>
                </td>
                <td className="px-4 py-3 text-right space-x-3">
                  <button onClick={() => handleEdit(ex)} className="text-primary text-xs font-medium hover:underline">Modifier</button>
                  <button onClick={() => handleDelete(ex.id)} className="text-red-500 text-xs font-medium hover:underline">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
