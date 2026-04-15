import Link from 'next/link'

export default async function DiagnosisPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isZh = locale === 'zh'

  const diagnosisTypes = [
    { id: 'comprehensive', title: isZh ? '综合合规诊断' : 'Comprehensive Compliance Diagnosis', desc: isZh ? '覆盖出海全维度合规要求，包括数据保护、AI监管、劳工合规等' : 'Covers all dimensions of go-global compliance including data protection, AI regulation, labor compliance', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: 'blue', badge: isZh ? '推荐' : 'Recommended' },
    { id: 'data', title: isZh ? '数据跨境合规诊断' : 'Cross-Border Data Compliance Diagnosis', desc: isZh ? '专项诊断数据出境场景的GDPR、数据安全法等合规要求' : 'Specialized diagnosis for GDPR, Data Security Law, and other data export compliance', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4', color: 'indigo' },
    { id: 'algorithm', title: isZh ? '算法备案合规诊断' : 'Algorithm Filing Compliance Diagnosis', desc: isZh ? '针对中国算法推荐管理规定的专项合规评估与备案指引' : 'Specialized compliance assessment for China Algorithm Recommendation Regulations', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', color: 'violet' },
    { id: 'ip', title: isZh ? '知识产权侵权风险诊断' : 'IP Infringement Risk Diagnosis', desc: isZh ? '评估AI产品在目标市场的专利、版权、商标等知识产权风险' : 'Assess IP risks including patents, copyright, and trademarks in target markets', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', color: 'orange' },
  ]

  const mockHistory = [
    { id: 'r001', title: isZh ? 'EU AI Act综合合规诊断' : 'EU AI Act Comprehensive Diagnosis', date: '2024-11-15', score: 65, riskLevel: 'medium', status: isZh ? '已完成' : 'Completed', type: isZh ? '综合诊断' : 'Comprehensive' },
    { id: 'r002', title: isZh ? 'GDPR数据跨境合规诊断' : 'GDPR Cross-Border Data Diagnosis', date: '2024-10-28', score: 78, riskLevel: 'low', status: isZh ? '已完成' : 'Completed', type: isZh ? '数据合规' : 'Data Compliance' },
    { id: 'r003', title: isZh ? '新加坡PDPA合规诊断' : 'Singapore PDPA Compliance Diagnosis', date: '2024-09-12', score: 88, riskLevel: 'low', status: isZh ? '已完成' : 'Completed', type: isZh ? '数据合规' : 'Data Compliance' },
  ]

  const riskConfig: Record<string, { bg: string; text: string; label: string }> = {
    high: { bg: 'bg-red-50', text: 'text-red-700', label: isZh ? '高风险' : 'High Risk' },
    medium: { bg: 'bg-orange-50', text: 'text-orange-700', label: isZh ? '中风险' : 'Medium Risk' },
    low: { bg: 'bg-green-50', text: 'text-green-700', label: isZh ? '低风险' : 'Low Risk' },
  }

  const colorMap: Record<string, { bg: string; text: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-600' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
  }

  return (
    <div className="p-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{isZh ? '合规资质诊断' : 'Compliance Diagnosis'}</h1>
          <p className="text-gray-500 text-sm">{isZh ? 'AI智能诊断出海合规状态，识别缺口与风险，生成整改清单' : 'AI intelligently diagnoses go-global compliance status, identifies gaps and risks'}</p>
        </div>
        <Link
          href={`/${locale}/diagnosis/create`}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {isZh ? '发起新诊断' : 'New Diagnosis'}
        </Link>
      </div>

      {/* Diagnosis Types */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-4">{isZh ? '选择诊断类型' : 'Choose Diagnosis Type'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {diagnosisTypes.map((type) => {
            const c = colorMap[type.color]
            return (
              <Link
                key={type.id}
                href={`/${locale}/diagnosis/create?type=${type.id}`}
                className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 ${c.bg} rounded-xl flex items-center justify-center shrink-0`}>
                    <svg className={`w-5 h-5 ${c.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={type.icon} />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{type.title}</h3>
                      {type.badge && (
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{type.badge}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{type.desc}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-500 shrink-0 mt-3 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* History */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-4">{isZh ? '历史诊断记录' : 'Diagnosis History'}</h2>
        {mockHistory.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">
            <p>{isZh ? '暂无诊断记录' : 'No diagnosis records yet'}</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">{isZh ? '诊断报告' : 'Report'}</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">{isZh ? '类型' : 'Type'}</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">{isZh ? '合规评分' : 'Score'}</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">{isZh ? '风险等级' : 'Risk Level'}</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">{isZh ? '诊断日期' : 'Date'}</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mockHistory.map((record) => {
                  const rc = riskConfig[record.riskLevel]
                  return (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-sm font-medium text-gray-900">{record.title}</td>
                      <td className="px-5 py-4 text-xs text-gray-500">{record.type}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 rounded-full h-1.5 w-20">
                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${record.score}%` }} />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{record.score}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rc.bg} ${rc.text}`}>{rc.label}</span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-400">{record.date}</td>
                      <td className="px-5 py-4">
                        <Link href={`/${locale}/diagnosis/report/${record.id}`}
                          className="text-xs text-blue-600 hover:underline font-medium">
                          {isZh ? '查看报告' : 'View Report'}
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
