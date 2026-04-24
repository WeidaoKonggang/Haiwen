import Link from 'next/link'
import { notFound } from 'next/navigation'
import { policyData } from '@/lib/mock-data'

export default async function PolicyDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params
  const isZh = locale === 'zh'

  const policy = policyData.find((p) => p.id === id)
  if (!policy) notFound()

  const riskColors: Record<string, string> = {
    high: 'bg-red-50 text-red-700 border-red-200',
    medium: 'bg-orange-50 text-orange-700 border-orange-200',
    low: 'bg-green-50 text-green-700 border-green-200',
  }
  const riskLabel: Record<string, string> = {
    high: isZh ? '高风险' : 'High Risk',
    medium: isZh ? '中风险' : 'Medium Risk',
    low: isZh ? '低风险' : 'Low Risk',
  }

  const relatedPolicies = policyData.filter((p) => p.id !== policy.id && (p.country === policy.country || p.type === policy.type)).slice(0, 3)

  const keyPoints = isZh ? policy.keyPoints : policy.keyPointsEn

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button & breadcrumb */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <Link href={`/${locale}/policy-db`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {isZh ? '返回政策数据库' : 'Back to Policy Database'}
          </Link>

          {/* Status badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${riskColors[policy.riskLevel]}`}>
              {riskLabel[policy.riskLevel]}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-700 font-medium">
              {isZh ? '现行有效' : 'In Effect'}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
              {isZh ? policy.country : policy.countryEn}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
              {isZh ? policy.type : policy.typeEn}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {isZh ? policy.title : policy.titleEn}
          </h1>

          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            <span>{isZh ? '发布机构：' : 'Issuing Authority: '}{policy.publishOrg}</span>
            <span>{isZh ? '发布日期：' : 'Published: '}{policy.publishDate}</span>
            <span>{isZh ? '生效日期：' : 'Effective: '}{policy.effectiveDate}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-3">{isZh ? '政策概述' : 'Policy Summary'}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {isZh ? policy.summary : policy.summaryEn}
            </p>
          </div>

          {/* Key Compliance Points */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">{isZh ? '核心合规要点' : 'Key Compliance Points'}</h2>
            <div className="space-y-3">
              {keyPoints.map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action recommendations */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-blue-800 mb-2">{isZh ? '合规行动建议' : 'Compliance Action Recommendations'}</p>
                <p className="text-sm text-blue-700 leading-relaxed">
                  {isZh
                    ? `针对${policy.title}，建议中国AI企业首先评估业务是否落入法规适用范围，重点审查数据处理流程与合规义务，建立对应的合规管理体系，并定期跟踪法规更新动态。如有需要，可使用海问合规诊断功能进行深度评估。`
                    : `For ${policy.titleEn}, we recommend that Chinese AI companies first assess whether their business falls within the regulatory scope, review data processing workflows and compliance obligations, establish a corresponding compliance management system, and regularly monitor regulatory updates.`}
                </p>
                <Link href={`/${locale}/diagnosis/create`}
                  className="inline-block mt-3 text-xs bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
                  {isZh ? '发起合规诊断 →' : 'Start Compliance Diagnosis →'}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Actions */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">{isZh ? '操作' : 'Actions'}</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                {isZh ? '收藏此政策' : 'Bookmark'}
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {isZh ? '订阅更新' : 'Subscribe to Updates'}
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {isZh ? '下载PDF' : 'Download PDF'}
              </button>
            </div>
          </div>

          {/* Related Policies */}
          {relatedPolicies.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">{isZh ? '相关政策推荐' : 'Related Policies'}</h3>
              <div className="space-y-3">
                {relatedPolicies.map((related) => (
                  <Link key={related.id} href={`/${locale}/policy-db/${related.id}`}
                    className="block group">
                    <p className="text-xs text-gray-700 group-hover:text-blue-600 leading-snug mb-0.5 transition-colors">
                      {isZh ? related.title : related.titleEn}
                    </p>
                    <p className="text-[10px] text-gray-400">{isZh ? related.country : related.countryEn} · {isZh ? related.type : related.typeEn}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Ask AI */}
          <div className="bg-blue-600 rounded-2xl p-5 text-white">
            <h3 className="text-sm font-semibold mb-2">{isZh ? '向AI详细咨询' : 'Ask AI for Details'}</h3>
            <p className="text-xs text-blue-100 mb-3 leading-relaxed">
              {isZh ? '不确定如何合规？让海问HQ为您解读政策要点并给出具体行动建议' : 'Not sure how to comply? Let HQ explain key policy points and provide specific action recommendations'}
            </p>
            <Link href={`/${locale}/ai-chat`}
              className="inline-block w-full text-center text-sm bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium">
              {isZh ? '向AI咨询 →' : 'Ask AI →'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
