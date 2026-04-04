'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from './LanguageSwitcher'
import { createClient } from '@/lib/supabase/client'

interface NavbarProps {
  locale: string
  user: { email?: string | null } | null
}

export default function Navbar({ locale, user }: NavbarProps) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path: string) =>
    pathname === `/${locale}${path}` || pathname.startsWith(`/${locale}${path}/`)

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push(`/${locale}`)
      router.refresh()
    } catch {
      // Supabase not configured
    }
  }

  const navLinks = [
    { href: '', label: t('home') },
    { href: '/chat', label: t('chat') },
    { href: '/cases', label: t('cases') },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">HQ</span>
            </div>
            <span className="font-bold text-gray-900 text-base">海问</span>
            <span className="hidden sm:inline text-xs text-gray-400 font-normal border-l border-gray-200 pl-2.5 ml-0.5">
              AI出海·ESG咨询
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href || '/')
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher locale={locale} />

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 max-w-[120px] truncate">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href={`/${locale}/login`}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium px-3 py-1.5"
                >
                  {t('login')}
                </Link>
                <Link
                  href={`/${locale}/register`}
                  className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={`/${locale}${link.href}`}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm font-medium py-2 ${
                isActive(link.href || '/') ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <LanguageSwitcher locale={locale} />
            {user ? (
              <button onClick={handleLogout} className="text-sm text-gray-600 font-medium">
                {t('logout')}
              </button>
            ) : (
              <div className="flex gap-2">
                <Link href={`/${locale}/login`} onClick={() => setMobileOpen(false)}
                  className="text-sm text-gray-600 font-medium px-3 py-1.5 border border-gray-200 rounded-lg">
                  {t('login')}
                </Link>
                <Link href={`/${locale}/register`} onClick={() => setMobileOpen(false)}
                  className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium">
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
