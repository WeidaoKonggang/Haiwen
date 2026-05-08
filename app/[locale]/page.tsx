import Link from 'next/link'
import { casesData } from '@/lib/cases-data'
import { policyData, esgStandardsData, expertData } from '@/lib/mock-data'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isZh = locale === 'zh'

  const modules = [
    { id: 'ai-chat', href: '/chat', color: 'blue', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', title: isZh ? 'AI 智能问答' : 'AI Consulting', desc: isZh ? '基于 RAG 的出海 / ESG 专业咨询，每句回答都带引用来源' : 'RAG-grounded globalisation & ESG consulting with inline citations' },
    { id: 'policy-db', href: '/policy-db', color: 'indigo', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', title: isZh ? '政策与 ESG 数据库' : 'Policy & ESG Database', desc: isZh ? '覆盖欧美、东南亚、中东等主要市场的 AI 监管与 ESG 标准' : 'AI regulation & ESG standards across EU, US, SEA, MENA and beyond' },
    { id: 'diagnosis', href: '/diagnosis', color: 'violet', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', title: isZh ? '合规资质诊断' : 'Compliance Diagnosis', desc: isZh ? '四步填报 → AI 自动诊断合规缺口并给出整改优先级' : 'Four-step intake → AI diagnoses gaps and ranks remediation priorities' },
    { id: 'risk-assessment', href: '/risk-assessment', color: 'orange', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: isZh ? '风险智能评估' : 'Risk Assessment', desc: isZh ? '六维度风险模型，覆盖政策、数据、ESG、地缘、供应链与市场' : 'Six-dimensional model: policy, data, ESG, geopolitics, supply chain, market' },
    { id: 'esg-manage', href: '/esg-manage', color: 'green', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z', title: isZh ? 'ESG 全流程管理' : 'ESG Management', desc: isZh ? '适配 AI 行业的 ESG 数据采集、报告生成与评级改进' : 'AI-adapted ESG data collection, report generation and rating improvement' },
    { id: 'decision-engine', href: '/decision-engine', color: 'cyan', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7', title: isZh ? '出海决策引擎' : 'Decision Engine', desc: isZh ? '多维度评分目的地，给出模式选择与路径建议' : 'Multi-factor destination scoring with entry-mode and roadmap recommendations' },
    { id: 'expert-hall', href: '/expert-hall', color: 'pink', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', title: isZh ? '专家咨询服务' : 'Expert Consulting', desc: isZh ? '出海合规、ESG 管理、跨境税务等领域的专业顾问资源' : 'Consultants on globalisation, ESG, and cross-border tax' },
    { id: 'cases', href: '/cases', color: 'teal', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', title: isZh ? '行业案例库' : 'Case Library', desc: isZh ? '中国 AI 企业真实出海与 ESG 案例，支持多维度对标学习' : 'Real Chinese AI go-global & ESG cases with multi-dimensional benchmarking' },
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

  // 真实库里的计数，避免虚标
  const stats = [
    {
      num: `${policyData.length}+`,
      label: isZh ? '政策条目' : 'Policy Entries',
      sub: isZh ? '持续扩充中' : 'Growing weekly',
    },
    {
      num: `${esgStandardsData.length}+`,
      label: isZh ? 'ESG 标准' : 'ESG Standards',
      sub: 'GRI · ISSB · CSRD',
    },
    {
      num: `${casesData.length}+`,
      label: isZh ? '出海案例' : 'Case Studies',
      sub: isZh ? '中国 AI 企业真实案例' : 'Real Chinese AI cases',
    },
    {
      num: `${expertData.length}+`,
      label: isZh ? '领域专家' : 'Domain Experts',
      sub: isZh ? '法律 · 税务 · ESG' : 'Legal · Tax · ESG',
    },
  ]

  // 预填到 /chat?q=... 的演示问题，让游客真的能「60 秒看到答案」
  const demoQuestion = isZh
    ? 'EU AI Act 对我的 AI SaaS 产品有哪些具体合规要求？'
    : 'What specific EU AI Act compliance obligations apply to my AI SaaS product?'

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-20 pb-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 opacity-70" />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(59,130,246,0.08) 1px, transparent 1px), radial-gradient(circle at 80% 70%, rgba(99,102,241,0.08) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }} />
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-7 border border-blue-100">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            {isZh
              ? 'XJTLU Entrepreneur College · ENT208TC · Session 2 Group 13'
              : 'XJTLU Entrepreneur College · ENT208TC · Session 2 Group 13'}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-5 tracking-tight leading-[1.15]">
            {isZh ? (
              <>
                传统出海 / ESG 咨询 <span className="whitespace-nowrap text-blue-600">3–6 个月、¥100K–¥1M</span>
                <br />
                <span className="text-gray-600 text-3xl sm:text-4xl lg:text-5xl font-semibold">
                  海问把它压缩到 <span className="text-blue-600">60 秒以内</span>
                </span>
              </>
            ) : (
              <>
                Traditional consulting takes <span className="whitespace-nowrap text-blue-600">3–6 months, ¥100K–¥1M</span>.
                <br />
                <span className="text-gray-600 text-3xl sm:text-4xl lg:text-5xl font-semibold">
                  HaiWen delivers it in <span className="text-blue-600">under 60 seconds</span>.
                </span>
              </>
            )}
          </h1>

          <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed">
            {isZh
              ? '面向中国 AI 企业的 RAG 驱动自主咨询平台 — 把政策、案例、专家压进向量库，每个答案都在正文中标注引用出处。'
              : 'A RAG-powered self-service consultation platform for Chinese AI enterprises — policies, cases and experts are embedded into our vector knowledge base, and every answer surfaces its sources inline.'}
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap mb-5">
            <Link
              href={`/${locale}/chat?q=${encodeURIComponent(demoQuestion)}`}
              className="group bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-700 text-base shadow-md shadow-blue-100 inline-flex items-center gap-2"
            >
              <span>{isZh ? '60 秒试用 AI 咨询' : 'Try AI Consulting in 60 seconds'}</span>
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href={`/${locale}/trends`}
              className="border border-gray-200 text-gray-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-50 text-base inline-flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              {isZh ? '最新全球 AI 监管动态' : 'Latest Global AI Trends'}
            </Link>
          </div>

          <p className="text-xs text-gray-400">
            {isZh
              ? '无需注册 · 点击即可以游客身份即时体验 · 你问的第一个问题会自动预填'
              : 'No registration needed · Try it as a guest instantly · Your first question is pre-filled'}
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-gray-900 py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-white mb-1">{s.num}</div>
              <div className="text-sm text-gray-300 mb-0.5">{s.label}</div>
              <div className="text-[11px] text-gray-500">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Persona — 为谁而建 ── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
              {isZh ? '为谁而建' : 'Built For'}
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {isZh ? '一个平台 · 三类用户 · 各有专属路径' : 'One platform · Three personas · Tailored journeys'}
            </h2>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto">
              {isZh
                ? '点击你的身份，30 秒内进入最适合你的入口。每条路径下都内置了「专家模式」与「入门模式」两种交互。'
                : 'Pick your role and reach the right entry within 30 seconds. Every path supports both "Expert" and "Beginner" interaction modes.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                emoji: '🚀',
                tagZh: 'AI 创业者',
                tagEn: 'AI Founder',
                quoteZh: '"找麦肯锡贵又慢，问 ChatGPT 又怕错。我需要 60 秒就能拿到带引用的合规建议。"',
                quoteEn: '"McKinsey is slow and expensive; ChatGPT might hallucinate. I need a cited compliance answer in 60 seconds."',
                ctaZh: '直接体验 AI 问答',
                ctaEn: 'Try AI Consulting',
                ctaHref: `/${locale}/chat?q=${encodeURIComponent(isZh ? 'EU AI Act 对我的 AI SaaS 产品有哪些具体合规要求？' : 'What specific EU AI Act compliance obligations apply to my AI SaaS product?')}`,
                color: 'from-blue-500 to-indigo-600',
                ring: 'ring-blue-100',
              },
              {
                emoji: '📋',
                tagZh: 'ESG 总监 / 合规官',
                tagEn: 'ESG Director / Officer',
                quoteZh: '"全球 ESG 框架变得太快，团队跟不上。我要的是一个每周更新的政策雷达。"',
                quoteEn: '"Global ESG frameworks change too fast for any team to keep up. I need a weekly-updated regulatory radar."',
                ctaZh: '查看政策库 + 周更动态',
                ctaEn: 'Browse Policy DB & Trends',
                ctaHref: `/${locale}/trends`,
                color: 'from-emerald-500 to-teal-600',
                ring: 'ring-emerald-100',
              },
              {
                emoji: '🎓',
                tagZh: '学者 / 学生',
                tagEn: 'Academic / Student',
                quoteZh: '"课程跟不上行业实践。一个带真实出处、按行业分类的案例库对教学和研究都极其有用。"',
                quoteEn: '"Course materials lag industry. A sourced, industry-tagged case library is invaluable for teaching and research."',
                ctaZh: '进入案例库',
                ctaEn: 'Explore Case Library',
                ctaHref: `/${locale}/cases`,
                color: 'from-purple-500 to-pink-600',
                ring: 'ring-purple-100',
              },
            ].map((p) => (
              <div
                key={p.tagEn}
                className={`group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:ring-4 ${p.ring} transition-all`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center text-2xl shadow-md`}>
                    {p.emoji}
                  </div>
                  <p className="font-bold text-gray-900 text-base">
                    {isZh ? p.tagZh : p.tagEn}
                  </p>
                </div>
                <blockquote className="text-sm text-gray-600 leading-relaxed mb-5 italic">
                  {isZh ? p.quoteZh : p.quoteEn}
                </blockquote>
                <Link
                  href={p.ctaHref}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 group-hover:text-blue-700"
                >
                  {isZh ? p.ctaZh : p.ctaEn}
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SLA 承诺条 (Project Brief Section 4) ── */}
      <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">
              {isZh ? '我们的服务等级承诺' : 'Our Service-Level Promise'}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {isZh ? '不是 marketing — 是写在 Project Brief 里的可验证指标' : 'Not marketing — verifiable metrics from our Project Brief'}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { num: '< 60s', labelZh: '响应速度', labelEn: 'Response time', subZh: '从发问到拿到带引用的答案', subEn: 'From question to cited answer' },
              { num: '> 80%', labelZh: '完成率', labelEn: 'Completion rate', subZh: '测试用户完整跑通核心流程', subEn: 'Test users finish full core flow' },
              { num: '≥ 4.0 / 5', labelZh: '满意度', labelEn: 'Satisfaction', subZh: '咨询内容用户评分', subEn: 'User rating of consultation' },
              { num: '−70%', labelZh: '成本节省', labelEn: 'Cost saved', subZh: '相比传统 ¥100K+ 咨询', subEn: 'vs ¥100K+ traditional consulting' },
            ].map((s) => (
              <div key={s.labelEn} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/15 text-center">
                <div className="text-3xl font-bold text-white mb-2">{s.num}</div>
                <div className="text-sm font-semibold text-white/95 mb-0.5">{isZh ? s.labelZh : s.labelEn}</div>
                <div className="text-[11px] text-white/70 leading-relaxed">{isZh ? s.subZh : s.subEn}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Modules ── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {isZh ? '八大核心功能模块' : 'Eight Core Modules'}
            </h2>
            <p className="text-gray-500">
              {isZh ? '从智能问答到决策落地，一站式覆盖 AI 企业出海与 ESG 全流程' : 'From AI Q&A to decision execution — covering the full AI globalisation & ESG journey'}
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
                    <svg className={`${c.text}`} style={{ width: '22px', height: '22px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
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

      {/* ── Differentiators ── */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
              {isZh ? '技术差异化' : 'What Makes Us Different'}
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {isZh ? '不是套壳 ChatGPT —— 是真正的垂直 RAG 平台' : 'Not another ChatGPT wrapper — a real vertical RAG platform'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: 'M9 12h6m-3-3v6m9-3a9 9 0 11-18 0 9 9 0 0118 0z',
                title: isZh ? 'RAG 带引用' : 'RAG with citations',
                desc: isZh
                  ? '每次问答都会先检索平台知识库（政策 + 案例 + 专家），System Prompt 强制模型在正文中以括号标注来源。'
                  : 'Every question first retrieves from our knowledge base (policies + cases + experts). The system prompt forces the model to cite sources inline.',
                tag: 'pgvector · Zhipu GLM embedding-3',
              },
              {
                icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
                title: isZh ? '周更 Agent' : 'Weekly Agent',
                desc: isZh
                  ? '每周一自动搜索 10 类全球 AI 监管主题（EU AI Act、GDPR、CSRD、ISSB…），DeepSeek 总结后自动入库，前台 /trends 实时可见。'
                  : 'Every Monday the agent searches 10 global AI-reg topics (EU AI Act, GDPR, CSRD, ISSB…), DeepSeek summarises, and results auto-index to the knowledge base and /trends page.',
                tag: 'Tavily · DeepSeek · Vercel Cron',
              },
              {
                icon: 'M13 10V3L4 14h7v7l9-11h-7z',
                title: isZh ? '三层去重与幂等' : '3-Layer Deduplication',
                desc: isZh
                  ? '同主题 + 同日跳过、每主题最多保留 4 条、接口返回四项计数，即使反复触发也不会堆积脏数据。'
                  : 'Same-topic-same-day skip, top-4 per topic, and four-count response so repeated triggers never pollute the store.',
                tag: 'Idempotent by design',
              },
            ].map((f) => (
              <div key={f.title} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:border-blue-200 transition-all">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{f.desc}</p>
                <span className="inline-block text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md font-mono">
                  {f.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {isZh ? '三步完成出海合规决策' : 'Three Steps to a Go-Global Decision'}
            </h2>
            <p className="text-gray-500">
              {isZh ? '从信息输入到方案落地，全流程 AI 辅助，让决策更快更准' : 'End-to-end AI assistance, faster and more accurate decisions'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                title: isZh ? '输入企业信息' : 'Input Company Info',
                desc: isZh ? '填报企业基础信息、目标市场、业务类型，平台智能匹配适用法规与 ESG 标准' : 'Enter company basics, target markets and product type; the platform auto-matches applicable regulations',
                icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
              },
              {
                num: '02',
                title: isZh ? 'AI 智能诊断分析' : 'AI Intelligent Diagnosis',
                desc: isZh ? 'RAG 检索 + LLM 总结，生成带引用的合规诊断、风险评估与 ESG 测算报告' : 'RAG retrieval + LLM synthesis produce a cited compliance diagnosis, risk assessment and ESG evaluation',
                icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
              },
              {
                num: '03',
                title: isZh ? '生成落地方案' : 'Generate Actionable Plans',
                desc: isZh ? '基于诊断结果，一键输出定制化合规方案、ESG 体系搭建计划与出海路径规划' : 'Auto-generate tailored compliance plans, ESG roadmaps, and go-global pathways',
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
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-3">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isZh ? '精选出海案例' : 'Featured Case Studies'}
              </h2>
              <p className="text-gray-500 text-sm">
                {isZh ? '真实企业出海实践，提炼可复用的方法论与经验' : 'Real enterprise practices with reusable methodologies'}
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
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:border-blue-200 transition-all group"
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

      {/* ── Trust / Mentor teaser ── */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
            {isZh ? '项目受以下机构与学者支持' : 'Backed by the following institutions and scholars'}
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {isZh ? '不是学生孤军作战' : 'Not building in isolation'}
          </h2>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto mb-8 leading-relaxed">
            {isZh
              ? '项目得到财新智库、中国 ESG30 人论坛资助，接入 4 位学术顾问、3 位学术导师与 11 位业界导师的指导网络，并与来自字节、腾讯、联想、蚂蚁、蔚来等头部企业建立沟通渠道。'
              : 'Funded by Caixin Think Tank & China ESG30 Forum. Guided by 4 academic advisors, 3 academic mentors and 11 industry mentors. Connected with leading enterprises including ByteDance, Tencent, Lenovo, Ant Group and NIO.'}
          </p>
          <Link
            href={`/${locale}/about`}
            className="inline-flex items-center gap-1 text-blue-600 text-sm font-medium hover:underline"
          >
            {isZh ? '了解团队与导师网络 →' : 'Meet the team and mentor network →'}
          </Link>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {isZh ? '立即开启 AI 出海决策之旅' : 'Start Your AI Go-Global Decision Journey'}
          </h2>
          <p className="text-blue-100 mb-8">
            {isZh ? '无需注册，立即以游客身份体验 RAG 带引用的 AI 咨询' : 'No signup needed — try our citation-backed AI consulting as a guest right now'}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href={`/${locale}/chat?q=${encodeURIComponent(demoQuestion)}`}
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 text-base"
            >
              {isZh ? '60 秒试用' : 'Try in 60 seconds'}
            </Link>
            <Link
              href={`/${locale}/register`}
              className="inline-block border border-blue-300 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 text-base"
            >
              {isZh ? '免费注册' : 'Sign Up Free'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
