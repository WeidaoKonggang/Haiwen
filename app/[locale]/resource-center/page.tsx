import Link from 'next/link'

const resources = [
  { id: 'r001', type: 'guide', typeEn: 'Guide', title: 'EU AI Act完全合规指南（2024版）', titleEn: 'Complete EU AI Act Compliance Guide (2024)', desc: '涵盖EU AI Act全文解读、风险分类方法、合规流程与企业应对策略', descEn: 'Comprehensive EU AI Act analysis including risk classification, compliance workflows, and enterprise response strategies', tags: ['AI法规', '欧盟'], tagsEn: ['AI Regulation', 'EU'], date: '2024-11-01', reads: 2841, icon: '📘' },
  { id: 'r002', type: 'template', typeEn: 'Template', title: 'GDPR数据保护影响评估（DPIA）模板', titleEn: 'GDPR Data Protection Impact Assessment (DPIA) Template', desc: '可直接使用的DPIA评估模板，符合欧盟数据保护机构最新要求', descEn: 'Ready-to-use DPIA assessment template compliant with the latest EU data protection authority requirements', tags: ['GDPR', '数据保护'], tagsEn: ['GDPR', 'Data Protection'], date: '2024-10-15', reads: 1923, icon: '📋' },
  { id: 'r003', type: 'report', typeEn: 'Report', title: '2024年AI出海合规趋势报告', titleEn: '2024 AI Global Expansion Compliance Trend Report', desc: '全球主要市场AI监管政策最新进展与趋势预测，助力企业前瞻布局', descEn: 'Latest developments and trend forecasts for AI regulatory policies in major global markets', tags: ['行业报告', 'AI监管'], tagsEn: ['Industry Report', 'AI Regulation'], date: '2024-09-20', reads: 4102, icon: '📊' },
  { id: 'r004', type: 'checklist', typeEn: 'Checklist', title: '新加坡PDPA合规检查清单', titleEn: 'Singapore PDPA Compliance Checklist', desc: '针对中国AI企业进入新加坡市场的个人数据保护法合规要点清单', descEn: 'Key PDPA compliance checklist for Chinese AI companies entering the Singapore market', tags: ['新加坡', 'PDPA'], tagsEn: ['Singapore', 'PDPA'], date: '2024-10-08', reads: 1256, icon: '✅' },
  { id: 'r005', type: 'guide', typeEn: 'Guide', title: 'ESG信息披露实操手册（GRI准则）', titleEn: 'ESG Disclosure Practical Guide (GRI Standards)', desc: 'AI企业适用的GRI 2021准则ESG信息披露操作手册，包含指标计算方法', descEn: 'GRI 2021 standards ESG disclosure operational manual for AI companies, including indicator calculation methods', tags: ['ESG', 'GRI'], tagsEn: ['ESG', 'GRI'], date: '2024-08-30', reads: 987, icon: '🌿' },
  { id: 'r006', type: 'webinar', typeEn: 'Webinar', title: '圆桌讨论：中国AI企业出海欧盟合规实践', titleEn: 'Roundtable: Chinese AI Companies Going Global in EU Compliance Practice', desc: '多位合规专家分享真实出海合规案例，探讨AI企业在欧盟的合规挑战与应对', descEn: 'Multiple compliance experts share real overseas compliance cases and discuss EU compliance challenges', tags: ['网络研讨', '欧盟'], tagsEn: ['Webinar', 'EU'], date: '2024-08-15', reads: 2340, icon: '🎙' },
]

const typeConfig: Record<string, { label: string; labelEn: string; color: string }> = {
  guide: { label: '指南', labelEn: 'Guide', color: 'bg-blue-50 text-blue-700' },
  template: { label: '模板', labelEn: 'Template', color: 'bg-green-50 text-green-700' },
  report: { label: '报告', labelEn: 'Report', color: 'bg-purple-50 text-purple-700' },
  checklist: { label: '清单', labelEn: 'Checklist', color: 'bg-orange-50 text-orange-700' },
  webinar: { label: '研讨会', labelEn: 'Webinar', color: 'bg-teal-50 text-teal-700' },
}

const categories = [
  { id: 'all', label: '全部资源', labelEn: 'All Resources' },
  { id: 'guide', label: '合规指南', labelEn: 'Compliance Guides' },
  { id: 'template', label: '文件模板', labelEn: 'Document Templates' },
  { id: 'report', label: '行业报告', labelEn: 'Industry Reports' },
  { id: 'checklist', label: '合规清单', labelEn: 'Checklists' },
  { id: 'webinar', label: '网络研讨', labelEn: 'Webinars' },
]

export default async function ResourceCenterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isZh = locale === 'zh'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{isZh ? '资源中心' : 'Resource Center'}</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            {isZh
              ? '汇聚AI出海合规指南、政策模板、行业报告与研讨资源，持续更新的专业知识库'
              : 'AI global expansion compliance guides, policy templates, industry reports, and webinar resources — continuously updated knowledge base'}
          </p>
          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder={isZh ? '搜索资源...' : 'Search resources...'}
                className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white w-64" />
            </div>
            <select className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option>{isZh ? '全部市场' : 'All Markets'}</option>
              <option>{isZh ? '欧盟' : 'EU'}</option>
              <option>{isZh ? '新加坡' : 'Singapore'}</option>
              <option>{isZh ? '美国' : 'US'}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button key={cat.id}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap border transition-colors ${cat.id === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
              {isZh ? cat.label : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Featured */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-6 text-white flex items-center gap-6">
          <div className="text-5xl">📘</div>
          <div className="flex-1">
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{isZh ? '最新发布' : 'Latest'}</span>
            <h2 className="text-lg font-bold mt-1 mb-1">{isZh ? resources[0].title : resources[0].titleEn}</h2>
            <p className="text-white/80 text-sm">{isZh ? resources[0].desc : resources[0].descEn}</p>
          </div>
          <Link href={`/${locale}/policy-db/eu-ai-act`}
            className="shrink-0 px-4 py-2 bg-white text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-50">
            {isZh ? '免费下载' : 'Free Download'}
          </Link>
        </div>

        {/* Resource Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {resources.slice(1).map(res => {
            const tc = typeConfig[res.type]
            return (
              <div key={res.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{res.icon}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tc.color}`}>{isZh ? tc.label : tc.labelEn}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2 leading-snug">{isZh ? res.title : res.titleEn}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{isZh ? res.desc : res.descEn}</p>
                <div className="flex gap-1.5 mb-3 flex-wrap">
                  {(isZh ? res.tags : res.tagsEn).map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{res.date}</span>
                    <span>·</span>
                    <span>{res.reads.toLocaleString()} {isZh ? '次阅读' : 'reads'}</span>
                  </div>
                  <button className="text-xs text-blue-600 font-medium hover:underline">
                    {isZh ? '获取 →' : 'Get →'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Newsletter */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
          <h3 className="text-base font-semibold text-gray-900 mb-1">{isZh ? '订阅合规动态' : 'Subscribe to Compliance Updates'}</h3>
          <p className="text-sm text-gray-500 mb-4">
            {isZh ? '每周精选全球AI监管政策动态与合规资源，直达您的邮箱' : 'Weekly curated global AI regulatory updates and compliance resources delivered to your inbox'}
          </p>
          <div className="flex gap-2 justify-center max-w-sm mx-auto">
            <input type="email" placeholder={isZh ? '输入您的邮箱地址' : 'Enter your email address'}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
              {isZh ? '订阅' : 'Subscribe'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
