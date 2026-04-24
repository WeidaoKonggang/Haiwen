import Link from 'next/link'
import { notFound } from 'next/navigation'
import { casesData } from '@/lib/cases-data'

export default async function CaseDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params
  const isZh = locale === 'zh'

  const caseItem = casesData.find((c) => c.id === id)
  if (!caseItem) notFound()

  const company = isZh ? caseItem.company : caseItem.companyEn
  const industry = isZh ? caseItem.industry : caseItem.industryEn
  const region = isZh ? caseItem.region : caseItem.regionEn
  const challenge = isZh ? caseItem.challenge : caseItem.challengeEn
  const solution = isZh ? caseItem.solution : caseItem.solutionEn
  const esgImpact = isZh ? caseItem.esgImpact : caseItem.esgImpactEn
  const tags = isZh ? caseItem.tags : caseItem.tagsEn

  const relatedCases = casesData.filter((c) => c.id !== id && (c.region === caseItem.region || c.industry === caseItem.industry)).slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <Link href={`/${locale}/cases`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {isZh ? '返回案例库' : 'Back to Case Library'}
          </Link>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0"
              style={{ backgroundColor: caseItem.color }}>
              {caseItem.abbr}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{company}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-400 mt-0.5">
                <span>{industry}</span>
                <span>·</span>
                <span>{region}</span>
                <span>·</span>
                <span>{caseItem.year}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag) => (
              <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">{tag}</span>
            ))}
            <span className="bg-green-50 text-green-700 border border-green-200 text-xs px-3 py-1 rounded-full font-medium">
              ESG {caseItem.esgCategory}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Challenge */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-gray-900">{isZh ? '核心挑战' : 'Key Challenge'}</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{challenge}</p>
          </div>

          {/* Solution */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-gray-900">{isZh ? 'AI解决方案' : 'AI Solution'}</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{solution}</p>
          </div>

          {/* ESG Impact */}
          <div className="bg-green-50 rounded-2xl border border-green-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-green-800">{isZh ? 'ESG影响与成果' : 'ESG Impact & Outcomes'}</h2>
            </div>
            <p className="text-sm text-green-700 leading-relaxed">{esgImpact}</p>
          </div>

          {/* Key Lessons */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">{isZh ? '经验总结与启示' : 'Key Lessons & Insights'}</h2>
            <div className="space-y-3">
              {[
                isZh ? '充分的本地化调研是成功出海的基础，需要深入了解目标市场的文化差异和监管要求' : 'Thorough local market research is the foundation of successful globalization',
                isZh ? '合规体系建设应先于业务扩张，避免后期补救带来的高额成本和声誉风险' : 'Compliance system setup should precede business expansion to avoid costly remediation',
                isZh ? 'ESG管理能力是获得海外合作伙伴和监管机构信任的重要资产' : 'ESG management capability is a key asset for gaining trust from overseas partners and regulators',
              ].map((lesson, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-sm text-gray-600 leading-relaxed">{lesson}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Case Info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">{isZh ? '案例信息' : 'Case Info'}</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">{isZh ? '企业' : 'Company'}</span>
                <span className="text-gray-700 font-medium">{company}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{isZh ? '行业' : 'Industry'}</span>
                <span className="text-gray-700">{industry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{isZh ? '出海地区' : 'Region'}</span>
                <span className="text-gray-700">{region}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{isZh ? '年份' : 'Year'}</span>
                <span className="text-gray-700">{caseItem.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{isZh ? 'ESG类别' : 'ESG Type'}</span>
                <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded-full text-xs">{caseItem.esgCategory}</span>
              </div>
            </div>
          </div>

          {/* Ask AI about this case */}
          <div className="bg-blue-600 rounded-2xl p-5 text-white">
            <h3 className="text-sm font-semibold mb-2">{isZh ? '基于此案例咨询AI' : 'Ask AI Based on This Case'}</h3>
            <p className="text-xs text-blue-100 mb-3 leading-relaxed">
              {isZh ? `想了解${company}的出海经验如何应用到您的业务？向海问AI详细咨询` : `Want to apply ${company}'s experience to your business? Ask HQ AI`}
            </p>
            <Link href={`/${locale}/ai-chat`}
              className="inline-block w-full text-center text-sm bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium">
              {isZh ? '向AI咨询 →' : 'Ask AI →'}
            </Link>
          </div>

          {/* Related Cases */}
          {relatedCases.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">{isZh ? '相关案例' : 'Related Cases'}</h3>
              <div className="space-y-3">
                {relatedCases.map((related) => (
                  <Link key={related.id} href={`/${locale}/cases/${related.id}`} className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ backgroundColor: related.color }}>
                      {related.abbr}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-700 group-hover:text-blue-600 truncate transition-colors">
                        {isZh ? related.company : related.companyEn}
                      </p>
                      <p className="text-[10px] text-gray-400">{isZh ? related.region : related.regionEn}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
