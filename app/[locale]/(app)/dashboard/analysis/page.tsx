import Link from 'next/link'

export default async function DashboardAnalysisPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isZh = locale === 'zh'

  const kpis = [
    { label: isZh ? '本月合规操作次数' : 'Compliance Actions This Month', value: '47', change: '+12', up: true },
    { label: isZh ? 'AI咨询总次数' : 'Total AI Consultations', value: '128', change: '+23', up: true },
    { label: isZh ? '风险事件处理率' : 'Risk Event Resolution Rate', value: '76%', change: '+5%', up: true },
    { label: isZh ? '平均响应时效' : 'Avg. Response Time', value: '1.2天', change: '-0.3天', up: true },
  ]

  const complianceMonths = ['7月', '8月', '9月', '10月', '11月', '12月']
  const complianceScores = [58, 61, 64, 68, 71, 74]

  const riskTrend = [
    { month: isZh ? '10月' : 'Oct', high: 3, medium: 4, low: 2 },
    { month: isZh ? '11月' : 'Nov', high: 2, medium: 5, low: 3 },
    { month: isZh ? '12月' : 'Dec', high: 1, medium: 3, low: 4 },
  ]

  const marketCoverage = [
    { market: isZh ? '欧盟' : 'EU', covered: 72, color: 'bg-blue-500' },
    { market: isZh ? '新加坡' : 'Singapore', covered: 88, color: 'bg-green-500' },
    { market: isZh ? '日本' : 'Japan', covered: 65, color: 'bg-purple-500' },
    { market: isZh ? '英国' : 'UK', covered: 58, color: 'bg-orange-500' },
    { market: isZh ? '阿联酋' : 'UAE', covered: 45, color: 'bg-teal-500' },
  ]

  const topActivities = [
    { action: isZh ? '完成EU AI Act合规诊断' : 'Completed EU AI Act compliance diagnosis', time: '2024-12-01 14:32', type: 'diagnosis' },
    { action: isZh ? 'AI咨询：GDPR数据本地化要求' : 'AI consultation: GDPR data localization requirements', time: '2024-11-30 10:15', type: 'chat' },
    { action: isZh ? '更新ESG数据（Q4）' : 'Updated ESG data (Q4)', time: '2024-11-28 16:00', type: 'esg' },
    { action: isZh ? '下载新加坡PDPA合规模板' : 'Downloaded Singapore PDPA compliance template', time: '2024-11-27 09:45', type: 'download' },
    { action: isZh ? '预约ESG专家咨询' : 'Booked ESG expert consultation', time: '2024-11-25 11:00', type: 'expert' },
  ]

  const typeIcon: Record<string, string> = {
    diagnosis: '🔍',
    chat: '💬',
    esg: '🌿',
    download: '📄',
    expert: '👤',
  }

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{isZh ? '数据分析中心' : 'Data Analysis Center'}</h1>
          <p className="text-gray-500 text-sm">{isZh ? '企业合规管理全景数据洞察' : 'Panoramic data insights for enterprise compliance management'}</p>
        </div>
        <div className="flex gap-2">
          <select className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option>{isZh ? '近3个月' : 'Last 3 months'}</option>
            <option>{isZh ? '近6个月' : 'Last 6 months'}</option>
            <option>{isZh ? '近1年' : 'Last year'}</option>
          </select>
          <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
            {isZh ? '导出报告' : 'Export Report'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-2 leading-tight">{kpi.label}</p>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            <span className={`text-xs font-medium ${kpi.up ? 'text-green-600' : 'text-red-500'}`}>{kpi.change}</span>
            <span className="text-xs text-gray-400 ml-1">{isZh ? '较上月' : 'vs last month'}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Compliance Score Trend */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">{isZh ? '合规评分趋势' : 'Compliance Score Trend'}</h2>
          <div className="flex items-end gap-2 h-32">
            {complianceScores.map((score, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500">{score}</span>
                <div className="w-full bg-blue-500 rounded-t-md transition-all hover:bg-blue-600"
                  style={{ height: `${(score / 100) * 100}px` }} />
                <span className="text-xs text-gray-400">{complianceMonths[i]}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-green-600 font-medium">↑ +16分</span>
            <span className="text-xs text-gray-400">{isZh ? '过去6个月持续提升' : 'Continuous improvement over 6 months'}</span>
          </div>
        </div>

        {/* Risk Trend */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">{isZh ? '风险事件趋势' : 'Risk Event Trend'}</h2>
          <div className="space-y-4">
            {riskTrend.map((r, i) => (
              <div key={i}>
                <p className="text-xs text-gray-500 mb-1">{r.month}</p>
                <div className="flex gap-1 h-5">
                  <div className="bg-red-400 rounded-sm" style={{ width: `${r.high * 10}%` }} title={`High: ${r.high}`} />
                  <div className="bg-orange-400 rounded-sm" style={{ width: `${r.medium * 10}%` }} title={`Medium: ${r.medium}`} />
                  <div className="bg-green-400 rounded-sm" style={{ width: `${r.low * 10}%` }} title={`Low: ${r.low}`} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4">
            {[
              { color: 'bg-red-400', label: isZh ? '高风险' : 'High' },
              { color: 'bg-orange-400', label: isZh ? '中风险' : 'Medium' },
              { color: 'bg-green-400', label: isZh ? '低风险' : 'Low' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-sm ${item.color}`} />
                <span className="text-xs text-gray-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Coverage */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">{isZh ? '目标市场合规覆盖率' : 'Target Market Compliance Coverage'}</h2>
          <div className="space-y-3">
            {marketCoverage.map(m => (
              <div key={m.market} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-16 shrink-0">{m.market}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className={`${m.color} h-2 rounded-full`} style={{ width: `${m.covered}%` }} />
                </div>
                <span className="text-xs font-medium text-gray-700 w-8 text-right">{m.covered}%</span>
              </div>
            ))}
          </div>
          <Link href={`/${locale}/decision-engine/destination-match`}
            className="block mt-4 text-center text-xs text-blue-600 border border-blue-100 rounded-xl py-2 hover:bg-blue-50">
            {isZh ? '分析更多目标市场 →' : 'Analyze More Markets →'}
          </Link>
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">{isZh ? '近期操作记录' : 'Recent Activity Log'}</h2>
          <div className="space-y-3">
            {topActivities.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-base shrink-0 mt-0.5">{typeIcon[a.type]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700 leading-relaxed">{a.action}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
