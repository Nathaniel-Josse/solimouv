import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import EventsManager from './EventsManager'

export const metadata: Metadata = { title: 'Événements — Admin' }

export default async function AdminEventsPage() {
  const supabase = await createClient()
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('year', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-festival-dark mb-8">Événements 📅</h1>
      <EventsManager initialEvents={events || []} />
    </div>
  )
}
