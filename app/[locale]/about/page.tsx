import Link from 'next/link'

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isZh = locale === 'zh'

  const milestones = [
    { year: '2023 Q1', event: isZh ? '海问创立，专注于AI企业出海合规领域' : 'HaiWen founded, focused on AI enterprise overseas compliance' },
    { year: '2023 Q3', event: isZh ? '完成天使轮融资，推出第一版合规诊断产品' : 'Completed angel round, launched first compliance diagnosis product' },
    { year: '2024 Q1', event: isZh ? '政策数据库上线，覆盖30+国家AI相关法规' : 'Policy database launched, covering 30+ countries AI regulations' },
    { year: '2024 Q3', event: isZh ? 'ESG管理模块上线，服务企业超过500家' : 'ESG management module launched, serving 500+ enterprises' },
    { year: '2024 Q4', event: isZh ? '完成Pre-A轮融资，用户数突破10,000' : 'Completed Pre-A round, users exceeded 10,000' },
  ]

  const team = [
    { name: isZh ? '陈海文' : 'Chen Haiwen', role: isZh ? '联合创始人 & CEO' : 'Co-founder & CEO', bg: isZh ? '前BAT合规总监，10年AI行业从业经验' : 'Former BAT Compliance Director, 10 years in AI industry', avatar: '陈' },
    { name: isZh ? '王思远' : 'Wang Siyuan', role: isZh ? '联合创始人 & CTO' : 'Co-founder & CTO', bg: isZh ? '前谷歌工程师，专注于AI安全与隐私技术' : 'Former Google Engineer, focused on AI security and privacy technology', avatar: '王' },
    { name: isZh ? '林嘉欣' : 'Lin Jiaxin', role: isZh ? '首席合规官 & 合伙人' : 'Chief Compliance Officer & Partner', bg: isZh ? '国际律师事务所合规律师，欧盟GDPR专家' : 'International law firm compliance lawyer, EU GDPR expert', avatar: '林' },
    { name: isZh ? '赵明远' : 'Zhao Mingyuan', role: isZh ? 'ESG研究总监' : 'Director of ESG Research', bg: isZh ? '前明晟MSCI ESG分析师，GRI认证顾问' : 'Former MSCI ESG Analyst, GRI Certified Advisor', avatar: '赵' },
  ]

  const investors = ['红杉资本中国', '高瓴创投', '天图投资', '源码资本']
  const investorsEn = ['Sequoia Capital China', 'Hillhouse Ventures', 'TianTu Capital', 'Source Code Capital']

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">{isZh ? '关于海问 HaiWen' : 'About HaiWen'}</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            {isZh
              ? '我们的使命是让每一家中国AI企业都能合规、自信地走向全球市场'
              : 'Our mission is to help every Chinese AI company go global with compliance confidence'}
          </p>
        </div>
      </div>

      {/* Vision */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{isZh ? '我们是谁' : 'Who We Are'}</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {isZh
                ? '海问（HaiWen）是一家专注于AI企业出海合规的科技公司，通过AI驱动的合规SaaS平台，帮助中国AI企业应对全球监管挑战，实现合规出海。'
                : 'HaiWen is a technology company focused on compliance for AI companies going global. Through an AI-driven compliance SaaS platform, we help Chinese AI enterprises navigate global regulatory challenges and expand overseas compliantly.'}
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              {isZh
                ? '我们整合了30+国家地区的AI监管法规、ESG标准体系与出海实践案例，结合顶尖合规专家资源，为企业提供从诊断到落地的一站式合规解决方案。'
                : 'We integrate AI regulatory frameworks from 30+ countries, ESG standard systems, and overseas expansion cases, combined with top compliance expert resources, to provide enterprises with end-to-end compliance solutions from diagnosis to implementation.'}
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {[
                { value: '500+', label: isZh ? '服务企业' : 'Enterprises Served' },
                { value: '30+', label: isZh ? '覆盖国家' : 'Countries Covered' },
                { value: '100+', label: isZh ? '合规法规' : 'Regulations Tracked' },
                { value: '50+', label: isZh ? '认证专家' : 'Certified Experts' },
              ].map((s, i) => (
                <div key={i} className="bg-blue-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-blue-600">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{isZh ? '我们的价值观' : 'Our Values'}</h3>
            {[
              { icon: '🎯', title: isZh ? '专业专注' : 'Professional Focus', desc: isZh ? '深耕AI出海合规领域，持续提升专业深度' : 'Deep expertise in AI global compliance, continuously improving professional depth' },
              { icon: '🤝', title: isZh ? '信任透明' : 'Trust & Transparency', desc: isZh ? '数据安全第一，对企业客户保持完全透明' : 'Data security first, complete transparency with enterprise clients' },
              { icon: '🚀', title: isZh ? '持续创新' : 'Continuous Innovation', desc: isZh ? 'AI驱动合规科技，不断探索更高效的解决方案' : 'AI-driven compliance technology, constantly exploring more efficient solutions' },
            ].map((v, i) => (
              <div key={i} className="flex gap-3 mb-4 last:mb-0">
                <span className="text-xl shrink-0">{v.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">{v.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{isZh ? '发展历程' : 'Our Journey'}</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-100" />
            <div className="space-y-6">
              {milestones.map((m, i) => (
                <div key={i} className="flex gap-6 pl-12 relative">
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 pb-2">
                    <p className="text-sm font-semibold text-blue-600 mb-0.5">{m.year}</p>
                    <p className="text-sm text-gray-700">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{isZh ? '核心团队' : 'Core Team'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-5 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                  {t.avatar}
                </div>
                <h3 className="font-semibold text-gray-900 mb-0.5">{t.name}</h3>
                <p className="text-xs text-blue-600 mb-2">{t.role}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{t.bg}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Investors */}
        <div className="mb-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{isZh ? '投资方' : 'Investors'}</h2>
          <div className="flex justify-center gap-6 flex-wrap">
            {(isZh ? investors : investorsEn).map((inv, i) => (
              <div key={i} className="px-6 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm font-medium text-gray-700">
                {inv}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-xl font-bold mb-2">{isZh ? '一起推动中国AI企业合规出海' : 'Together Driving Compliant Global Expansion for Chinese AI Enterprises'}</h3>
          <p className="text-white/80 text-sm mb-5">{isZh ? '无论您是企业用户、专家顾问还是投资机构，欢迎与我们合作' : 'Whether you are an enterprise user, expert advisor, or investor, we welcome your collaboration'}</p>
          <div className="flex justify-center gap-3">
            <Link href={`/${locale}/login`}
              className="px-5 py-2.5 bg-white text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-50">
              {isZh ? '免费试用' : 'Try for Free'}
            </Link>
            <Link href={`/${locale}/expert-hall`}
              className="px-5 py-2.5 bg-white/10 text-white border border-white/30 rounded-xl text-sm font-medium hover:bg-white/20">
              {isZh ? '联系我们' : 'Contact Us'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
