'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { casesData, type CaseItem } from '@/lib/cases-data'

interface Props {
  locale: string
}

export default function CaseLibrary({ locale }: Props) {
  const t = useTranslations('cases')
  const isZh = locale === 'zh'

  const [search, setSearch] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [selectedIndustry, setSelectedIndustry] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const regions = ['all', ...Array.from(new Set(casesData.map((c) => (isZh ? c.region : c.regionEn))))]
  const industries = ['all', ...Array.from(new Set(casesData.map((c) => (isZh ? c.industry : c.industryEn))))]

  const filtered = casesData.filter((c) => {
    const name = isZh ? c.company : c.companyEn
    const region = isZh ? c.region : c.regionEn
    const industry = isZh ? c.industry : c.industryEn
    const tags = isZh ? c.tags : c.tagsEn

    const matchSearch =
      !search ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))

    const matchRegion = selectedRegion === 'all' || region === selectedRegion
    const matchIndustry = selectedIndustry === 'all' || industry === selectedIndustry

    return matchSearch && matchRegion && matchIndustry
  })

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('search')}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
        </div>

        {/* Region filter */}
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 min-w-[140px]"
        >
          {regions.map((r) => (
            <option key={r} value={r}>
              {r === 'all' ? (isZh ? '全部地区' : 'All Regions') : r}
            </option>
          ))}
        </select>

        {/* Industry filter */}
        <select
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 min-w-[160px]"
        >
          {industries.map((ind) => (
            <option key={ind} value={ind}>
              {ind === 'all' ? (isZh ? '全部行业' : 'All Industries') : ind}
            </option>
          ))}
        </select>
      </div>

      {/* Result count */}
      <div className="text-sm text-gray-400 mb-5">
        {isZh ? `共 ${filtered.length} 个案例` : `${filtered.length} case${filtered.length !== 1 ? 's' : ''} found`}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t('noResults')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((c) => (
            <CaseCard
              key={c.id}
              item={c}
              isZh={isZh}
              t={t}
              expanded={expanded === c.id}
              onToggle={() => setExpanded(expanded === c.id ? null : c.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CaseCard({
  item,
  isZh,
  t,
  expanded,
  onToggle,
}: {
  item: CaseItem
  isZh: boolean
  t: ReturnType<typeof useTranslations>
  expanded: boolean
  onToggle: () => void
}) {
  const company = isZh ? item.company : item.companyEn
  const industry = isZh ? item.industry : item.industryEn
  const region = isZh ? item.region : item.regionEn
  const challenge = isZh ? item.challenge : item.challengeEn
  const solution = isZh ? item.solution : item.solutionEn
  const esgImpact = isZh ? item.esgImpact : item.esgImpactEn
  const tags = isZh ? item.tags : item.tagsEn

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-all">
      {/* Card header */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ backgroundColor: item.color }}
            >
              {item.abbr}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-base">{company}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs text-gray-400">{industry}</span>
                <span className="text-gray-300">·</span>
                <span className="text-xs text-gray-400">{region}</span>
                <span className="text-gray-300">·</span>
                <span className="text-xs text-gray-400">{item.year}</span>
              </div>
            </div>
          </div>
          <span className="bg-green-50 text-green-700 border border-green-200 text-xs px-2 py-0.5 rounded-full font-medium shrink-0">
            ESG {item.esgCategory}
          </span>
        </div>

        {/* Challenge */}
        <div className="mb-3">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{t('challenge')}</div>
          <p className="text-sm text-gray-600 leading-relaxed">{challenge}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="bg-gray-100 text-gray-500 text-xs px-2.5 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Expand section */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-50 pt-4 space-y-4">
          <div>
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{t('solution')}</div>
            <p className="text-sm text-gray-600 leading-relaxed">{solution}</p>
          </div>
          <div>
            <div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">{t('esgImpact')}</div>
            <p className="text-sm text-gray-600 leading-relaxed">{esgImpact}</p>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="w-full border-t border-gray-100 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-1 font-medium"
      >
        {expanded ? (
          <>
            {isZh ? '收起' : 'Collapse'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </>
        ) : (
          <>
            {t('viewDetail')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>
    </div>
  )
}
