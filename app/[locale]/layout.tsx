import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'

const locales = ['zh', 'en']

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale)) {
    notFound()
  }

  const messages = await getMessages()

  // 尝试获取当前登录用户（Supabase 未配置时静默失败）
  let user = null
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // Supabase 未配置，正常降级
  }

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar locale={locale} user={user} />
        <div className="flex-1">{children}</div>
        <footer className="border-t border-gray-100 py-6 px-4 text-center text-sm text-gray-400">
          {locale === 'zh'
            ? '© 2024 海问 HQ. 保留所有权利。 — 中国AI企业出海与ESG创新的专业决策咨询平台'
            : '© 2024 HQ HaiWen. All rights reserved. — Professional consulting for Chinese AI companies going global.'}
        </footer>
      </div>
    </NextIntlClientProvider>
  )
}
