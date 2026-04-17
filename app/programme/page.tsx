import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ProgrammeFilters from './ProgrammeFilters'
import ProgrammeClient from './ProgrammeClient'

export const metadata: Metadata = {
  title: { absolute: "Programme et Ateliers | Solimouv' Festival" },
  description: "Consultez le programme des activités sportives gratuites à Paris du festival Solimouv' : ateliers, initiations et événements accessibles à tous.",
}

export default async function ProgrammePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: activeEvent } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .single()

  let query = supabase.from('exhibitors').select('*')
  if (activeEvent) query = query.eq('event_id', activeEvent.id)
  if (category) query = query.eq('category', category)

  const [{ data: exhibitors }, { data: allExhibitors }, { data: favoritesData }] =
    await Promise.all([
      query.order('name'),
      activeEvent
        ? supabase.from('exhibitors').select('category').eq('event_id', activeEvent.id)
        : Promise.resolve({ data: [] }),
      user
        ? supabase.from('favorites').select('exhibitor_id').eq('user_id', user.id)
        : Promise.resolve({ data: [] }),
    ])

  const categoriesSet = new Set((allExhibitors || []).map((e: { category: string }) => e.category))
  const categories = Array.from(categoriesSet).filter(Boolean).sort()

  const favoriteIds = (favoritesData || []).map((f: { exhibitor_id: string }) => f.exhibitor_id)

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="section-title text-4xl">Activités sportives gratuites à Paris</h1>
        {activeEvent ? (
          <>
            <p className="section-subtitle max-w-2xl mx-auto">
              Découvrez toutes les activités sportives gratuites proposées lors du festival Solimouv'. Que vous veniez seul, en famille ou entre amis, explorez un programme conçu pour tous les niveaux, tous les âges et tous les profils. Ici, pas de pression : vous testez, vous découvrez, vous rencontrez.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {new Date(activeEvent.date).toLocaleDateString('fr-FR', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })} · {activeEvent.location}
            </p>
          </>
        ) : (
          <p className="section-subtitle max-w-2xl mx-auto">
            Découvrez toutes les activités sportives gratuites proposées lors du festival Solimouv'. Que vous veniez seul, en famille ou entre amis, explorez un programme conçu pour tous les niveaux, tous les âges et tous les profils. Ici, pas de pression : vous testez, vous découvrez, vous rencontrez.
          </p>
        )}
      </header>

      {/* Filters */}
      <ProgrammeFilters categories={categories} activeCategory={category} />

      {/* Exhibitors grid */}
      {exhibitors && exhibitors.length > 0 ? (
        <ProgrammeClient
          exhibitors={exhibitors}
          initialFavoriteIds={favoriteIds}
          userId={user?.id ?? null}
          count={exhibitors.length}
          category={category}
        />
      ) : (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-gray-600 font-medium mb-2">Aucune activité trouvée {category ? `dans cette catégorie` : ''}.</p>
          <p className="text-sm text-gray-600">Le programme de la prochaine édition sera bientôt disponible.</p>
        </div>
      )}
    </div>
  )
}
