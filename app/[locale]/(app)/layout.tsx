import { redirect } from 'next/navigation'
import SideMenu from '@/components/SideMenu'

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  let user = null
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    user = session?.user
  } catch (error) {
    // Supabase not configured or token expired — redirect to login
  }

  if (!user) {
    redirect(`/${locale}/login`)
  }

  return (
    <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <SideMenu locale={locale} userEmail={user?.email} />
      <main className="flex-1 min-w-0 overflow-y-auto bg-gray-50/30">
        {children}
      </main>
    </div>
  )
}
