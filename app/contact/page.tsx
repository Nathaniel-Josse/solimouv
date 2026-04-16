import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactez l\'association Up Sport! pour toute question sur le festival Solimouv\'.',
}

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="section-title text-4xl">Contact ✉️</h1>
        <p className="section-subtitle text-lg">
          Une question, une suggestion ou envie de nous rejoindre ?
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact info */}
        <section aria-labelledby="info-title">
          <h2 id="info-title" className="text-xl font-bold text-festival-dark mb-6">Nos coordonnées</h2>
          <div className="space-y-4">
            {[
              { icon: '📧', label: 'Email général', value: 'contact@upsport.fr', href: 'mailto:contact@upsport.fr' },
              { icon: '🤝', label: 'Partenariats', value: 'partenariats@upsport.fr', href: 'mailto:partenariats@upsport.fr?subject=Partenariat Solimouv\'' },
              { icon: '🙋', label: 'Bénévolat', value: 'benevoles@upsport.fr', href: 'mailto:benevoles@upsport.fr?subject=Bénévolat Solimouv\'' },
              { icon: '📰', label: 'Presse', value: 'presse@upsport.fr', href: 'mailto:presse@upsport.fr?subject=Demande presse Solimouv\'' },
              { icon: '📍', label: 'Adresse', value: 'Paris, France', href: null },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-primary font-medium hover:underline">
                      {item.value}
                    </a>
                  ) : (
                    <p className="font-medium text-festival-dark">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick contact form */}
        <section aria-labelledby="form-title">
          <h2 id="form-title" className="text-xl font-bold text-festival-dark mb-6">Message rapide</h2>
          <form
            action="mailto:contact@upsport.fr"
            method="get"
            encType="text/plain"
            className="space-y-4"
            aria-label="Formulaire de contact"
          >
            <div>
              <label htmlFor="contact-name" className="label">Votre nom *</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className="input-field"
                placeholder="Prénom Nom"
              />
            </div>
            <div>
              <label htmlFor="contact-subject" className="label">Sujet *</label>
              <select id="contact-subject" name="subject" required className="input-field">
                <option value="">Choisir un sujet...</option>
                <option value="Question générale">Question générale</option>
                <option value="Inscription au festival">Inscription au festival</option>
                <option value="Partenariat">Partenariat</option>
                <option value="Bénévolat">Bénévolat</option>
                <option value="Accessibilité">Accessibilité</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div>
              <label htmlFor="contact-body" className="label">Message *</label>
              <textarea
                id="contact-body"
                name="body"
                required
                rows={5}
                className="input-field resize-none"
                placeholder="Votre message..."
              />
            </div>
            <button type="submit" className="btn-primary w-full text-center">
              Envoyer via email ✉️
            </button>
            <p className="text-xs text-gray-500 text-center">
              Ce formulaire ouvre votre client email.
            </p>
          </form>
        </section>
      </div>
    </div>
  )
}
