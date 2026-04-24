'use client'

import { useEffect, useState, use } from 'react'

interface NewsItem {
  id: string
  content: string
  tag: string
  region: string
  date: string
  createdAt: string
}

interface Facets {
  tags: string[]
  regions: string[]
}

// Parse Agent-written content into { summary, sources }
function parseNewsContent(content: string): { summary: string; sources: string[] } {
  const lines = content.split('\n')
  const summaryLines: string[] = []
  let sources: string[] = []
  let mode: 'summary' | 'sources' | 'skip' = 'skip'

  for (const line of lines) {
    if (line.startsWith('内容摘要') || line.toLowerCase().startsWith('summary')) {
      mode = 'summary'
      const after = line.split('：')[1] ?? line.split(':')[1]
      if (after) summaryLines.push(after.trim())
      continue
    }
    if (line.startsWith('参考来源') || line.toLowerCase().startsWith('sources')) {
      const after = line.split('：')[1] ?? line.split(':')[1]
      if (after) sources = after.split(/[、,]/).map((s) => s.trim()).filter(Boolean)
      mode = 'sources'
      continue
    }
    if (mode === 'summary' && line.trim()) summaryLines.push(line.trim())
  }

  return {
    summary: summaryLines.join('\n').trim() || content,
    sources,
  }
}

function regionColor(region: string): string {
  const map: Record<string, string> = {
    欧盟: 'bg-blue-50 text-blue-700 border-blue-200',
    中国: 'bg-red-50 text-red-700 border-red-200',
    美国: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    新加坡: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    印度: 'bg-amber-50 text-amber-700 border-amber-200',
    全球: 'bg-purple-50 text-purple-700 border-purple-200',
  }
  return map[region] ?? 'bg-gray-50 text-gray-600 border-gray-200'
}

function formatDate(iso: string, isZh: boolean): string {
  try {
    const d = new Date(iso)
    if (isZh) {
      return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
    }
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return iso
  }
}

export default function TrendsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const isZh = locale === 'zh'

  const [items, setItems] = useState<NewsItem[]>([])
  const [facets, setFacets] = useState<Facets>({ tags: [], regions: [] })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filterTag, setFilterTag] = useState<string>('all')
  const [filterRegion, setFilterRegion] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchNews = async () => {
    setLoading(true)
    setError(null)
    try {
      const qs = new URLSearchParams()
      if (filterTag !== 'all') qs.set('tag', filterTag)
      if (filterRegion !== 'all') qs.set('region', filterRegion)

      const res = await fetch(`/api/news${qs.toString() ? `?${qs}` : ''}`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.message ?? 'Failed')
      setItems(data.items ?? [])
      setFacets(data.facets ?? { tags: [], regions: [] })
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  const triggerRefresh = async () => {
    if (refreshing) return
    if (!confirm(isZh
      ? '手动触发周更 Agent 大约需要 2-3 分钟，确定继续？'
      : 'Trigger weekly-update agent manually? This may take 2-3 minutes.')) return

    setRefreshing(true)
    try {
      const res = await fetch('/api/agent/weekly-update', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      alert(
        isZh
          ? `更新完成！成功 ${data.success} 条，失败 ${data.failed} 条`
          : `Done! ${data.success} succeeded, ${data.failed} failed`
      )
      await fetchNews()
    } catch (err) {
      alert(
        isZh
          ? `触发失败：${err instanceof Error ? err.message : err}`
          : `Failed: ${err instanceof Error ? err.message : err}`
      )
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [filterTag, filterRegion]) // eslint-disable-line react-hooks/exhaustive-deps

  const latestDate = items[0]?.createdAt

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-full px-3 py-1 mb-3">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                {isZh ? 'AI Agent 每周自动更新' : 'Weekly AI Agent Updates'}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isZh ? '最新动态' : 'Latest Trends'}
              </h1>
              <p className="text-gray-500 text-sm max-w-2xl">
                {isZh
                  ? '每周一自动搜索全球 AI 监管、数据合规、ESG 等十大主题的最新资讯，由 AI 总结提炼，并自动接入智能问答知识库。'
                  : 'Every Monday our agent searches 10 key topics on AI regulation, data compliance, and ESG worldwide. Summaries are indexed into the Q&A knowledge base.'}
              </p>
              {latestDate && (
                <p className="text-xs text-gray-400 mt-3">
                  {isZh ? '最近更新：' : 'Last updated: '}
                  {formatDate(latestDate, isZh)}
                </p>
              )}
            </div>
            <button
              onClick={triggerRefresh}
              disabled={refreshing}
              className="shrink-0 inline-flex items-center gap-2 text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {refreshing ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {isZh ? '更新中...' : 'Refreshing...'}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {isZh ? '立即刷新' : 'Refresh Now'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Filters */}
        {(facets.tags.length > 0 || facets.regions.length > 0) && (
          <div className="flex flex-wrap gap-3 mb-6">
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 bg-white min-w-[140px]"
            >
              <option value="all">{isZh ? '全部地区' : 'All regions'}</option>
              {facets.regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 bg-white min-w-[180px]"
            >
              <option value="all">{isZh ? '全部主题' : 'All topics'}</option>
              {facets.tags.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {(filterTag !== 'all' || filterRegion !== 'all') && (
              <button
                onClick={() => {
                  setFilterTag('all')
                  setFilterRegion('all')
                }}
                className="text-sm text-gray-500 hover:text-gray-800 px-3 py-2"
              >
                {isZh ? '清除筛选' : 'Clear'}
              </button>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-16 text-gray-400 text-sm">
            {isZh ? '加载中...' : 'Loading...'}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="border border-red-200 bg-red-50 rounded-xl p-4 text-sm text-red-700">
            {isZh ? '加载失败：' : 'Load failed: '}{error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && items.length === 0 && (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm mb-2">
              {isZh ? '暂无最新动态' : 'No trends yet'}
            </p>
            <p className="text-gray-400 text-xs">
              {isZh
                ? '点击右上角「立即刷新」手动触发周更 Agent'
                : 'Click "Refresh Now" in the top-right to trigger the weekly agent'}
            </p>
          </div>
        )}

        {/* List */}
        {!loading && !error && items.length > 0 && (
          <div className="space-y-4">
            {items.map((item) => {
              const { summary, sources } = parseNewsContent(item.content)
              const isExpanded = expandedId === item.id
              const preview = summary.length > 260 ? summary.slice(0, 260) + '…' : summary

              return (
                <article
                  key={item.id}
                  className="border border-gray-200 rounded-2xl p-5 hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${regionColor(
                          item.region
                        )}`}
                      >
                        {item.region}
                      </span>
                      <span className="inline-flex items-center text-xs font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full">
                        {item.tag}
                      </span>
                    </div>
                    <time className="text-xs text-gray-400 shrink-0">
                      {formatDate(item.createdAt, isZh)}
                    </time>
                  </div>

                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {isExpanded ? summary : preview}
                  </div>

                  {summary.length > 260 && (
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 mt-3"
                    >
                      {isExpanded
                        ? isZh ? '收起' : 'Collapse'
                        : isZh ? '展开全文' : 'Read more'}
                    </button>
                  )}

                  {sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="text-xs text-gray-400 mb-2">
                        {isZh ? '参考来源' : 'Sources'}
                      </div>
                      <div className="flex flex-col gap-1">
                        {sources.map((src, idx) => (
                          <a
                            key={idx}
                            href={src}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-700 hover:underline truncate"
                          >
                            {src}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
