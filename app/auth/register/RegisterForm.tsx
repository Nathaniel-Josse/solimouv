'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function RegisterForm() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newsletter, setNewsletter] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    const supabase = createClient()
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      setLoading(false)
      return
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    })

    if (signUpError) {
      setError(signUpError.message === 'User already registered'
        ? 'Un compte existe déjà avec cet email.'
        : 'Une erreur est survenue. Veuillez réessayer.')
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('users').upsert({
        id: data.user.id,
        email,
        display_name: displayName,
        role: 'user',
        is_in_newsletter: newsletter,
      })
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <span className="text-5xl">✅</span>
        <h2 className="text-xl font-bold text-festival-dark">Inscription réussie !</h2>
        <p className="text-gray-600 text-sm">
          Vérifiez votre boîte email pour confirmer votre compte, puis connectez-vous.
        </p>
        <Link href="/auth/login" className="btn-primary block text-center">
          Se connecter
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {error && (
        <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="display-name" className="label">Prénom ou pseudo *</label>
        <input
          id="display-name"
          type="text"
          autoComplete="name"
          required
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="input-field"
          placeholder="Comment vous appelle-t-on ?"
        />
      </div>

      <div>
        <label htmlFor="email" className="label">Adresse email *</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          placeholder="vous@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="label">Mot de passe *</label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          placeholder="Minimum 8 caractères"
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          id="newsletter"
          type="checkbox"
          checked={newsletter}
          onChange={(e) => setNewsletter(e.target.checked)}
          className="mt-1 h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
        />
        <label htmlFor="newsletter" className="text-sm text-gray-600">
          Je souhaite recevoir les actualités de Solimouv' et d'Up Sport!
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full text-center disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Création du compte...' : 'Créer mon compte'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Déjà un compte ?{' '}
        <Link href="/auth/login" className="text-primary font-semibold hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  )
}
