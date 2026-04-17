'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function createUserProfile(
  userId: string,
  email: string,
  displayName: string,
  isInNewsletter: boolean
) {
  const admin = createAdminClient()
  const { error } = await admin.from('users').upsert(
    { id: userId, email, display_name: displayName, is_in_newsletter: isInNewsletter },
    { onConflict: 'id' }
  )
  return { error: error?.message ?? null }
}

export async function updateDisplayName(userId: string, displayName: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('users')
    .update({ display_name: displayName })
    .eq('id', userId)
  return { error: error?.message ?? null }
}

export async function updateNewsletter(userId: string, isSubscribed: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('users')
    .update({ is_in_newsletter: isSubscribed })
    .eq('id', userId)
  return { error: error?.message ?? null }
}

export async function registerForEvent(userId: string, eventId: string, guestsCount: number) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('registrations')
    .insert({ user_id: userId, event_id: eventId, guests_count: guestsCount })
  return { error: error?.message ?? null }
}

export async function addFavorite(userId: string, exhibitorId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, exhibitor_id: exhibitorId })
  return { error: error?.message ?? null }
}

export async function deleteFavorite(userId: string, exhibitorId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('exhibitor_id', exhibitorId)
  return { error: error?.message ?? null }
}

export async function removeFavoriteById(favoriteId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('id', favoriteId)
  return { error: error?.message ?? null }
}
