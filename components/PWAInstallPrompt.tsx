'use client'

import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('pwa-prompt-dismissed')
    if (stored) setDismissed(true)

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    if (choice.outcome === 'accepted') {
      setDeferredPrompt(null)
    }
  }

  const handleDismiss = () => {
    sessionStorage.setItem('pwa-prompt-dismissed', '1')
    setDismissed(true)
  }

  if (!deferredPrompt || dismissed) return null

  return (
    <div
      className="pwa-banner fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm bg-festival-dark text-white rounded-2xl shadow-2xl p-4 z-50 flex items-start gap-3"
      role="dialog"
      aria-label="Installer l'application"
    >
      <span className="text-3xl">📱</span>
      <div className="flex-1">
        <p className="font-semibold text-sm">Installer Solimouv'</p>
        <p className="text-sm text-gray-300 mt-1">
          Ajoutez l'appli sur votre écran d'accueil pour un accès rapide !
        </p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleInstall}
            className="bg-primary text-white text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Installer
          </button>
          <button
            onClick={handleDismiss}
            className="text-gray-400 text-sm font-medium px-3 py-1.5 rounded-lg hover:text-white transition-colors"
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>
  )
}
