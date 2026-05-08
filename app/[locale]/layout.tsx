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

        {/* ── Endorsement wall (above footer) ── */}
        <section className="bg-white border-t border-gray-100 py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <p className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-5">
              {isZh
                ? '受财新智库 · 中国 ESG30 人论坛资助 · 4 学术顾问 · 11 业界导师 · 15 头部企业网络'
                : 'Funded by Caixin Think Tank & China ESG30 Forum · 4 academic advisors · 11 industry mentors · 15 leading enterprises'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 opacity-70">
              {[
                isZh ? '财新智库' : 'Caixin Think Tank',
                isZh ? 'ESG30 论坛' : 'ESG30 Forum',
                isZh ? '北大光华' : 'Peking U · Guanghua',
                isZh ? '清华 CIDEG' : 'Tsinghua · CIDEG',
                isZh ? '上交国务' : 'SJTU · SIPA',
                isZh ? '港中深' : 'CUHK-SZ',
                'NUS · LKYSPP',
                'SMU',
                'XJTLU',
                isZh ? '字节跳动' : 'ByteDance',
                isZh ? '腾讯' : 'Tencent',
                isZh ? '联想集团' : 'Lenovo',
                isZh ? '蚂蚁集团' : 'Ant Group',
                isZh ? '平安集团' : 'Ping An',
                isZh ? '蔚来' : 'NIO',
                isZh ? '建设银行' : 'CCB',
                isZh ? '易方达' : 'E Fund',
                isZh ? '东方证券' : 'Orient Securities',
                isZh ? '永明金融' : 'Sun Life',
                isZh ? '远景科技' : 'Envision',
                isZh ? '标普全球' : 'S&P Global',
              ].map((label, i) => (
                <span
                  key={i}
                  className="text-xs font-semibold text-gray-500 grayscale hover:grayscale-0 hover:text-gray-800 transition-all whitespace-nowrap"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

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
                  <li><Link href={`/${locale}/chat`} className="hover:text-gray-200 transition-colors">{isZh ? 'AI 智能问答' : 'AI Consulting'}</Link></li>
                  <li><Link href={`/${locale}/policy-db`} className="hover:text-gray-200 transition-colors">{isZh ? '政策数据库' : 'Policy Database'}</Link></li>
                  <li><Link href={`/${locale}/cases`} className="hover:text-gray-200 transition-colors">{isZh ? '案例库' : 'Case Library'}</Link></li>
                  <li><Link href={`/${locale}/trends`} className="hover:text-gray-200 transition-colors">{isZh ? '最新动态' : 'Trends'}</Link></li>
                  <li><Link href={`/${locale}/expert-hall`} className="hover:text-gray-200 transition-colors">{isZh ? '专家大厅' : 'Expert Hall'}</Link></li>
                  <li><Link href={`/${locale}/inbox`} className="hover:text-gray-200 transition-colors">{isZh ? '我的收件箱（NEW）' : 'My Inbox (NEW)'}</Link></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-white text-sm font-medium mb-3">{isZh ? '项目信息' : 'Project'}</h4>
                <ul className="space-y-2 text-xs">
                  <li><Link href={`/${locale}/about`} className="hover:text-gray-200 transition-colors">{isZh ? '关于我们' : 'About Us'}</Link></li>
                  <li><Link href={`/${locale}/validation`} className="hover:text-gray-200 transition-colors">{isZh ? '用户验证证据' : 'User Validation'}</Link></li>
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
            <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-600 space-y-1">
              <div>© 2026 海问 HQ · ENT208TC Session 2 Group 13 · XJTLU Entrepreneur College</div>
              <div className="text-gray-700">Powered by Next.js · Supabase · pgvector · DeepSeek · Zhipu GLM · Tavily</div>
            </div>
          </div>
        </footer>
      </div>
    </NextIntlClientProvider>
  )
}
