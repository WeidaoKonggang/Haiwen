import Link from 'next/link'

export default async function DecisionEnginePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isZh = locale === 'zh'

  const tools = [
    {
      id: 'destination-match',
      href: '/decision-engine/destination-match',
      icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      label: isZh ? '出海目的地匹配' : 'Destination Matching',
      desc: isZh ? '基于业务模型、技术栈与合规成本，AI智能推荐最优出海市场组合' : 'AI recommends optimal overseas market combinations based on business model, tech stack, and compliance costs',
      tag: isZh ? '核心功能' : 'Core Feature',
      tagColor: 'bg-blue-50 text-blue-700',
      color: 'blue',
    },
    {
      id: 'entity-structure',
      href: '/decision-engine',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      label: isZh ? '实体架构设计' : 'Entity Structure Design',
      desc: isZh ? '根据目标市场与税务规划，AI生成最优海外主体架构与股权设计方案' : 'AI generates optimal overseas entity structure and equity design based on target markets and tax planning',
      tag: isZh ? '即将上线' : 'Coming Soon',
      tagColor: 'bg-gray-100 text-gray-500',
      color: 'gray',
    },
    {
      id: 'tax-optimizer',
      href: '/decision-engine',
      icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 6h16M4 10h16M4 14h16M4 18h16',
      label: isZh ? '税务合规优化' : 'Tax Compliance Optimizer',
      desc: isZh ? '多国税率对比与转让定价策略，最大化合规前提下的税务效益' : 'Multi-jurisdiction tax rate comparison and transfer pricing strategy for maximum tax efficiency within compliance',
      tag: isZh ? '即将上线' : 'Coming Soon',
      tagColor: 'bg-gray-100 text-gray-500',
      color: 'gray',
    },
    {
      id: 'market-entry',
      href: '/decision-engine',
      icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
      label: isZh ? '市场进入路径规划' : 'Market Entry Path Planning',
      desc: isZh ? '分阶段市场进入策略，包含时间线、里程碑与关键合规节点规划' : 'Phased market entry strategy including timeline, milestones, and key compliance checkpoints',
      tag: isZh ? '即将上线' : 'Coming Soon',
      tagColor: 'bg-gray-100 text-gray-500',
      color: 'gray',
    },
  ]

  const recentAnalyses = [
    { market: isZh ? '欧盟市场' : 'EU Market', score: 82, date: '2024-11-10', status: 'completed' },
    { market: isZh ? '东南亚（新加坡+泰国）' : 'SEA (Singapore+Thailand)', score: 78, date: '2024-10-28', status: 'completed' },
    { market: isZh ? '中东（UAE）' : 'Middle East (UAE)', score: 65, date: '2024-10-15', status: 'completed' },
  ]

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{isZh ? '出海决策引擎' : 'Global Expansion Decision Engine'}</h1>
        <p className="text-gray-500 text-sm">{isZh ? '多维度AI决策支持，助力企业科学制定出海战略，降低决策风险' : 'Multi-dimensional AI decision support to help enterprises scientifically formulate overseas expansion strategies'}</p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {tools.map(tool => (
          <Link key={tool.id} href={tool.color !== 'gray' ? `/${locale}${tool.href}` : '#'}
            className={`bg-white rounded-2xl border border-gray-200 p-6 transition-all ${tool.color !== 'gray' ? 'hover:shadow-md hover:border-blue-200 cursor-pointer' : 'opacity-70 cursor-not-allowed'}`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tool.color === 'blue' ? 'bg-blue-50' : 'bg-gray-100'}`}>
                <svg className={`w-5 h-5 ${tool.color === 'blue' ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={tool.icon} />
                </svg>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${tool.tagColor}`}>{tool.tag}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">{tool.label}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{tool.desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent Analyses */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">{isZh ? '近期决策分析' : 'Recent Decision Analyses'}</h2>
          <Link href={`/${locale}/decision-engine/destination-match`}
            className="text-sm text-blue-600 hover:underline">{isZh ? '发起新分析' : 'New Analysis'}</Link>
        </div>
        <div className="space-y-3">
          {recentAnalyses.map((a, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-900">{a.market}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-xs text-gray-400 text-right mb-0.5">{isZh ? '匹配度' : 'Match Score'}</p>
                  <p className="text-lg font-bold text-blue-600">{a.score}</p>
                </div>
                <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{isZh ? '已完成' : 'Done'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
