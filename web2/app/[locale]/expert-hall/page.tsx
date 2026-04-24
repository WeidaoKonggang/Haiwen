import Link from 'next/link'
import { expertData } from '@/lib/mock-data'

export default async function ExpertHallPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isZh = locale === 'zh'

  const specialties = [
    { id: 'all', label: '全部', labelEn: 'All' },
    { id: 'ai', label: 'AI监管合规', labelEn: 'AI Regulation' },
    { id: 'data', label: '数据保护', labelEn: 'Data Protection' },
    { id: 'esg', label: 'ESG咨询', labelEn: 'ESG Advisory' },
    { id: 'trade', label: '国际贸易', labelEn: 'International Trade' },
    { id: 'ip', label: '知识产权', labelEn: 'IP Law' },
  ]

  const ratingStars = (rating: number) => {
    const full = Math.floor(rating)
    return '★'.repeat(full) + '☆'.repeat(5 - full)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{isZh ? '专家大厅' : 'Expert Hall'}</h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              {isZh
                ? '汇聚全球顶尖AI合规、ESG咨询、国际法律与出海战略专家，为企业出海提供专业支持'
                : 'World-class experts in AI compliance, ESG advisory, international law, and global expansion strategy'}
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-12">
            {[
              { value: '50+', label: isZh ? '认证专家' : 'Certified Experts' },
              { value: '20+', label: isZh ? '国家/地区覆盖' : 'Countries Covered' },
              { value: '98%', label: isZh ? '客户满意度' : 'Client Satisfaction' },
              { value: '24h', label: isZh ? '平均响应时效' : 'Avg. Response Time' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold text-blue-600">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Filter */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <span className="text-sm text-gray-500">{isZh ? '专业领域：' : 'Specialty:'}</span>
          {specialties.map(s => (
            <button key={s.id}
              className={`px-4 py-1.5 rounded-xl text-sm border transition-colors ${s.id === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 bg-white'}`}>
              {isZh ? s.label : s.labelEn}
            </button>
          ))}
          <input type="text" placeholder={isZh ? '搜索专家姓名/机构...' : 'Search by name or institution...'}
            className="ml-auto border border-gray-200 rounded-xl px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white w-56" />
        </div>

        {/* Expert Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {expertData.map(expert => (
            <div key={expert.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {expert.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 text-sm">{expert.name}</h3>
                    {expert.verified && (
                      <span className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full">{isZh ? '认证' : 'Verified'}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{expert.title}</p>
                  <p className="text-xs text-gray-400">{expert.institution}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {expert.specialties.map(s => (
                  <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>

              <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">{expert.bio}</p>

              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <div>
                  <p className="text-xs text-yellow-500">{ratingStars(expert.rating)} <span className="text-gray-500">{expert.rating}</span></p>
                  <p className="text-xs text-gray-400">{expert.cases}{isZh ? '个成功案例' : ' cases'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-600">¥{expert.hourlyRate}<span className="text-xs font-normal text-gray-400">/hr</span></p>
                  <Link href={`/${locale}/ai-chat`}
                    className="text-xs text-blue-600 border border-blue-200 px-3 py-1 rounded-lg hover:bg-blue-50 inline-block mt-1">
                    {isZh ? '预约咨询' : 'Book Now'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-xl font-bold mb-2">{isZh ? '成为海问认证专家' : 'Become a HaiWen Certified Expert'}</h2>
          <p className="text-white/80 text-sm mb-5 max-w-md mx-auto">
            {isZh
              ? '加入海问专家生态，连接数千家出海企业客户，共同推动中国企业合规出海发展'
              : 'Join the HaiWen expert network, connect with thousands of global expansion clients, and drive compliant overseas growth together'}
          </p>
          <button className="px-6 py-2.5 bg-white text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors">
            {isZh ? '申请成为专家 →' : 'Apply to Join →'}
          </button>
        </div>
      </div>
    </div>
  )
}
