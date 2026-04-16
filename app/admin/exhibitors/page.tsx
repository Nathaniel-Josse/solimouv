import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ExhibitorsManager from './ExhibitorsManager'

export const metadata: Metadata = { title: 'Stands — Admin' }

export default async function AdminExhibitorsPage() {
  const supabase = await createClient()

  const [{ data: events }, { data: exhibitors }] = await Promise.all([
    supabase.from('events').select('id, year, location').order('year', { ascending: false }),
    supabase.from('exhibitors').select('*').order('name'),
  ])

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-festival-dark mb-8">Stands 🏟️</h1>
      <ExhibitorsManager initialExhibitors={exhibitors || []} events={events || []} />
    </div>
  )
}
