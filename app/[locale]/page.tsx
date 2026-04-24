import Link from 'next/link'
import { casesData } from '@/lib/cases-data'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isZh = locale === 'zh'

  const modules = [
    { id: 'ai-chat', href: '/ai-chat', color: 'blue', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', title: isZh ? 'AI智能问答' : 'AI Consulting', desc: isZh ? '基于大模型的出海合规、ESG管理、政策解读全场景专业咨询' : 'LLM-powered expert consulting on go-global compliance, ESG, and policy' },
    { id: 'policy-db', href: '/policy-db', color: 'indigo', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', title: isZh ? '政策与ESG数据库' : 'Policy & ESG Database', desc: isZh ? '覆盖全球30+国家AI监管与ESG标准，实时更新订阅推送' : 'Real-time AI regulation and ESG standards database covering 30+ countries' },
    { id: 'diagnosis', href: '/diagnosis', color: 'violet', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', title: isZh ? '合规资质诊断' : 'Compliance Diagnosis', desc: isZh ? 'AI自动诊断合规缺口，生成备案要求与整改优先级清单' : 'AI auto-diagnoses compliance gaps, generates remediation priority lists' },
    { id: 'risk-assessment', href: '/risk-assessment', color: 'orange', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: isZh ? '风险智能评估' : 'Risk Assessment', desc: isZh ? '六维度风险模型，7×24小时监控目标市场政策变动与风险预警' : 'Six-dimensional risk model with 24/7 policy monitoring and alerts' },
    { id: 'esg-manage', href: '/esg-manage', color: 'green', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z', title: isZh ? 'ESG全流程管理' : 'ESG Management', desc: isZh ? '适配AI行业的ESG数据采集、报告生成与评级提升一体化管理' : 'AI-adapted ESG data collection, report generation, and rating improvement' },
    { id: 'decision-engine', href: '/decision-engine', color: 'cyan', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7', title: isZh ? '出海决策引擎' : 'Decision Engine', desc: isZh ? '多维度目的地评分、出海模式推荐与完整路径决策支持' : 'Multi-dimensional destination scoring, entry mode recommendation and pathway planning' },
    { id: 'expert-hall', href: '/expert-hall', color: 'pink', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', title: isZh ? '专家咨询服务' : 'Expert Consulting', desc: isZh ? '出海合规、ESG管理、跨境税务专家团队，在线咨询与预约' : 'Expert team for go-global compliance, ESG management, and cross-border tax' },
    { id: 'cases', href: '/cases', color: 'teal', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', title: isZh ? '行业案例库' : 'Case Library', desc: isZh ? '中国AI企业出海典型案例，多维度筛选与对标学习' : 'Chinese AI company go-global cases, multi-dimensional filtering and benchmarking' },
  ]

  const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'hover:ring-blue-200' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'hover:ring-indigo-200' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-600', ring: 'hover:ring-violet-200' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', ring: 'hover:ring-orange-200' },
    green: { bg: 'bg-green-50', text: 'text-green-600', ring: 'hover:ring-green-200' },
    cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', ring: 'hover:ring-cyan-200' },
    pink: { bg: 'bg-pink-50', text: 'text-pink-600', ring: 'hover:ring-pink-200' },
    teal: { bg: 'bg-teal-50', text: 'text-teal-600', ring: 'hover:ring-teal-200' },
  }

  const featuredCases = casesData.slice(0, 3)

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative bg-white overflow-hidden pt-20 pb-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 opacity-60" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8 border border-blue-100">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            {isZh ? '面向中国AI企业 · 出海合规与ESG创新全方位决策平台' : 'For Chinese AI Companies · Comprehensive Go-Global & ESG Decision Platform'}
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-5 tracking-tight leading-tight">
            {isZh ? '海问 HQ' : 'HQ — HaiWen'}
          </h1>

          <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed">
            {isZh
              ? '中国AI企业出海与ESG创新自主咨询决策平台'
              : 'AI Go-Global & ESG Innovation Decision Platform for Chinese AI Companies'}
          </p>

          <p className="text-base text-gray-400 mb-10 max-w-xl mx-auto">
            {isZh
              ? '覆盖全球30+国家政策法规 · AI智能诊断 · ESG全流程管理 · 出海决策引擎'
              : 'Covering 30+ Countries · AI Diagnosis · ESG Management · Go-Global Decision Engine'}
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href={`/${locale}/register`}
              className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-700 text-base shadow-md shadow-blue-100">
              {isZh ? '免费注册体验 →' : 'Sign Up Free →'}
            </Link>
            <Link href={`/${locale}/ai-chat`}
              className="border border-gray-200 text-gray-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-50 text-base">
              {isZh ? '开始AI咨询' : 'Start AI Consulting'}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-gray-900 py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { num: '30+', label: isZh ? '覆盖国家' : 'Countries' },
            { num: '100+', label: isZh ? '政策法规' : 'Regulations' },
            { num: '50+', label: isZh ? '实战案例' : 'Case Studies' },
            { num: '20+', label: isZh ? '领域专家' : 'Domain Experts' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-white mb-1">{s.num}</div>
              <div className="text-sm text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Modules ── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {isZh ? '全方位出海决策支持体系' : 'Comprehensive Go-Global Decision Support System'}
            </h2>
            <p className="text-gray-500">
              {isZh ? '八大核心功能模块，覆盖AI企业出海与ESG管理全场景' : 'Eight core modules covering all scenarios of AI company globalization and ESG management'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {modules.map((mod) => {
              const c = colorMap[mod.color]
              return (
                <Link
                  key={mod.id}
                  href={`/${locale}${mod.href}`}
                  className={`group rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:ring-2 ${c.ring} transition-all duration-200`}
                >
                  <div className={`w-11 h-11 ${c.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <svg className={`w-5.5 h-5.5 ${c.text}`} style={{ width: '22px', height: '22px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={mod.icon} />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">{mod.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{mod.desc}</p>
                  <div className={`mt-4 text-xs ${c.text} font-medium opacity-0 group-hover:opacity-100 transition-opacity`}>
                    {isZh ? '立即使用 →' : 'Use now →'}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {isZh ? '三步完成出海合规决策' : 'Three Steps to Go-Global Compliance Decision'}
            </h2>
            <p className="text-gray-500">
              {isZh ? '从信息输入到方案落地，全流程AI辅助，让决策更快更准' : 'From input to solution delivery, AI-assisted throughout for faster and more accurate decisions'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                title: isZh ? '输入企业信息' : 'Input Company Information',
                desc: isZh ? '填报企业基础信息、目标市场、业务类型，平台智能匹配适用的政策法规与ESG标准' : 'Fill in company basics, target markets, and business type; platform intelligently matches applicable regulations',
                icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
              },
              {
                num: '02',
                title: isZh ? 'AI智能诊断分析' : 'AI Intelligent Diagnosis',
                desc: isZh ? '大模型自动完成合规诊断、风险评估、ESG测算，生成详细分析报告和优化建议' : 'LLM automatically completes compliance diagnosis, risk assessment, and ESG analysis with detailed reports',
                icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
              },
              {
                num: '03',
                title: isZh ? '生成落地方案' : 'Generate Actionable Solutions',
                desc: isZh ? '基于诊断结果，一键生成定制化合规方案、ESG体系搭建计划和出海路径规划' : 'One-click generation of customized compliance plans, ESG system setup, and go-global roadmaps',
                icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
              },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="relative inline-flex mb-6">
                  <div className="w-16 h-16 bg-white rounded-2xl border-2 border-blue-100 flex items-center justify-center shadow-sm">
                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                    </svg>
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {step.num.slice(1)}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Cases ── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isZh ? '精选出海案例' : 'Featured Case Studies'}
              </h2>
              <p className="text-gray-500 text-sm">
                {isZh ? '真实企业出海实践，提炼可复用的方法论与经验' : 'Real enterprise go-global practices with reusable methodologies'}
              </p>
            </div>
            <Link href={`/${locale}/cases`} className="text-blue-600 text-sm font-medium hover:underline shrink-0">
              {isZh ? '查看全部案例 →' : 'View All Cases →'}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCases.map((c) => {
              const company = isZh ? c.company : c.companyEn
              const industry = isZh ? c.industry : c.industryEn
              const region = isZh ? c.region : c.regionEn
              const challenge = isZh ? c.challenge : c.challengeEn
              const tags = isZh ? c.tags : c.tagsEn
              return (
                <Link
                  key={c.id}
                  href={`/${locale}/cases/${c.id}`}
                  className="rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:border-blue-200 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ backgroundColor: c.color }}>
                      {c.abbr}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{company}</p>
                      <p className="text-xs text-gray-400">{industry} · {region}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">{challenge}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-blue-600 py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {isZh ? '立即开启AI出海决策之旅' : 'Start Your AI Go-Global Decision Journey'}
          </h2>
          <p className="text-blue-100 mb-8">
            {isZh ? '注册即可免费使用AI智能问答，企业会员解锁全部十大功能模块' : 'Register free for AI consulting; enterprise membership unlocks all ten modules'}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href={`/${locale}/register`}
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 text-base">
              {isZh ? '免费注册' : 'Sign Up Free'}
            </Link>
            <Link href={`/${locale}/login`}
              className="inline-block border border-blue-400 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 text-base">
              {isZh ? '已有账号，立即登录' : 'Already have an account? Log In'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
