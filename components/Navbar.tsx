'use client'

import { useState, useRef, useEffect } from 'react'
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
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  // close dropdown on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const isActive = (path: string) =>
    pathname === `/${locale}${path}` || (path !== '' && pathname.startsWith(`/${locale}${path}/`))

  const isAnyActive = (paths: string[]) => paths.some((p) => isActive(p))

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

  // 简化导航：5 个一级项（含 2 个下拉），不含登录态时再加 1 个 CTA 按钮
  const guestNav: Array<
    | { type: 'link'; href: string; label: string }
    | { type: 'dropdown'; key: string; label: string; items: { href: string; label: string; desc?: string }[] }
  > = [
    { type: 'link', href: '', label: t('home') },
    { type: 'link', href: '/chat', label: t('chat') },
    {
      type: 'dropdown',
      key: 'knowledge',
      label: locale === 'zh' ? '政策与案例' : 'Policy & Cases',
      items: [
        { href: '/policy-db', label: t('policyDb'), desc: locale === 'zh' ? '全球 30+ 国家 AI 监管 / ESG 标准' : 'AI regulation & ESG standards across 30+ countries' },
        { href: '/cases', label: t('cases'), desc: locale === 'zh' ? '中国 AI 企业出海实战案例库' : 'Real Chinese AI go-global case library' },
        { href: '/trends', label: t('trends'), desc: locale === 'zh' ? '周更 Agent 自动采集的全球监管动态' : 'Auto-curated global regulatory updates (weekly agent)' },
      ],
    },
    {
      type: 'dropdown',
      key: 'resources',
      label: locale === 'zh' ? '资源生态' : 'Resources',
      items: [
        { href: '/expert-hall', label: t('expertHall'), desc: locale === 'zh' ? '出海合规 / ESG / 跨境税务专家' : 'Globalisation, ESG and cross-border tax experts' },
        { href: '/resource-center', label: locale === 'zh' ? '资源对接中心' : 'Resource Center', desc: locale === 'zh' ? '海外律所 / 会计师 / 服务商' : 'Overseas law firms, accountants and service providers' },
        { href: '/inbox', label: locale === 'zh' ? '我的收件箱（NEW）' : 'My Inbox (NEW)', desc: locale === 'zh' ? 'APP 推送一键同步到网页' : 'One-tap APP→Web sync' },
      ],
    },
    { type: 'link', href: '/validation', label: t('validation') },
    { type: 'link', href: '/about', label: t('about') },
  ]

  // 登录用户：进入控制台主路径
  const userNav: Array<
    | { type: 'link'; href: string; label: string }
    | { type: 'dropdown'; key: string; label: string; items: { href: string; label: string; desc?: string }[] }
  > = [
    { type: 'link', href: '/dashboard', label: t('dashboard') },
    { type: 'link', href: '/ai-chat', label: t('chat') },
    {
      type: 'dropdown',
      key: 'knowledge',
      label: locale === 'zh' ? '政策与案例' : 'Policy & Cases',
      items: [
        { href: '/policy-db', label: t('policyDb') },
        { href: '/cases', label: t('cases') },
        { href: '/trends', label: t('trends') },
      ],
    },
    { type: 'link', href: '/inbox', label: locale === 'zh' ? '收件箱' : 'Inbox' },
    { type: 'link', href: '/validation', label: t('validation') },
  ]

  const navItems = user ? userNav : guestNav

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">HQ</span>
            </div>
            <span className="font-bold text-gray-900 text-base">海问</span>
            <span className="hidden sm:inline text-xs text-gray-400 font-normal border-l border-gray-200 pl-2.5">
              {locale === 'zh' ? 'AI出海·ESG决策' : 'AI Globalisation · ESG'}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div ref={menuRef} className="hidden md:flex items-center gap-1 lg:gap-2 relative">
            {navItems.map((item) => {
              if (item.type === 'link') {
                const active = isActive(item.href || '/')
                return (
                  <Link
                    key={item.href}
                    href={`/${locale}${item.href}`}
                    className={`text-sm font-medium px-2 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                      active ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              }
              const opened = openMenu === item.key
              const anyActive = isAnyActive(item.items.map((i) => i.href))
              return (
                <div key={item.key} className="relative">
                  <button
                    onClick={() => setOpenMenu(opened ? null : item.key)}
                    className={`text-sm font-medium px-2 py-1.5 rounded-md inline-flex items-center gap-1 whitespace-nowrap transition-colors ${
                      anyActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                    <svg
                      className={`w-3 h-3 transition-transform ${opened ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {opened && (
                    <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-50">
                      {item.items.map((sub) => (
                        <Link
                          key={sub.href}
                          href={`/${locale}${sub.href}`}
                          onClick={() => setOpenMenu(null)}
                          className="block px-3 py-2.5 rounded-lg hover:bg-gray-50"
                        >
                          <p className="text-sm font-medium text-gray-900">{sub.label}</p>
                          {sub.desc && (
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{sub.desc}</p>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher locale={locale} />

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 max-w-[120px] truncate hidden lg:block">
                  {user.email}
                </span>
                <Link
                  href={`/${locale}/enterprise-center`}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  {locale === 'zh' ? '企业中心' : 'Enterprise'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-800 font-medium"
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
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
          {navItems.map((item) => {
            if (item.type === 'link') {
              return (
                <Link
                  key={item.href}
                  href={`/${locale}${item.href}`}
                  onClick={() => setMobileOpen(false)}
                  className={`block text-sm font-medium py-2.5 px-3 rounded-lg ${
                    isActive(item.href || '/') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              )
            }
            return (
              <div key={item.key} className="py-1">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1">
                  {item.label}
                </p>
                {item.items.map((sub) => (
                  <Link
                    key={sub.href}
                    href={`/${locale}${sub.href}`}
                    onClick={() => setMobileOpen(false)}
                    className={`block text-sm py-2 px-3 rounded-lg ${
                      isActive(sub.href) ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            )
          })}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
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
