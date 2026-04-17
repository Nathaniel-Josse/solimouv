'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ExhibitorCard from '@/components/ExhibitorCard'
import type { Exhibitor } from '@/lib/types'
import { addFavorite, deleteFavorite } from '@/app/actions'

interface ProgrammeClientProps {
  exhibitors: Exhibitor[]
  initialFavoriteIds: string[]
  userId: string | null
  count: number
  category?: string
}

export default function ProgrammeClient({
  exhibitors,
  initialFavoriteIds,
  userId,
  count,
  category,
}: ProgrammeClientProps) {
  const router = useRouter()
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set(initialFavoriteIds))

  const toggleFavorite = async (exhibitorId: string) => {
    if (!userId) {
      router.push('/auth/login?redirectTo=/programme')
      return
    }

    const isFavorited = favoriteIds.has(exhibitorId)

    setFavoriteIds((prev) => {
      const next = new Set(prev)
      if (isFavorited) next.delete(exhibitorId)
      else next.add(exhibitorId)
      return next
    })

    if (isFavorited) {
      await deleteFavorite(userId, exhibitorId)
    } else {
      await addFavorite(userId, exhibitorId)
    }
  }

  return (
    <>
      <p className="text-sm text-gray-600 mb-6">
        {count} stand{count > 1 ? 's' : ''} {category ? `dans "${category}"` : 'au total'}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {exhibitors.map((exhibitor) => (
          <ExhibitorCard
            key={exhibitor.id}
            exhibitor={exhibitor}
            isFavorite={favoriteIds.has(exhibitor.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </>
  )
}
