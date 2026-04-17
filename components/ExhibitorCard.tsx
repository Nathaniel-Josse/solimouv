'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { Exhibitor } from '@/lib/types'

interface ExhibitorCardProps {
  exhibitor: Exhibitor
  isFavorite?: boolean
  onToggleFavorite?: (id: string) => void
  showFavoriteButton?: boolean
}

const categoryColors: Record<string, string> = {
  sport: 'bg-orange-100 text-orange-700',
  santé: 'bg-green-100 text-green-700',
  culture: 'bg-purple-100 text-purple-700',
  social: 'bg-blue-100 text-blue-700',
  education: 'bg-yellow-100 text-yellow-700',
}

export default function ExhibitorCard({
  exhibitor,
  isFavorite = false,
  onToggleFavorite,
  showFavoriteButton = true,
}: ExhibitorCardProps) {
  const [fav, setFav] = useState(isFavorite)
  const [imgError, setImgError] = useState(false)

  const handleFavorite = () => {
    setFav(!fav)
    onToggleFavorite?.(exhibitor.id)
  }

  const colorClass = categoryColors[exhibitor.category.toLowerCase()] || 'bg-gray-100 text-gray-700'

  return (
    <article className="card flex flex-col gap-4 hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-40 rounded-xl overflow-hidden bg-orange-50">
        {exhibitor.picture_url && !imgError ? (
          <Image
            src={exhibitor.picture_url}
            alt={`Stand ${exhibitor.name}`}
            fill
            className="object-cover"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            🏃
          </div>
        )}
        {showFavoriteButton && (
          <button
            onClick={handleFavorite}
            className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-colors ${
              fav ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-400'
            }`}
            aria-label={fav ? `Retirer ${exhibitor.name} des favoris` : `Ajouter ${exhibitor.name} aux favoris`}
            aria-pressed={fav}
          >
            <svg className="w-4 h-4" fill={fav ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-lg text-festival-dark leading-tight">{exhibitor.name}</h3>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${colorClass}`}>
            {exhibitor.category}
          </span>
        </div>
        {exhibitor.association_name && (
          <p className="text-xs text-gray-500 font-medium">{exhibitor.association_name}</p>
        )}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{exhibitor.description}</p>
      </div>
    </article>
  )
}
