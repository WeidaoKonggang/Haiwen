import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('home')

  return (
    <div>
      {/* ── Hero ── */}
      <section className="bg-white pt-24 pb-28 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8 border border-blue-100">
            <span className="w-2 h-2 bg-blue-500 rounded-full inline-block" />
            {t('hero.badge')}
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-5 tracking-tight leading-tight">
            {t('hero.title')}
          </h1>

          <p className="text-xl text-gray-600 mb-3 max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <p className="text-base text-gray-400 mb-10 max-w-xl mx-auto">
            {t('hero.description')}
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href={`/${locale}/chat`}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 text-base shadow-sm"
            >
              {t('hero.startChat')} →
            </Link>
            <Link
              href={`/${locale}/cases`}
              className="border border-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 text-base"
            >
              {t('hero.viewCases')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-gray-50 border-y border-gray-100 py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { num: '8+', label: t('stats.cases') },
            { num: '15+', label: t('stats.countries') },
            { num: '8', label: t('stats.industries') },
            { num: '500+', label: t('stats.users') },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-blue-600 mb-1">{s.num}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{t('features.title')}</h2>
            <p className="text-gray-500">{t('features.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-gray-100 p-8 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('features.ai.title')}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{t('features.ai.desc')}</p>
              <div className="mt-6">
                <Link href={`/${locale}/chat`} className="text-sm text-blue-600 font-medium hover:underline">
                  {locale === 'zh' ? '立即体验 →' : 'Try it now →'}
                </Link>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-gray-100 p-8 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('features.cases.title')}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{t('features.cases.desc')}</p>
              <div className="mt-6">
                <Link href={`/${locale}/cases`} className="text-sm text-blue-600 font-medium hover:underline">
                  {locale === 'zh' ? '浏览案例 →' : 'Browse cases →'}
                </Link>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-gray-100 p-8 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('features.esg.title')}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{t('features.esg.desc')}</p>
              <div className="mt-6">
                <Link href={`/${locale}/chat`} className="text-sm text-blue-600 font-medium hover:underline">
                  {locale === 'zh' ? '咨询ESG →' : 'Consult ESG →'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-blue-600 py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t('cta.title')}</h2>
          <p className="text-blue-100 mb-8">{t('cta.subtitle')}</p>
          <Link
            href={`/${locale}/register`}
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 text-base"
          >
            {t('cta.button')}
          </Link>
        </div>
      </section>
    </div>
  )
}
