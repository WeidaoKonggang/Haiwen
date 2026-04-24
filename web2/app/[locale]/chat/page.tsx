import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import ChatInterface from '@/components/ChatInterface'

export default async function ChatPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('chat')

  // 检查登录状态（Supabase 未配置时降级为未登录）
  let user = null
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // Supabase 未配置
  }

  // 未登录时显示引导界面
  if (!user) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t('loginRequired')}</h2>
          <p className="text-gray-500 text-sm mb-6">
            {locale === 'zh'
              ? '登录后即可使用海问HQ的AI出海与ESG专业咨询功能'
              : "Log in to access HQ's professional AI globalization and ESG consulting"}
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href={`/${locale}/login`}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 text-sm"
            >
              {t('loginBtn')}
            </Link>
            <Link
              href={`/${locale}/register`}
              className="border border-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 text-sm"
            >
              {locale === 'zh' ? '免费注册' : 'Sign Up Free'}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: 'calc(100vh - 64px)' }}>
      <ChatInterface locale={locale} />
    </div>
  )
}
