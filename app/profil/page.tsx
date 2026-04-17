import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import ProfilClient from './ProfilClient'

export const metadata: Metadata = {
  title: 'Mon profil',
  description: 'Gérez votre profil, vos favoris et votre carte tampon Solimouv\'.',
}

export default async function ProfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?redirectTo=/profil')

  const [{ data: rawProfile }, { data: activeEvent }] = await Promise.all([
    supabase.from('users').select('*').eq('id', user.id).single(),
    supabase.from('events').select('*').eq('is_active', true).single(),
  ])

  let profile = rawProfile
  if (!profile && user.email) {
    const admin = createAdminClient()
    await admin.from('users').upsert(
      {
        id: user.id,
        email: user.email,
        display_name: user.user_metadata?.display_name || user.email.split('@')[0],
      },
      { onConflict: 'id' }
    )
    const { data: created } = await supabase.from('users').select('*').eq('id', user.id).single()
    profile = created
  }

  const [{ data: registration }, { data: favorites }, { data: stampCard }] =
    await Promise.all([
      activeEvent
        ? supabase.from('registrations').select('*').eq('user_id', user.id).eq('event_id', activeEvent.id).single()
        : Promise.resolve({ data: null }),
      supabase.from('favorites').select('*, exhibitors(*)').eq('user_id', user.id),
      activeEvent
        ? supabase.from('stamp_cards').select('*, stamp_entries(*, exhibitors(name))').eq('user_id', user.id).eq('event_id', activeEvent.id).single()
        : Promise.resolve({ data: null }),
    ])

  const exhibitorsCount = activeEvent
    ? (await supabase.from('exhibitors').select('id', { count: 'exact', head: true }).eq('event_id', activeEvent.id)).count || 0
    : 0

  return (
    <ProfilClient
      user={user}
      profile={profile}
      activeEvent={activeEvent}
      registration={registration}
      favorites={favorites || []}
      stampCard={stampCard}
      exhibitorsCount={exhibitorsCount}
    />
  )
}
