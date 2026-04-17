import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: "Contact | Solimouv' Festival" },
  description: "Contactez l'équipe Solimouv' pour toute question sur votre inscription, vos activités ou le festival.",
}

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="section-title text-4xl">Contactez-nous</h1>
        <p className="section-subtitle text-lg max-w-xl mx-auto">
          Une question sur le festival Solimouv' ? Notre équipe est à votre écoute pour vous accompagner avant, pendant ou après l'événement.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact info */}
        <section aria-labelledby="info-title">
          <h2 id="info-title" className="text-xl font-bold text-festival-dark mb-4">Une question sur votre participation ?</h2>
          <p className="text-sm text-gray-600 mb-6">
            Vous pouvez nous contacter pour une question sur votre inscription, un problème lié à votre compte, des informations sur les activités ou une demande particulière.
          </p>
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
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{item.label}</p>
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

          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <p className="text-sm font-semibold text-festival-dark mb-1">Besoin d'aide avec votre compte ?</p>
            <p className="text-sm text-gray-600 mb-3">Gérez vos activités, consultez votre programme et retrouvez toutes vos informations en un seul endroit.</p>
            <Link href="/profil" className="text-sm font-semibold text-primary underline">
              Accéder à mon compte →
            </Link>
          </div>
        </section>

        {/* Quick contact form */}
        <section aria-labelledby="form-title">
          <h2 id="form-title" className="text-xl font-bold text-festival-dark mb-4">Formulaire de contact</h2>
          <p className="text-sm text-gray-600 mb-6">Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.</p>
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
              Envoyer ma demande ✉️
            </button>
            <p className="text-sm text-gray-600 text-center">
              Ce formulaire ouvre votre client email. Nous faisons le maximum pour vous répondre rapidement.
            </p>
          </form>
        </section>
      </div>
    </div>
  )
}
