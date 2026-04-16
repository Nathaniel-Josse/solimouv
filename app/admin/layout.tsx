import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const adminLinks = [
  { href: '/admin', label: 'Tableau de bord', icon: '📊' },
  { href: '/admin/events', label: 'Événements', icon: '📅' },
  { href: '/admin/exhibitors', label: 'Stands', icon: '🏟️' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?redirectTo=/admin')

  const { data: profile } = await supabase
    .from('users')
    .select('role, display_name')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin top bar */}
      <div className="bg-festival-dark text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-primary">⚙️ Admin</span>
          <span className="text-gray-400 text-sm">Solimouv' — Back-office</span>
        </div>
        <span className="text-sm text-gray-300">{profile?.display_name}</span>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-56 min-h-screen bg-white shadow-sm p-4 shrink-0" aria-label="Navigation admin">
          <ul className="space-y-1">
            {adminLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-primary transition-colors"
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 pt-4 border-t border-gray-100">
            <Link href="/" className="flex items-center gap-2 text-xs text-gray-400 hover:text-primary">
              ← Retour au site
            </Link>
          </div>
        </nav>

        {/* Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
