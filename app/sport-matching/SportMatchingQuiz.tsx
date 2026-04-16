'use client'

import { useState } from 'react'
import matchingData from '@/data/matching.json'
import Link from 'next/link'

interface Question {
  id: number
  text: string
  icon: string
  answers: { id: string; text: string; sports: string[] }[]
}

interface Sport {
  id: string
  name: string
  emoji: string
  description: string
  intensity: string
  environment: string
  category: string
}

const questions: Question[] = matchingData.questions
const sports: Sport[] = matchingData.sports

function computeResults(answers: string[]): Sport[] {
  const scores: Record<string, number> = {}

  for (const answerId of answers) {
    const question = questions.find((q) => q.answers.some((a) => a.id === answerId))
    const answer = question?.answers.find((a) => a.id === answerId)
    if (!answer) continue
    for (const sportId of answer.sports) {
      scores[sportId] = (scores[sportId] || 0) + 1
    }
  }

  return sports
    .map((sport) => ({ sport, score: scores[sport.id] || 0 }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ sport }) => sport)
}

export default function SportMatchingQuiz() {
  const [currentQ, setCurrentQ] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [results, setResults] = useState<Sport[] | null>(null)

  const question = questions[currentQ]
  const progress = ((currentQ) / questions.length) * 100

  const handleAnswer = (answerId: string) => {
    const newAnswers = [...selectedAnswers, answerId]
    if (currentQ < questions.length - 1) {
      setSelectedAnswers(newAnswers)
      setCurrentQ(currentQ + 1)
    } else {
      setResults(computeResults(newAnswers))
    }
  }

  const handleReset = () => {
    setCurrentQ(0)
    setSelectedAnswers([])
    setResults(null)
  }

  if (results) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-4xl mb-3">🏆</p>
          <h2 className="text-2xl font-extrabold text-festival-dark mb-2">Tes sports idéaux !</h2>
          <p className="text-gray-500 text-sm">Basé sur tes réponses — voici nos recommandations</p>
        </div>

        <div className="space-y-4">
          {results.map((sport, idx) => (
            <article key={sport.id} className={`card border-l-4 ${idx === 0 ? 'border-primary' : idx === 1 ? 'border-secondary' : 'border-accent'}`}>
              <div className="flex items-start gap-4">
                <span className="text-5xl">{sport.emoji}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {idx === 0 && <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">⭐ Meilleur match</span>}
                    <h3 className="text-xl font-bold text-festival-dark">{sport.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{sport.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-1 rounded-full">
                      {sport.intensity}
                    </span>
                    <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-full">
                      {sport.environment}
                    </span>
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                      {sport.category}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {results.length === 0 && (
          <div className="card text-center text-gray-500">
            <p>Hmm, les résultats sont peu concluants. Tous les sports peuvent vous convenir !</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button onClick={handleReset} className="btn-outline flex-1 text-center">
            Recommencer le quiz 🔄
          </button>
          <Link href="/programme" className="btn-primary flex-1 text-center">
            Voir les stands sport 🏟️
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Question {currentQ + 1} / {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="card">
        <div className="text-center mb-6">
          <span className="text-5xl">{question.icon}</span>
          <h2 className="text-xl font-bold text-festival-dark mt-3">{question.text}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.answers.map((answer) => (
            <button
              key={answer.id}
              onClick={() => handleAnswer(answer.id)}
              className="p-4 text-left border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-orange-50 transition-all duration-200 font-medium text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {answer.text}
            </button>
          ))}
        </div>
      </div>

      {currentQ > 0 && (
        <button
          onClick={() => {
            setCurrentQ(currentQ - 1)
            setSelectedAnswers(selectedAnswers.slice(0, -1))
          }}
          className="text-sm text-gray-500 hover:text-primary transition-colors"
        >
          ← Question précédente
        </button>
      )}
    </div>
  )
}
