import type { Metadata } from 'next'
import RegisterForm from './RegisterForm'

export const metadata: Metadata = {
  title: 'Inscription',
  description: 'Créez votre compte Solimouv\' pour vous inscrire au festival et accéder à toutes les fonctionnalités.',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🎉</span>
          <h1 className="text-3xl font-extrabold text-festival-dark mt-3">Crée un compte pour t'inscrire à l'événement !</h1>
          <p className="text-gray-500 mt-1">Rejoignez la communauté Solimouv'</p>
        </div>
        <div className="card">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
