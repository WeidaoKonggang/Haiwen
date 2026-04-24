import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
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

  let user = null
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // Supabase not configured
  }

  const isZh = locale === 'zh'

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar locale={locale} user={user} />
        <div className="flex-1">{children}</div>
        <footer className="bg-gray-900 text-gray-400 py-12 px-4 mt-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
              {/* Brand */}
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-xs">HQ</span>
                  </div>
                  <span className="text-white font-bold">海问 HQ</span>
                </div>
                <p className="text-xs leading-relaxed text-gray-500">
                  {isZh
                    ? '中国AI企业出海与ESG创新的专业决策咨询平台'
                    : 'Professional decision consulting for Chinese AI companies going global'}
                </p>
              </div>

              {/* Product */}
              <div>
                <h4 className="text-white text-sm font-medium mb-3">{isZh ? '产品功能' : 'Products'}</h4>
                <ul className="space-y-2 text-xs">
                  <li><Link href={`/${locale}/ai-chat`} className="hover:text-gray-200 transition-colors">{isZh ? 'AI智能问答' : 'AI Consulting'}</Link></li>
                  <li><Link href={`/${locale}/policy-db`} className="hover:text-gray-200 transition-colors">{isZh ? '政策数据库' : 'Policy Database'}</Link></li>
                  <li><Link href={`/${locale}/cases`} className="hover:text-gray-200 transition-colors">{isZh ? '案例库' : 'Case Library'}</Link></li>
                  <li><Link href={`/${locale}/expert-hall`} className="hover:text-gray-200 transition-colors">{isZh ? '专家大厅' : 'Expert Hall'}</Link></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-white text-sm font-medium mb-3">{isZh ? '公司信息' : 'Company'}</h4>
                <ul className="space-y-2 text-xs">
                  <li><Link href={`/${locale}/about`} className="hover:text-gray-200 transition-colors">{isZh ? '关于我们' : 'About Us'}</Link></li>
                  <li><Link href={`/${locale}/help`} className="hover:text-gray-200 transition-colors">{isZh ? '帮助中心' : 'Help Center'}</Link></li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-white text-sm font-medium mb-3">{isZh ? '法律条款' : 'Legal'}</h4>
                <ul className="space-y-2 text-xs">
                  <li><Link href={`/${locale}/agreement/privacy`} className="hover:text-gray-200 transition-colors">{isZh ? '隐私政策' : 'Privacy Policy'}</Link></li>
                  <li><Link href={`/${locale}/agreement/terms`} className="hover:text-gray-200 transition-colors">{isZh ? '服务协议' : 'Terms of Service'}</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-600">
              © 2024 海问 HQ. All rights reserved. — Powered by DeepSeek AI
            </div>
          </div>
        </footer>
      </div>
    </NextIntlClientProvider>
  )
}
