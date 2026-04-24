import Link from 'next/link'

export default async function DiagnosisReportPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale } = await params
  const isZh = locale === 'zh'

  const report = {
    id: 'r001',
    title: isZh ? 'EU AI Act综合合规诊断报告' : 'EU AI Act Comprehensive Compliance Diagnosis Report',
    date: '2024-11-15',
    score: 65,
    riskLevel: 'medium',
    company: isZh ? '示例科技有限公司' : 'Example Tech Co., Ltd.',
    targetMarkets: isZh ? ['欧盟', '英国', '新加坡'] : ['EU', 'UK', 'Singapore'],
    gaps: [
      { priority: 'high', title: isZh ? '高风险AI系统合规评估缺失' : 'High-Risk AI System Conformity Assessment Missing', desc: isZh ? '您的AI推荐系统可能被归类为EU AI Act高风险AI系统，需完成合规评估并建立质量管理体系' : 'Your AI recommendation system may be classified as high-risk under EU AI Act, requiring conformity assessment and quality management system', deadline: isZh ? '2025年8月前' : 'Before August 2025' },
      { priority: 'high', title: isZh ? 'GDPR数据处理协议不完整' : 'Incomplete GDPR Data Processing Agreements', desc: isZh ? '与欧盟数据处理商的标准合同条款（SCC）未签署，跨境数据传输存在合规风险' : 'Standard Contractual Clauses (SCCs) with EU data processors not signed, cross-border data transfer compliance risk', deadline: isZh ? '立即处理' : 'Immediate' },
      { priority: 'medium', title: isZh ? '算法透明度说明不足' : 'Insufficient Algorithm Transparency Documentation', desc: isZh ? '需为高风险AI系统建立技术文档、算法可解释性说明和人类监督机制' : 'Need to establish technical documentation, algorithm explainability, and human oversight mechanisms for high-risk AI systems', deadline: isZh ? '3个月内' : 'Within 3 months' },
      { priority: 'medium', title: isZh ? '缺少专职DPO' : 'No Dedicated DPO Appointed', desc: isZh ? '处理大量欧盟用户数据时，需任命数据保护官（DPO）并向监管机构报告' : 'Processing large volumes of EU user data requires appointing a Data Protection Officer (DPO) and registering with authorities', deadline: isZh ? '6个月内' : 'Within 6 months' },
      { priority: 'low', title: isZh ? '隐私政策需更新至EU标准' : 'Privacy Policy Needs EU Standard Update', desc: isZh ? '现有隐私政策需按GDPR要求更新，增加数据主体权利告知、数据保留期限等内容' : 'Existing privacy policy needs updating to GDPR requirements, adding data subject rights, retention periods, etc.', deadline: isZh ? '本季度内' : 'This quarter' },
    ],
    recommendations: [
      isZh ? '立即委托专业合规律师完成EU AI Act风险分类评估，确认您的AI系统是否属于高风险类别' : 'Immediately engage a compliance lawyer to complete EU AI Act risk classification assessment',
      isZh ? '启动GDPR合规审查项目，重点评估数据处理合法性基础、数据跨境传输机制' : 'Launch GDPR compliance review, focusing on lawful basis and cross-border data transfer mechanisms',
      isZh ? '建立AI系统技术文档体系，完善算法透明度和可解释性说明材料' : 'Establish AI system technical documentation and algorithm transparency materials',
      isZh ? '招募或外包数据保护官（DPO）职能，建立合规管理长效机制' : 'Recruit or outsource DPO function, establish long-term compliance management mechanism',
    ],
    riskBreakdown: [
      { category: isZh ? 'AI监管合规' : 'AI Regulatory', score: 50, color: 'red' },
      { category: isZh ? '数据保护合规' : 'Data Protection', score: 62, color: 'orange' },
      { category: isZh ? '算法透明度' : 'Algorithm Transparency', score: 58, color: 'orange' },
      { category: isZh ? '知识产权' : 'IP Compliance', score: 80, color: 'green' },
      { category: isZh ? '劳工合规' : 'Labor Compliance', score: 85, color: 'green' },
      { category: isZh ? 'ESG合规' : 'ESG Compliance', score: 72, color: 'yellow' },
    ],
  }

  const priorityConfig: Record<string, { bg: string; text: string; border: string; label: string }> = {
    high: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: isZh ? '高优先级' : 'High Priority' },
    medium: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', label: isZh ? '中优先级' : 'Medium Priority' },
    low: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', label: isZh ? '低优先级' : 'Low Priority' },
  }

  const barColor: Record<string, string> = { red: 'bg-red-400', orange: 'bg-orange-400', yellow: 'bg-yellow-400', green: 'bg-green-400' }

  return (
    <div className="p-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link href={`/${locale}/diagnosis`} className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {isZh ? '返回诊断列表' : 'Back to Diagnosis List'}
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{report.title}</h1>
          <p className="text-sm text-gray-400">{report.company} · {report.date} · {isZh ? '目标市场：' : 'Markets: '}{report.targetMarkets.join('、')}</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {isZh ? '导出PDF' : 'Export PDF'}
          </button>
          <Link href={`/${locale}/solution-tools`}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
            {isZh ? '生成落地方案 →' : 'Generate Solution →'}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overall Score */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">{isZh ? '综合合规评分' : 'Overall Compliance Score'}</h2>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f97316" strokeWidth="3"
                    strokeDasharray={`${report.score} ${100 - report.score}`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">{report.score}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-orange-700 bg-orange-50 px-3 py-1 rounded-full">
                    {isZh ? '中等风险' : 'Medium Risk'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
                  {isZh ? `识别到 ${report.gaps.length} 个合规缺口，其中 ${report.gaps.filter(g => g.priority === 'high').length} 个高优先级需立即处理` : `${report.gaps.length} compliance gaps identified, ${report.gaps.filter(g => g.priority === 'high').length} high-priority requiring immediate attention`}
                </p>
              </div>
            </div>

            {/* Risk Breakdown */}
            <div className="mt-5 space-y-3">
              {report.riskBreakdown.map((item) => (
                <div key={item.category} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-28 shrink-0">{item.category}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                    <div className={`${barColor[item.color]} h-1.5 rounded-full`} style={{ width: `${item.score}%` }} />
                  </div>
                  <span className="text-xs font-medium text-gray-700 w-8 text-right">{item.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Gaps */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">{isZh ? `合规缺口清单（${report.gaps.length}项）` : `Compliance Gaps (${report.gaps.length} items)`}</h2>
            <div className="space-y-4">
              {report.gaps.map((gap, i) => {
                const pc = priorityConfig[gap.priority]
                return (
                  <div key={i} className={`rounded-xl border ${pc.border} ${pc.bg} p-4`}>
                    <div className="flex items-start gap-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${pc.border} ${pc.text} shrink-0`}>{pc.label}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${pc.text} mb-1`}>{gap.title}</p>
                        <p className="text-xs text-gray-600 leading-relaxed mb-2">{gap.desc}</p>
                        <p className="text-xs text-gray-400">{isZh ? '建议处理时限：' : 'Suggested deadline: '}{gap.deadline}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">{isZh ? '优化建议' : 'Optimization Recommendations'}</h2>
            <div className="space-y-3">
              {report.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                  <p className="text-sm text-gray-600 leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">{isZh ? '下一步行动' : 'Next Steps'}</h3>
            <div className="space-y-2">
              <Link href={`/${locale}/solution-tools`}
                className="block w-full text-center py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
                {isZh ? '生成合规落地方案' : 'Generate Compliance Plan'}
              </Link>
              <Link href={`/${locale}/ai-chat`}
                className="block w-full text-center py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">
                {isZh ? '向AI深度咨询' : 'Deep AI Consultation'}
              </Link>
              <Link href={`/${locale}/expert-hall`}
                className="block w-full text-center py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">
                {isZh ? '预约合规专家' : 'Book Compliance Expert'}
              </Link>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-orange-800 mb-2">{isZh ? '⚠️ 紧急提醒' : '⚠️ Urgent Alert'}</h3>
            <p className="text-xs text-orange-700 leading-relaxed">
              {isZh ? 'EU AI Act高风险AI系统合规要求将于2025年8月生效，建议立即启动合规整改工作，避免面临最高3500万欧元或全球营业额7%的罚款。' : 'EU AI Act high-risk AI system requirements take effect August 2025. Immediate remediation is recommended to avoid fines of up to €35M or 7% of global turnover.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
