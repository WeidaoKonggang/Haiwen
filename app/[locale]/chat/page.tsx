import Link from 'next/link'
import ChatInterface from '@/components/ChatInterface'

export default async function ChatPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const { locale } = await params
  const { q } = await searchParams
  const isZh = locale === 'zh'

  // 尽力获取用户状态（未登录也允许使用，游客可体验 AI 咨询）
  let user: { email?: string | null } | null = null
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // Supabase 未配置，按游客模式继续
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      {/* 游客提示条：鼓励但不阻塞 */}
      {!user && (
        <div className="border-b border-blue-100 bg-blue-50/60 text-blue-900 px-4 py-2 text-xs flex items-center justify-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {isZh
              ? '您正在以游客身份体验 · 回答基于平台知识库并带引用'
              : 'You are using HQ as a guest · Answers are grounded in our knowledge base with citations'}
          </span>
          <span className="hidden sm:inline text-blue-300">|</span>
          <div className="flex items-center gap-2">
            <Link
              href={`/${locale}/register`}
              className="underline hover:no-underline font-medium"
            >
              {isZh ? '免费注册保存对话历史' : 'Register to save your conversations'}
            </Link>
          </div>
        </div>
      )}

      <div className="flex-1 min-h-0">
        <ChatInterface locale={locale} initialQuestion={q ?? undefined} isGuest={!user} />
      </div>
    </div>
  )
}
