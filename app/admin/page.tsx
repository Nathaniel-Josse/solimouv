import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Tableau de bord — Admin',
}

export default async function AdminPage() {
  const supabase = await createClient()

  const [
    { count: usersCount },
    { count: exhibitorsCount },
    { count: registrationsCount },
    { data: events },
  ] = await Promise.all([
    supabase.from('users').select('id', { count: 'exact', head: true }),
    supabase.from('exhibitors').select('id', { count: 'exact', head: true }),
    supabase.from('registrations').select('id', { count: 'exact', head: true }),
    supabase.from('events').select('*').order('year', { ascending: false }),
  ])

  const stats = [
    { label: 'Utilisateurs', value: usersCount || 0, icon: '👥', color: 'bg-blue-50 text-blue-700' },
    { label: 'Stands', value: exhibitorsCount || 0, icon: '🏟️', color: 'bg-orange-50 text-orange-700' },
    { label: 'Inscriptions', value: registrationsCount || 0, icon: '🎟️', color: 'bg-green-50 text-green-700' },
    { label: 'Éditions', value: events?.length || 0, icon: '📅', color: 'bg-purple-50 text-purple-700' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-festival-dark mb-8">Tableau de bord</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className={`${stat.color} rounded-2xl p-5`}>
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-extrabold">{stat.value}</div>
            <div className="text-sm font-medium mt-1 opacity-80">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-festival-dark mb-4">Actions rapides</h2>
          <div className="flex flex-col gap-3">
            <Link href="/admin/events" className="btn-outline text-center">
              📅 Gérer les événements
            </Link>
            <Link href="/admin/exhibitors" className="btn-primary text-center">
              🏟️ Gérer les stands
            </Link>
          </div>
        </section>

        {/* Editions list */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-festival-dark mb-4">Éditions</h2>
          {events && events.length > 0 ? (
            <ul className="space-y-2">
              {events.map((event) => (
                <li key={event.id} className="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                  <span className="font-medium">{event.year} — {event.location}</span>
                  {event.is_active ? (
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">Active</span>
                  ) : (
                    <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">Passée</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Aucune édition créée.</p>
          )}
        </section>
      </div>
    </div>
  )
}
