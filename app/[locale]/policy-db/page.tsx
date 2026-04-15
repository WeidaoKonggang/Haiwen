'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import { policyData, esgStandardsData } from '@/lib/mock-data'

const riskColors: Record<string, { bg: string; text: string; border: string }> = {
  high: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  medium: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  low: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
}

const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: 'bg-green-50', text: 'text-green-700' },
  draft: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
  expired: { bg: 'bg-gray-50', text: 'text-gray-500' },
}

export default function PolicyDbPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const isZh = locale === 'zh'

  const [activeTab, setActiveTab] = useState<'policies' | 'esg'>('policies')
  const [search, setSearch] = useState('')
  const [filterCountry, setFilterCountry] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [filterRisk, setFilterRisk] = useState('all')

  const countries = ['all', ...Array.from(new Set(policyData.map((p) => isZh ? p.country : p.countryEn)))]
  const types = ['all', ...Array.from(new Set(policyData.map((p) => isZh ? p.type : p.typeEn)))]

  const filteredPolicies = policyData.filter((p) => {
    const title = isZh ? p.title : p.titleEn
    const country = isZh ? p.country : p.countryEn
    const type = isZh ? p.type : p.typeEn
    const matchSearch = !search || title.toLowerCase().includes(search.toLowerCase()) || country.toLowerCase().includes(search.toLowerCase())
    const matchCountry = filterCountry === 'all' || country === filterCountry
    const matchType = filterType === 'all' || type === filterType
    const matchRisk = filterRisk === 'all' || p.riskLevel === filterRisk
    return matchSearch && matchCountry && matchType && matchRisk
  })

  const filteredEsg = esgStandardsData.filter((s) => {
    const name = isZh ? s.name : s.nameEn
    return !search || name.toLowerCase().includes(search.toLowerCase())
  })

  const riskLabel: Record<string, string> = {
    high: isZh ? '高风险' : 'High Risk',
    medium: isZh ? '中风险' : 'Medium Risk',
    low: isZh ? '低风险' : 'Low Risk',
  }

  const statusLabel: Record<string, string> = {
    active: isZh ? '现行有效' : 'In Effect',
    draft: isZh ? '草案阶段' : 'Draft',
    expired: isZh ? '已失效' : 'Expired',
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {isZh ? '政策与ESG数据库' : 'Policy & ESG Database'}
          </h1>
          <p className="text-gray-500 text-sm">
            {isZh ? '覆盖全球30+国家，实时跟踪AI监管与ESG标准动态' : 'Covering 30+ countries, tracking AI regulation and ESG standards in real time'}
          </p>

          {/* Search */}
          <div className="mt-5 relative max-w-xl">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isZh ? '搜索政策名称、国家、关键词...' : 'Search policy name, country, keyword...'}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('policies')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'policies' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {isZh ? `出海政策法规（${filteredPolicies.length}条）` : `Go-Global Policies (${filteredPolicies.length})`}
          </button>
          <button
            onClick={() => setActiveTab('esg')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'esg' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {isZh ? `ESG标准体系（${filteredEsg.length}项）` : `ESG Standards (${filteredEsg.length})`}
          </button>
        </div>

        {/* Filters (policies tab only) */}
        {activeTab === 'policies' && (
          <div className="flex flex-wrap gap-3 mb-6">
            <select value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 bg-white min-w-[130px]">
              <option value="all">{isZh ? '全部国家' : 'All Countries'}</option>
              {countries.slice(1).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 bg-white min-w-[140px]">
              <option value="all">{isZh ? '全部类型' : 'All Types'}</option>
              {types.slice(1).map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 bg-white min-w-[130px]">
              <option value="all">{isZh ? '全部等级' : 'All Levels'}</option>
              <option value="high">{isZh ? '高风险' : 'High Risk'}</option>
              <option value="medium">{isZh ? '中风险' : 'Medium Risk'}</option>
              <option value="low">{isZh ? '低风险' : 'Low Risk'}</option>
            </select>
          </div>
        )}

        {/* Policies Grid */}
        {activeTab === 'policies' && (
          <>
            {filteredPolicies.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p>{isZh ? '未找到匹配的政策' : 'No matching policies found'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredPolicies.map((policy) => {
                  const rc = riskColors[policy.riskLevel]
                  const sc = statusColors[policy.status]
                  return (
                    <div key={policy.id} className="bg-white rounded-2xl border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all overflow-hidden">
                      <div className="p-5">
                        {/* Header */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap gap-2 mb-2">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc.bg} ${sc.text}`}>
                                {statusLabel[policy.status]}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${rc.bg} ${rc.text} ${rc.border}`}>
                                {riskLabel[policy.riskLevel]}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                {isZh ? policy.country : policy.countryEn}
                              </span>
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm leading-snug">
                              {isZh ? policy.title : policy.titleEn}
                            </h3>
                          </div>
                        </div>

                        <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
                          {isZh ? policy.summary : policy.summaryEn}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                          <span>{isZh ? '生效：' : 'Effective: '}{policy.effectiveDate}</span>
                          <span className="text-gray-300">|</span>
                          <span>{isZh ? policy.type : policy.typeEn}</span>
                        </div>

                        {/* Key Point Preview */}
                        <div className="bg-gray-50 rounded-xl p-3 mb-4">
                          <p className="text-xs font-medium text-gray-500 mb-1.5">{isZh ? '核心合规要点' : 'Key Compliance Point'}</p>
                          <p className="text-xs text-gray-700 leading-relaxed">
                            {isZh ? policy.keyPoints[0] : policy.keyPointsEn[0]}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/${locale}/policy-db/${policy.id}`}
                            className="flex-1 text-center text-sm text-blue-600 font-medium border border-blue-200 rounded-lg py-2 hover:bg-blue-50 transition-colors"
                          >
                            {isZh ? '查看详情' : 'View Details'}
                          </Link>
                          <button className="px-3 py-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {/* ESG Standards */}
        {activeTab === 'esg' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredEsg.map((std) => (
              <div key={std.id} className="bg-white rounded-2xl border border-gray-200 hover:shadow-md hover:border-green-200 transition-all p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-0.5">
                      {isZh ? std.name : std.nameEn}
                    </h3>
                    <p className="text-xs text-gray-400">{isZh ? std.org : std.orgEn} · {std.version}</p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-3">
                  {isZh ? std.summary : std.summaryEn}
                </p>

                <div className="bg-green-50 rounded-xl p-3 mb-3">
                  <p className="text-xs font-medium text-green-700 mb-1">{isZh ? '适用场景' : 'Applicability'}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {isZh ? std.applicability : std.applicabilityEn}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {std.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
