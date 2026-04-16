import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-festival-dark text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-bold text-xl mb-3">
              <span className="text-2xl">🏃</span>
              <span>Solimouv'</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Festival annuel de l'association Up Sport! — sport, culture et
              inclusion pour tous, sans exception.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Navigation secondaire">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">
              Navigation
            </h2>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Accueil' },
                { href: '/programme', label: 'Programme' },
                { href: '/sport-matching', label: 'Sport Matching' },
                { href: '/associations', label: 'Associations' },
                { href: '/a-propos', label: 'À propos' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">
              Up Sport!
            </h2>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📍 Paris, France</li>
              <li>
                <a
                  href="mailto:contact@upsport.fr"
                  className="hover:text-white transition-colors"
                >
                  contact@upsport.fr
                </a>
              </li>
              <li className="flex gap-3 mt-4">
                <span className="text-gray-500 text-xs">Association loi 1901</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-500">
          <p>© {currentYear} Up Sport! — Tous droits réservés</p>
          <p>
            Fait avec ❤️ pour l'inclusion sportive
          </p>
        </div>
      </div>
    </footer>
  )
}
