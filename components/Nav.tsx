'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import Logo from './Logo'

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/programme', label: 'Programme' },
  { href: '/sport-matching', label: 'Sport Matching' },
  { href: '/associations', label: 'Associations' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setIsOpen(false)
  }

  return (
    <header className="bg-festival-dark sticky top-0 z-50">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        aria-label="Navigation principale"
      >
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" aria-label="Solimouv' — Accueil">
            <Logo height={36} textColor="#ffffff" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-primary'
                    : 'text-gray-400 hover:text-white'
                }`}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: social + auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Social icons */}
            <a
              href="https://www.instagram.com/upsport.paris/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Up Sport!"
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              <Image src="/icons/instagram.svg" alt="Instagram" width={28} height={28} />
            </a>
            <a
              href="https://www.facebook.com/upsport.paris/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook Up Sport!"
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              <Image src="/icons/facebook.svg" alt="Facebook" width={28} height={28} />
            </a>

            {/* Auth */}
            {user ? (
              <>
                <Link
                  href="/profil"
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Mon profil
                </Link>
                <button
                  onClick={handleSignOut}
                  className="btn-outline !py-2 !px-4 text-sm !text-white !border-white hover:!bg-white hover:!text-festival-dark"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  Connexion
                </Link>
                <Link href="/auth/register" className="btn-primary !py-2 !px-4 text-sm">
                  Inscription
                </Link>
              </>
            )}
          </div>

          {/* Mobile right: social + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <a href="https://www.instagram.com/upsport.paris/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="opacity-80 hover:opacity-100">
              <Image src="/icons/instagram.svg" alt="Instagram" width={24} height={24} />
            </a>
            <a href="https://www.facebook.com/upsport.paris/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="opacity-80 hover:opacity-100">
              <Image src="/icons/facebook.svg" alt="Facebook" width={24} height={24} />
            </a>
            <button
              className="p-2 rounded-lg text-gray-400 hover:text-white"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-800 mt-2 pt-4">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'text-primary bg-white/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  aria-current={pathname === link.href ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-gray-800 mt-2 pt-2 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link
                      href="/profil"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white"
                    >
                      Mon profil
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="btn-outline text-sm text-left px-4 py-3 !text-white !border-white hover:!bg-white hover:!text-festival-dark"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setIsOpen(false)}
                      className="btn-outline text-center !text-white !border-white hover:!bg-white hover:!text-festival-dark"
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setIsOpen(false)}
                      className="btn-primary text-center"
                    >
                      Inscription
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
