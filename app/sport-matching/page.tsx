import type { Metadata } from 'next'
import SportMatchingQuiz from './SportMatchingQuiz'

export const metadata: Metadata = {
  title: 'Sport Matching — Trouve ton sport idéal',
  description: 'Réponds à quelques questions et découvre quel sport correspond le mieux à ta personnalité et ton mode de vie.',
}

export default function SportMatchingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <header className="text-center mb-10">
        <h1 className="section-title text-4xl">Sport Matching 🎯</h1>
        <p className="section-subtitle text-lg">
          Réponds à {' '}
          <strong>quelques questions</strong>
          {' '} et découvre le sport fait pour toi !
        </p>
        <p className="text-sm text-gray-600">
          Quiz 100% anonyme — aucune donnée enregistrée
        </p>
      </header>
      <SportMatchingQuiz />
    </div>
  )
}
