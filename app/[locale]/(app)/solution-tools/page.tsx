import Link from 'next/link'

export default async function SolutionToolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isZh = locale === 'zh'

  const solutions = [
    {
      id: 'compliance-plan',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      label: isZh ? '合规落地方案' : 'Compliance Implementation Plan',
      desc: isZh ? '基于诊断报告自动生成逐步合规整改计划，包含任务分解、责任分工与时间线' : 'Auto-generate phased compliance remediation plan from diagnosis report, including task breakdown, responsibility assignment, and timeline',
      status: 'active',
      color: 'blue',
    },
    {
      id: 'contract-generator',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      label: isZh ? '海外合规合同模板' : 'Overseas Compliance Contract Templates',
      desc: isZh ? '覆盖数据处理协议（DPA）、标准合同条款（SCC）、服务协议等200+法律文件模板' : 'Covers DPA, SCC, service agreements, and 200+ legal document templates',
      status: 'active',
      color: 'green',
    },
    {
      id: 'policy-tracker',
      icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
      label: isZh ? '政策变化监控' : 'Policy Change Monitor',
      desc: isZh ? '实时追踪全球AI监管政策动态，当目标市场政策发生重大变化时自动推送预警' : 'Real-time tracking of global AI regulatory policy updates with automatic alerts when target markets see major regulatory changes',
      status: 'active',
      color: 'purple',
    },
    {
      id: 'entity-setup',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      label: isZh ? '海外主体注册指引' : 'Overseas Entity Registration Guide',
      desc: isZh ? '分国家、分地区的实体注册流程指引，包含所需材料清单、时间预估与常见陷阱提示' : 'Country-by-country entity registration process guides, including required document checklists, time estimates, and common pitfall warnings',
      status: 'coming',
      color: 'gray',
    },
    {
      id: 'ip-protection',
      icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      label: isZh ? '知识产权保护方案' : 'IP Protection Solutions',
      desc: isZh ? '海外专利布局建议、商标注册策略、开源合规检查与软件著作权保护方案生成' : 'Overseas patent layout recommendations, trademark registration strategy, open-source compliance checks, and software copyright protection plans',
      status: 'coming',
      color: 'gray',
    },
    {
      id: 'esg-action',
      icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      label: isZh ? 'ESG提升行动计划' : 'ESG Improvement Action Plan',
      desc: isZh ? '基于ESG诊断结果，生成针对性的ESG评级提升行动计划，可量化改进路径' : 'Generate targeted ESG rating improvement action plans based on ESG diagnosis results with quantifiable improvement pathways',
      status: 'coming',
      color: 'gray',
    },
  ]

  const recentPlans = [
    { title: isZh ? 'EU AI Act合规整改计划' : 'EU AI Act Compliance Remediation Plan', date: '2024-11-15', progress: 35, tasks: 12, done: 4 },
    { title: isZh ? 'GDPR数据合规落地方案' : 'GDPR Data Compliance Implementation Plan', date: '2024-10-28', progress: 60, tasks: 8, done: 5 },
  ]

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    gray: 'bg-gray-100 text-gray-400',
  }

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{isZh ? '合规落地工具箱' : 'Compliance Solution Toolbox'}</h1>
        <p className="text-gray-500 text-sm">{isZh ? '从诊断到落地，AI驱动的全流程合规解决方案工具集' : 'From diagnosis to implementation — AI-driven full-cycle compliance solution toolkit'}</p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {solutions.map(sol => (
          <div key={sol.id}
            className={`bg-white rounded-2xl border border-gray-200 p-5 transition-all ${sol.status === 'active' ? 'hover:shadow-md hover:border-blue-200 cursor-pointer' : 'opacity-60'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[sol.color]}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={sol.icon} />
                </svg>
              </div>
              {sol.status === 'coming' && (
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{isZh ? '即将上线' : 'Coming Soon'}</span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{sol.label}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{sol.desc}</p>
            {sol.status === 'active' && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <Link href={`/${locale}/diagnosis/report/r001`}
                  className="text-xs text-blue-600 font-medium hover:underline">
                  {isZh ? '立即使用 →' : 'Use Now →'}
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent Plans */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">{isZh ? '我的合规方案' : 'My Compliance Plans'}</h2>
          <Link href={`/${locale}/diagnosis/create`}
            className="text-sm text-blue-600 hover:underline">{isZh ? '生成新方案' : 'Generate New Plan'}</Link>
        </div>

        {recentPlans.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-sm">{isZh ? '暂无合规方案，请先完成合规诊断' : 'No plans yet. Complete a compliance diagnosis first.'}</p>
            <Link href={`/${locale}/diagnosis/create`} className="mt-3 inline-block text-sm text-blue-600 hover:underline">
              {isZh ? '发起诊断 →' : 'Start Diagnosis →'}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentPlans.map((plan, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-0.5">{plan.title}</h4>
                    <p className="text-xs text-gray-400">{isZh ? '生成于' : 'Created'} {plan.date}</p>
                  </div>
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                    {plan.done}/{plan.tasks} {isZh ? '项已完成' : 'tasks done'}
                  </span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{isZh ? '整体进度' : 'Overall Progress'}</span>
                    <span>{plan.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${plan.progress}%` }} />
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Link href={`/${locale}/diagnosis/report/r001`}
                    className="text-xs text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50">
                    {isZh ? '查看方案' : 'View Plan'}
                  </Link>
                  <Link href={`/${locale}/ai-chat`}
                    className="text-xs text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
                    {isZh ? '咨询AI' : 'Ask AI'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
