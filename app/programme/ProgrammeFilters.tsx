'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface ProgrammeFiltersProps {
  categories: string[]
  activeCategory?: string
}

export default function ProgrammeFilters({ categories, activeCategory }: ProgrammeFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const setCategory = (cat: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (cat) params.set('category', cat)
    else params.delete('category')
    router.push(`/programme?${params.toString()}`)
  }

  if (categories.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filtrer par catégorie">
      <button
        onClick={() => setCategory(null)}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
          !activeCategory ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-200'
        }`}
        aria-pressed={!activeCategory}
      >
        Tous les stands
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setCategory(cat)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            activeCategory === cat ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-200'
          }`}
          aria-pressed={activeCategory === cat}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
