import Link from 'next/link'
import {
  academicAdvisors,
  academicMentors,
  industryMentors,
  supportingEnterprises,
  supportingInstitutions,
  teamMembers,
  iterationTimeline,
} from '@/lib/mentors-data'

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isZh = locale === 'zh'

  const departmentLabel: Record<string, { zh: string; en: string; bg: string; text: string }> = {
    leadership: { zh: '团队领导', en: 'Leadership', bg: 'bg-blue-50', text: 'text-blue-700' },
    product: { zh: '产品设计', en: 'Product Design', bg: 'bg-purple-50', text: 'text-purple-700' },
    mobile: { zh: '移动端开发', en: 'Mobile App', bg: 'bg-cyan-50', text: 'text-cyan-700' },
    content: { zh: '内容与运营', en: 'Content & Ops', bg: 'bg-pink-50', text: 'text-pink-700' },
    frontend: { zh: '前端开发', en: 'Frontend', bg: 'bg-green-50', text: 'text-green-700' },
    backend: { zh: '后端开发', en: 'Backend', bg: 'bg-orange-50', text: 'text-orange-700' },
  }

  const renderMentors = (list: typeof industryMentors) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
      {list.map((m) => (
        <div
          key={m.name}
          className="bg-white rounded-2xl border border-gray-200 p-4 text-center hover:shadow-md hover:border-blue-200 transition-all"
        >
          <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-gray-100 ring-2 ring-white shadow">
            {/* 使用原生 img 标签以避免外部域名需要 optimization */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={m.photo}
              alt={isZh ? m.name : m.nameEn}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="font-semibold text-gray-900 text-sm mb-1">{isZh ? m.name : m.nameEn}</p>
          <p className="text-xs text-gray-500 leading-snug">{isZh ? m.title : m.titleEn}</p>
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-medium mb-6 border border-white/20">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            {isZh ? 'XJTLU Entrepreneur College · ENT208TC · Session 2 · Group 13' : 'XJTLU Entrepreneur College · ENT208TC · Session 2 · Group 13'}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5 tracking-tight">
            {isZh ? '关于海问 HaiWen' : 'About HaiWen'}
          </h1>
          <p className="text-white/90 text-lg max-w-3xl mx-auto leading-relaxed">
            {isZh
              ? '海问是一家面向中国 AI 企业出海与 ESG 创新需求的自主咨询平台。我们相信：专业、实时、可信的决策支持不应只是少数头部企业的特权。'
              : 'HaiWen is a self-service consultation platform dedicated to supporting Chinese AI enterprises in global expansion and ESG innovation. We believe professional, real-time, citation-backed decision support should not be a privilege of a handful of large players.'}
          </p>
        </div>
      </section>

      {/* ── Who we are ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{isZh ? '我们是谁' : 'Who We Are'}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {isZh
                ? '海问（HaiWen）起源于 2026 年初，由西交利物浦大学太仓校区创业家学院（Entrepreneur College, Taicang）Session 2 Group 13 的六名大三学生共同发起，是 ENT208TC「Industry Readiness」课程的一个真实创业项目。'
                : 'HaiWen was founded in early 2026 by six third-year students from Session 2 Group 13 at the XJTLU Entrepreneur College (Taicang), as a real-world entrepreneurship project for the ENT208TC Industry Readiness course.'}
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              {isZh
                ? '我们关注的问题很具体：传统出海与 ESG 咨询动辄 3–6 个月、数十至上百万元费用，把中小 AI 企业、早期创业者和学术研究者都挡在门外。海问希望用 AI 自主咨询 + 可引用知识库，把这样的专业支持压缩到「60 秒以内」。'
                : 'The problem we focus on is concrete: traditional globalisation and ESG consulting often takes 3–6 months and costs hundreds of thousands of RMB, shutting out SMEs, early-stage founders and academic researchers. HaiWen aims to compress that experience into under 60 seconds — with AI self-service consultation backed by a citable knowledge base.'}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {isZh
                ? '项目由财新智库 · 中国 ESG30 人论坛发起的「ESG30 青年学者计划」中的相关课题衍生与支撑，并得到多位学术顾问、学术导师与业界导师的指导。'
                : 'The project is nurtured within and supported by related research under the "ESG30 Young Scholars Program" initiated by Caixin Think Tank and China ESG30 Forum, with guidance from a network of academic advisors and industry mentors.'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">{isZh ? '我们的价值观' : 'Our Values'}</h3>
            {[
              {
                icon: '🎯',
                title: isZh ? '真实而非虚饰' : 'Honest, Not Glossy',
                desc: isZh
                  ? '我们是学生团队，所有数据、案例、引用都指向真实出处；产品永远带着「还可以更好」的谦卑。'
                  : "We are students. All data, cases and citations trace to verifiable sources, and we openly show what's still work-in-progress.",
              },
              {
                icon: '🧭',
                title: isZh ? '基于证据的建议' : 'Evidence-Based Guidance',
                desc: isZh
                  ? 'AI 回答严格落回平台知识库，并在正文中标注来源，拒绝凭印象「自由发挥」。'
                  : 'Our AI answers are grounded in the platform knowledge base with inline citations — never free-form hallucination.',
              },
              {
                icon: '🌍',
                title: isZh ? '服务普惠的专业支持' : 'Professional Support, Democratised',
                desc: isZh
                  ? '让中小 AI 企业、学生与学者都能用上与大公司同样精度的合规与 ESG 决策支持。'
                  : 'SMEs, students and scholars deserve the same quality of compliance and ESG decision support as large enterprises.',
              },
            ].map((v, i) => (
              <div key={i} className="flex gap-3 mb-4 last:mb-0">
                <span className="text-xl shrink-0">{v.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">{v.title}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Iteration Timeline ── */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{isZh ? '迭代历程' : 'Iteration Journey'}</h2>
            <p className="text-gray-500 text-sm">
              {isZh
                ? '从 2026 年 2 月立项，到 5 月 Demo Day，我们经历了六轮真实迭代'
                : 'From kickoff in February 2026 to Demo Day in May, we went through six real iteration cycles'}
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-blue-200" />
            <div className="space-y-6">
              {iterationTimeline.map((item, i) => (
                <div key={i} className="flex gap-5 pl-12 relative">
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 ring-4 ring-gray-50">
                    {i + 1}
                  </div>
                  <div className="flex-1 bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-xs font-semibold text-blue-600">{isZh ? item.month : item.monthEn}</p>
                      <span className="text-gray-300">·</span>
                      <p className="text-sm font-semibold text-gray-900">{isZh ? item.title : item.titleEn}</p>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{isZh ? item.desc : item.descEn}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Team ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{isZh ? '核心团队' : 'Core Team'}</h2>
          <p className="text-gray-500 text-sm">
            {isZh
              ? 'Session 2 · Group 13 · 六位来自 XJTLU 创业家学院的大三学生'
              : 'Session 2 · Group 13 · Six third-year students from XJTLU Entrepreneur College'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {teamMembers.map((t) => {
            const d = departmentLabel[t.department]
            return (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                    style={{ backgroundColor: t.color }}
                  >
                    {t.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{isZh ? t.name : t.nameEn}</h3>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${d.bg} ${d.text} font-medium`}>
                        {isZh ? d.zh : d.en}
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 mt-0.5">{isZh ? t.role : t.roleEn}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{isZh ? t.responsibility : t.responsibilityEn}</p>
                <p className="text-[10px] text-gray-300 mt-2 font-mono">Student ID · {t.id}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Academic Advisors ── */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
              {isZh ? '项目受以下导师指导与支持' : 'Guided and supported by the following mentors'}
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{isZh ? '学术顾问' : 'Academic Advisors'}</h2>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto">
              {isZh
                ? '来自中国经济、金融监管与可持续发展领域的顶级学术与政策权威'
                : 'Top-tier authorities in China economics, financial regulation and sustainability'}
            </p>
          </div>
          <div className="mt-10">{renderMentors(academicAdvisors)}</div>
        </div>
      </section>

      {/* ── Academic Mentors ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{isZh ? '学术导师' : 'Academic Mentors'}</h2>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto">
            {isZh
              ? '来自北京大学、清华大学、中央财经大学的学者，在会计、公共管理与绿色金融等领域为项目提供指导'
              : 'Scholars from Peking University, Tsinghua University and CUFE, guiding the project across accounting, public management and green finance'}
          </p>
        </div>
        {renderMentors(academicMentors)}
      </section>

      {/* ── Industry Mentors ── */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{isZh ? '业界导师' : 'Industry Mentors'}</h2>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto">
              {isZh
                ? '来自金融、制造、ICT、可持续发展等产业一线的高管，为项目提供真实行业视角'
                : 'Senior executives from finance, manufacturing, ICT and sustainability — bringing real industry perspective'}
            </p>
          </div>
          {renderMentors(industryMentors)}
        </div>
      </section>

      {/* ── Supporting Enterprises ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
            {isZh ? '项目受以下头部企业与学术机构支持与建议' : 'Backed by the following enterprises and institutions'}
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{isZh ? '合作企业' : 'Supporting Enterprises'}</h2>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto">
            {isZh
              ? '通过 ESG30 青年学者计划，项目与以下国内外头部企业建立起沟通渠道'
              : 'Through the ESG30 Young Scholars Program, the project is connected with the following leading enterprises'}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {supportingEnterprises.map((e) => (
            <div
              key={e.zh}
              className="px-5 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-blue-300 hover:text-blue-700 transition-all"
            >
              {isZh ? e.zh : e.en}
            </div>
          ))}
        </div>
      </section>

      {/* ── Supporting Institutions ── */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {isZh ? '学术合作机构' : 'Academic Partner Institutions'}
            </h2>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto">
              {isZh
                ? '中外顶尖高校与研究机构为项目提供学术资源与研究方法论支持'
                : 'Leading universities and research institutes worldwide provide academic resources and methodology support'}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {supportingInstitutions.map((inst) => (
              <div
                key={inst.zh}
                className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-md hover:border-blue-200 transition-all"
              >
                <p className="text-sm font-medium text-gray-800 leading-relaxed">{isZh ? inst.zh : inst.en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Funders ── */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {isZh ? '资助方' : 'Funders'}
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          {isZh
            ? '项目受以下智库与论坛的资助与支持'
            : 'The project is funded and supported by the following think tanks and forums'}
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="px-8 py-5 bg-white border-2 border-blue-200 rounded-2xl">
            <p className="text-base font-bold text-blue-700 mb-1">
              {isZh ? '财新智库' : 'Caixin Think Tank'}
            </p>
            <p className="text-xs text-gray-500">
              {isZh ? 'Caixin Think Tank' : '财新智库'}
            </p>
          </div>
          <div className="px-8 py-5 bg-white border-2 border-indigo-200 rounded-2xl">
            <p className="text-base font-bold text-indigo-700 mb-1">
              {isZh ? '中国 ESG30 人论坛' : 'China ESG30 Forum'}
            </p>
            <p className="text-xs text-gray-500">
              {isZh ? 'China ESG30 Forum' : '中国 ESG30 人论坛'}
            </p>
          </div>
        </div>
      </section>

      {/* ── Project Archive ── */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
              {isZh ? '透明 · 可追溯' : 'Transparent · Traceable'}
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {isZh ? '项目档案' : 'Project Archive'}
            </h2>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto">
              {isZh
                ? '我们公开自己的项目过程文档 —— 立项简报、用户调研、迭代日志、源代码 —— 评委与合作伙伴可以验证我们说的每一句话。'
                : 'We open up our process artefacts — project brief, user research, iteration log, source code — so reviewers and partners can verify every claim.'}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                titleZh: '项目立项简报',
                titleEn: 'Project Brief',
                descZh: 'ENT208TC 行业实践课程提交版 · 含问题陈述、目标用户、解决方案与成功指标',
                descEn: 'ENT208TC Industry Readiness submitted version · problem, target users, solution, success metrics',
                href: '#',
                badge: 'PDF',
              },
              {
                icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                titleZh: '用户调研问卷',
                titleEn: 'User Research Survey',
                descZh: '7 部分（A–G）共 35 题，覆盖痛点识别、方案验证、可用性偏好与开放反馈',
                descEn: '7 sections (A–G), 35 questions covering pain points, solution validation, usability and open feedback',
                href: `/${locale}/validation`,
                badge: isZh ? '查看证据 →' : 'View evidence →',
              },
              {
                icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
                titleZh: '开发日志',
                titleEn: 'Development Log',
                descZh: '从 2026-02 立项到 5 月 Demo Day 的完整迭代记录（SharePoint）',
                descEn: 'Complete iteration log from Feb 2026 kickoff to May Demo Day (SharePoint)',
                href: 'https://xjtlums-my.sharepoint.com/:w:/g/personal/fanpei_liu23_student_xjtlu_edu_cn/IQBBfah3WhawTImzHlinM0UnAY1QAfLJ3wtdMi0PrfCjaxA',
                badge: 'SharePoint',
                external: true,
              },
              {
                icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
                titleZh: 'GitHub 源代码',
                titleEn: 'GitHub Source',
                descZh: '完整 Next.js + Supabase + pgvector 工程，含 RAG、周更 Agent 与全部前端代码',
                descEn: 'Complete Next.js + Supabase + pgvector codebase, including RAG, weekly agent and all frontend code',
                href: 'https://github.com/fanpeiliu123/hq-haiwhen',
                badge: 'github.com',
                external: true,
              },
              {
                icon: 'M13 7l5 5m0 0l-5 5m5-5H6',
                titleZh: '在线产品（本网站）',
                titleEn: 'Live Product',
                descZh: 'Vercel 部署 · 与 Supabase 实时同步 · 周一 00:00 UTC 自动周更',
                descEn: 'Deployed on Vercel · live Supabase sync · auto weekly update Monday 00:00 UTC',
                href: 'https://hq-haiwhen.vercel.app',
                badge: 'vercel.app',
                external: true,
              },
              {
                icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
                titleZh: 'APP ↔ Web 同步收件箱',
                titleEn: 'APP ↔ Web Inbox',
                descZh: '手机端推送一键同步到电脑端 · 6 位同步码无需注册即可演示',
                descEn: 'One-tap mobile-to-web sync · 6-character code, demo without registration',
                href: `/${locale}/inbox`,
                badge: isZh ? '试一下 →' : 'Try now →',
              },
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noreferrer' : undefined}
                className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-blue-200 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                  </div>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md font-mono">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5 text-sm">
                  {isZh ? item.titleZh : item.titleEn}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {isZh ? item.descZh : item.descEn}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-2xl font-bold mb-3">
            {isZh ? '一起让中国 AI 企业合规、自信地走向世界' : "Let's help Chinese AI enterprises go global with confidence"}
          </h2>
          <p className="text-white/85 text-sm mb-8 max-w-xl mx-auto leading-relaxed">
            {isZh
              ? '无论您是企业用户、研究学者、投资机构，还是希望加入我们的学生，都欢迎联系。'
              : 'Enterprise users, researchers, investors or students who want to join — we welcome the conversation.'}
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link
              href={`/${locale}/chat`}
              className="px-6 py-3 bg-white text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-50 shadow"
            >
              {isZh ? '60 秒试用 AI 咨询' : 'Try AI Consulting in 60s'}
            </Link>
            <Link
              href={`/${locale}/validation`}
              className="px-6 py-3 bg-white/10 text-white border border-white/30 rounded-xl text-sm font-medium hover:bg-white/20"
            >
              {isZh ? '查看用户验证证据' : 'See User Validation Evidence'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
