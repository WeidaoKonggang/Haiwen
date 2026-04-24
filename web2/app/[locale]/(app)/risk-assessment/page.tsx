import Link from 'next/link'
import { riskEventData } from '@/lib/mock-data'

export default async function RiskAssessmentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isZh = locale === 'zh'

  const riskDimensions = [
    { id: 'policy', label: isZh ? '政策合规风险' : 'Policy Compliance', score: 68, level: 'medium', color: 'orange' },
    { id: 'data', label: isZh ? '数据安全风险' : 'Data Security', score: 72, level: 'medium', color: 'orange' },
    { id: 'esg', label: isZh ? 'ESG违规风险' : 'ESG Violation', score: 82, level: 'low', color: 'green' },
    { id: 'geo', label: isZh ? '地缘政治风险' : 'Geopolitical', score: 45, level: 'high', color: 'red' },
    { id: 'supply', label: isZh ? '供应链风险' : 'Supply Chain', score: 78, level: 'low', color: 'green' },
    { id: 'market', label: isZh ? '市场竞争风险' : 'Market Competition', score: 65, level: 'medium', color: 'orange' },
  ]

  const overallScore = Math.round(riskDimensions.reduce((sum, d) => sum + d.score, 0) / riskDimensions.length)

  const levelConfig: Record<string, { bg: string; text: string; border: string; label: string }> = {
    high: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: isZh ? '高风险' : 'High Risk' },
    medium: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', label: isZh ? '中风险' : 'Medium Risk' },
    low: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: isZh ? '低风险' : 'Low Risk' },
  }

  const barColors: Record<string, string> = { red: 'bg-red-400', orange: 'bg-orange-400', green: 'bg-green-400' }

  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    active: { bg: 'bg-red-50', text: 'text-red-700', label: isZh ? '持续监控' : 'Monitoring' },
    monitoring: { bg: 'bg-orange-50', text: 'text-orange-700', label: isZh ? '关注中' : 'Watch' },
    resolved: { bg: 'bg-gray-50', text: 'text-gray-500', label: isZh ? '已处理' : 'Resolved' },
  }

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{isZh ? '风险智能评估' : 'Risk Assessment'}</h1>
          <p className="text-gray-500 text-sm">{isZh ? '六维度风险模型，实时监控出海合规与经营风险' : 'Six-dimensional risk model, real-time go-global compliance and operational risk monitoring'}</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
            {isZh ? '风险监控设置' : 'Monitor Settings'}
          </button>
          <Link href={`/${locale}/diagnosis/create`}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
            {isZh ? '发起新评估' : 'New Assessment'}
          </Link>
        </div>
      </div>

      {/* Overall Risk Score */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-sm text-gray-500 mb-1">{isZh ? '综合风险指数（100=无风险）' : 'Overall Risk Score (100=No Risk)'}</p>
            <div className="flex items-end gap-3 mb-3">
              <span className="text-5xl font-bold text-gray-900">{overallScore}</span>
              <div className="mb-1">
                <span className="text-sm text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                  {isZh ? '中等风险' : 'Medium Risk'}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              {isZh ? '较上次评估（2024-10-01）提升4分，地缘政治风险持续较高' : 'Up 4 points from last assessment (2024-10-01), geopolitical risk remains elevated'}
            </p>
          </div>

          <div className="space-y-3">
            {riskDimensions.map((dim) => (
              <div key={dim.id} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-24 shrink-0">{dim.label}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className={`${barColors[dim.color]} h-2 rounded-full transition-all`} style={{ width: `${dim.score}%` }} />
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${levelConfig[dim.level].bg} ${levelConfig[dim.level].text} w-14 text-center`}>
                  {dim.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Events */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">{isZh ? '风险事件列表' : 'Risk Events'}</h2>
          <div className="flex gap-2">
            {['all', 'high', 'medium', 'low'].map((level) => (
              <button key={level} className={`text-xs px-3 py-1 rounded-full border transition-colors ${level === 'all' ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                {level === 'all' ? (isZh ? '全部' : 'All') : levelConfig[level]?.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {riskEventData.map((risk) => {
            const lc = levelConfig[risk.level]
            const sc = statusConfig[risk.status]
            return (
              <div key={risk.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${risk.level === 'high' ? 'bg-red-500' : risk.level === 'medium' ? 'bg-orange-500' : 'bg-green-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">{risk.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${lc.bg} ${lc.text} ${lc.border}`}>{lc.label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc.bg} ${sc.text}`}>{sc.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed mb-2">{risk.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs font-medium text-gray-500 mb-1">{isZh ? '潜在影响' : 'Potential Impact'}</p>
                        <p className="text-xs text-gray-700 leading-relaxed">{risk.impact}</p>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-3">
                        <p className="text-xs font-medium text-blue-600 mb-1">{isZh ? '应对建议' : 'Suggested Action'}</p>
                        <p className="text-xs text-blue-700 leading-relaxed">{risk.suggestion}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-xs text-gray-400">{risk.category}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs text-gray-400">{risk.region}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs text-gray-400">{risk.date}</span>
                    </div>
                  </div>
                  <Link href={`/${locale}/ai-chat`}
                    className="shrink-0 text-xs text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 whitespace-nowrap">
                    {isZh ? '咨询AI' : 'Ask AI'}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
