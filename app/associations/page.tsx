import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: { absolute: "Associations et Partenaires | Solimouv' Festival" },
  description: "Découvrez les associations sportives inclusives partenaires de Solimouv' à Paris engagées pour un sport accessible à tous.",
}

export default async function AssociationsPage() {
  const supabase = await createClient()

  const { data: activeEvent } = await supabase
    .from('events')
    .select('id')
    .eq('is_active', true)
    .single()

  const { data: exhibitors } = activeEvent
    ? await supabase
        .from('exhibitors')
        .select('id, association_name, description, category, picture_url')
        .eq('event_id', activeEvent.id)
        .not('association_name', 'is', null)
        .order('association_name')
    : { data: [] }

  const associations = (exhibitors || []).filter((e) => e.association_name)

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="section-title text-4xl">Associations partenaires 🤝</h1>
        <p className="section-subtitle text-lg max-w-2xl mx-auto">
          Solimouv' réunit des associations engagées pour l'inclusion, le sport et le bien-être
          de toutes les communautés parisiennes.
        </p>
      </header>

      {associations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {associations.map((asso) => (
            <article key={asso.id} className="card flex gap-4 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center text-2xl shrink-0">
                🏛️
              </div>
              <div>
                <h2 className="font-bold text-lg text-festival-dark">{asso.association_name}</h2>
                <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full mb-2">
                  {asso.category}
                </span>
                <p className="text-sm text-gray-600 line-clamp-3">{asso.description}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="card text-center py-16">
          <p className="text-5xl mb-4">🤝</p>
          <h2 className="text-xl font-bold text-festival-dark mb-2">
            Les partenaires arrivent bientôt !
          </h2>
          <p className="text-gray-500">
            La liste des associations partenaires de la prochaine édition sera publiée prochainement.
          </p>
        </div>
      )}

      {/* Become a partner */}
      <section className="mt-16 bg-gradient-to-br from-secondary to-primary text-white rounded-3xl p-8 text-center">
        <h2 className="text-2xl font-extrabold mb-3">Votre association veut participer ? 🚀</h2>
        <p className="text-purple-100 mb-6 max-w-xl mx-auto">
          Rejoignez la communauté Solimouv' et faites découvrir votre activité à des milliers de participants.
        </p>
        <a
          href="mailto:contact@upsport.fr?subject=Partenariat Solimouv'"
          className="btn-primary bg-white !text-secondary hover:bg-purple-50 inline-block"
        >
          Nous contacter
        </a>
      </section>
    </div>
  )
}
