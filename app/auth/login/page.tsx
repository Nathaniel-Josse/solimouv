import type { Metadata } from 'next'
import { Suspense } from 'react'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Connexion',
  description: 'Connectez-vous à votre compte Solimouv\'.',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🏃</span>
          <h1 className="text-3xl font-extrabold text-festival-dark mt-3">Connexion</h1>
          <p className="text-gray-500 mt-1">Bienvenue sur Solimouv'</p>
        </div>
        <div className="card">
          <Suspense fallback={<div className="text-center text-gray-400 py-4">Chargement...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
