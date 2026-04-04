import { getTranslations } from 'next-intl/server'
import CaseLibrary from '@/components/CaseLibrary'

export default async function CasesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('cases')

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-500">{t('subtitle')}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <CaseLibrary locale={locale} />
      </div>
    </div>
  )
}
