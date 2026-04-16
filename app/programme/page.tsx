import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ExhibitorCard from '@/components/ExhibitorCard'
import ProgrammeFilters from './ProgrammeFilters'

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

  const { data: activeEvent } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .single()

  let query = supabase.from('exhibitors').select('*')
  if (activeEvent) query = query.eq('event_id', activeEvent.id)
  if (category) query = query.eq('category', category)

  const { data: exhibitors } = await query.order('name')

  const { data: allExhibitors } = activeEvent
    ? await supabase.from('exhibitors').select('category').eq('event_id', activeEvent.id)
    : { data: [] }

  const categoriesSet = new Set((allExhibitors || []).map((e: { category: string }) => e.category))
  const categories = Array.from(categoriesSet).filter(Boolean).sort()

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="section-title text-4xl">Programme & Stands 🏟️</h1>
        {activeEvent ? (
          <p className="section-subtitle">
            {new Date(activeEvent.date).toLocaleDateString('fr-FR', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })} · {activeEvent.location}
          </p>
        ) : (
          <p className="section-subtitle">Le programme de la prochaine édition sera bientôt disponible.</p>
        )}
      </header>

      {/* Filters */}
      <ProgrammeFilters categories={categories} activeCategory={category} />

      {/* Exhibitors grid */}
      {exhibitors && exhibitors.length > 0 ? (
        <>
          <p className="text-sm text-gray-500 mb-6">
            {exhibitors.length} stand{exhibitors.length > 1 ? 's' : ''} {category ? `dans "${category}"` : 'au total'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {exhibitors.map((exhibitor) => (
              <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-gray-500">Aucun stand trouvé {category ? `dans cette catégorie` : ''}.</p>
        </div>
      )}
    </div>
  )
}
