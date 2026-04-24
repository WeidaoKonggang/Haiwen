'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SideMenuProps {
  locale: string
  userEmail?: string | null
}

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

interface NavSection {
  section: string
  items: NavItem[]
}

function Icon({ d, className = 'w-4 h-4' }: { d: string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  )
}

export default function SideMenu({ locale, userEmail }: SideMenuProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const isActive = (href: string) => {
    const fullPath = `/${locale}${href}`
    return pathname === fullPath || (href !== '/dashboard' && pathname.startsWith(fullPath))
  }

  const toggleSection = (section: string) => {
    setCollapsed((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const navSections: NavSection[] = [
    {
      section: '工作台',
      items: [
        { href: '/dashboard', label: '控制台首页', icon: <Icon d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
        { href: '/ai-chat', label: 'AI智能问答', icon: <Icon d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /> },
      ],
    },
    {
      section: '合规工具',
      items: [
        { href: '/policy-db', label: '政策与ESG数据库', icon: <Icon d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> },
        { href: '/diagnosis', label: '合规资质诊断', icon: <Icon d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /> },
        { href: '/risk-assessment', label: '风险智能评估', icon: <Icon d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /> },
      ],
    },
    {
      section: '出海管理',
      items: [
        { href: '/esg-manage', label: 'ESG全流程管理', icon: <Icon d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
        { href: '/decision-engine', label: '出海决策引擎', icon: <Icon d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /> },
        { href: '/solution-tools', label: '方案工具集', icon: <Icon d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" /> },
        { href: '/dashboard/analysis', label: '数据分析中心', icon: <Icon d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
      ],
    },
    {
      section: '资源生态',
      items: [
        { href: '/cases', label: '案例库', icon: <Icon d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /> },
        { href: '/expert-hall', label: '专家大厅', icon: <Icon d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /> },
        { href: '/resource-center', label: '资源对接中心', icon: <Icon d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /> },
      ],
    },
    {
      section: '企业管理',
      items: [
        { href: '/enterprise-center', label: '企业管理中心', icon: <Icon d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /> },
      ],
    },
  ]

  return (
    <aside className="w-60 shrink-0 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto border-r border-gray-100 bg-gray-50/50 flex flex-col">
      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {navSections.map((sec) => (
          <div key={sec.section} className="mb-1">
            <button
              onClick={() => toggleSection(sec.section)}
              className="flex items-center justify-between w-full px-2 py-1.5 mb-1"
            >
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{sec.section}</span>
              <svg
                className={`w-3 h-3 text-gray-300 transition-transform ${collapsed[sec.section] ? '-rotate-90' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {!collapsed[sec.section] && (
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={`/${locale}${item.href}`}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                        active
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <span className={active ? 'text-blue-600' : 'text-gray-400'}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                      {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User info at bottom */}
      <div className="border-t border-gray-100 px-3 py-3">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-700 font-medium truncate">{userEmail || '企业用户'}</p>
            <p className="text-[10px] text-gray-400">注册用户</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
