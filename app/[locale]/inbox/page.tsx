'use client'

import { useEffect, useState, useCallback, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { generateSyncCode, normalizeSyncCode } from '@/lib/sync-code'

interface SavedItem {
  id: string
  title: string
  summary: string | null
  source_url: string | null
  tag: string | null
  region: string | null
  source_type: 'push' | 'manual' | 'mock'
  saved_at: string
  opened_at: string | null
  metadata: Record<string, unknown>
}

function InboxPageInner({ locale }: { locale: string }) {
  const isZh = locale === 'zh'
  const searchParams = useSearchParams()
  const router = useRouter()
  const codeFromQuery = searchParams.get('code')

  const [syncCode, setSyncCode] = useState<string | null>(null)
  const [items, setItems] = useState<SavedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  // 初始化同步码：URL > localStorage > 新生成
  useEffect(() => {
    let code = normalizeSyncCode(codeFromQuery)
    if (!code) {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('hq_sync_code') : null
      code = normalizeSyncCode(stored)
    }
    if (!code) {
      code = generateSyncCode()
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('hq_sync_code', code)
    }
    setSyncCode(code)
  }, [codeFromQuery])

  const refresh = useCallback(async () => {
    if (!syncCode) return
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.set('code', syncCode)
      if (filter === 'unread') params.set('unread', '1')
      const res = await fetch(`/api/inbox?${params.toString()}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to load')
      setItems(json.items || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [syncCode, filter])

  useEffect(() => {
    refresh()
  }, [refresh])

  const handleMarkRead = async (id: string, opened: boolean) => {
    if (!syncCode) return
    await fetch('/api/inbox', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, sync_code: syncCode, opened }),
    })
    refresh()
  }

  const handleDelete = async (id: string) => {
    if (!syncCode) return
    await fetch(`/api/inbox?id=${id}&code=${syncCode}`, { method: 'DELETE' })
    refresh()
  }

  const handleAskAi = (item: SavedItem) => {
    const q = `请基于这条最新动态给我专业解读：「${item.title}」${item.summary ? `\n要点：${item.summary}` : ''}`
    router.push(`/${locale}/chat?q=${encodeURIComponent(q)}`)
  }

  const handleNewCode = () => {
    const fresh = generateSyncCode()
    if (typeof window !== 'undefined') localStorage.setItem('hq_sync_code', fresh)
    setSyncCode(fresh)
    router.replace(`/${locale}/inbox?code=${fresh}`)
  }

  const tags = useMemo(() => {
    const set = new Set<string>()
    items.forEach((i) => i.tag && set.add(i.tag))
    return Array.from(set)
  }, [items])

  const filtered = useMemo(() => {
    if (!activeTag) return items
    return items.filter((i) => i.tag === activeTag)
  }, [items, activeTag])

  const unreadCount = items.filter((i) => !i.opened_at).length

  const phoneUrl = typeof window !== 'undefined' && syncCode
    ? `${window.location.origin}/${locale}/inbox/demo-phone?code=${syncCode}`
    : ''

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs uppercase tracking-wider bg-white/15 px-2 py-1 rounded">
              {isZh ? 'APP ↔ 网页 同步' : 'APP ↔ Web Sync'}
            </span>
            <span className="text-xs bg-emerald-500/90 px-2 py-1 rounded">NEW</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            {isZh ? '我的收件箱' : 'My Inbox'}
          </h1>
          <p className="text-white/85 max-w-2xl leading-relaxed">
            {isZh
              ? '在手机 APP 上一键保存的政策推送、案例和资讯，会通过同步码自动出现在这里。点击任何一条都能直接转入 AI 问答深入追问。'
              : 'Items you save on the mobile APP appear here via sync code. Tap any entry to ask follow-up questions in AI Chat instantly.'}
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-8">
        {/* Sync code panel */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-8 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-1">
              {isZh ? '当前同步码' : 'Current sync code'}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <code className="text-2xl font-bold tracking-[0.3em] text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">
                {syncCode || '------'}
              </code>
              <button
                onClick={handleNewCode}
                className="text-xs text-gray-500 hover:text-gray-800 underline"
              >
                {isZh ? '生成新码' : 'New code'}
              </button>
              <button
                onClick={() => {
                  if (syncCode) navigator.clipboard?.writeText(syncCode)
                }}
                className="text-xs text-gray-500 hover:text-gray-800 underline"
              >
                {isZh ? '复制' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              {isZh
                ? '把这串 6 位码输入到手机 APP「设置 → 同步到网页」，APP 收藏过的内容会立即同步到这里。无需注册账号。'
                : "Enter this 6-character code in the APP's 'Settings → Sync to Web', and saved items will appear here. No registration needed."}
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href={`/${locale}/inbox/demo-phone?code=${syncCode || ''}`}
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-black"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <rect x="6" y="3" width="12" height="18" rx="2" />
                <path d="M11 18h2" strokeLinecap="round" />
              </svg>
              {isZh ? '打开模拟手机端 →' : 'Open Demo Phone →'}
            </Link>
            {phoneUrl && (
              <p className="text-[10px] text-gray-400 mt-2 max-w-[180px] break-all text-center">
                {phoneUrl}
              </p>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap mb-5">
          <button
            onClick={() => setFilter('all')}
            className={`text-sm px-3 py-1.5 rounded-full border ${
              filter === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {isZh ? `全部 · ${items.length}` : `All · ${items.length}`}
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`text-sm px-3 py-1.5 rounded-full border ${
              filter === 'unread' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {isZh ? `未读 · ${unreadCount}` : `Unread · ${unreadCount}`}
          </button>
          <span className="text-gray-300 mx-1">|</span>
          {tags.length === 0 ? (
            <span className="text-xs text-gray-400">
              {isZh ? '没有标签' : 'No tags yet'}
            </span>
          ) : (
            <>
              <button
                onClick={() => setActiveTag(null)}
                className={`text-xs px-2.5 py-1 rounded-full ${
                  !activeTag ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isZh ? '全部标签' : 'All tags'}
              </button>
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTag(t)}
                  className={`text-xs px-2.5 py-1 rounded-full ${
                    activeTag === t ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </>
          )}
          <button
            onClick={refresh}
            className="ml-auto text-xs text-blue-600 hover:underline"
          >
            {isZh ? '刷新 ↻' : 'Refresh ↻'}
          </button>
        </div>

        {/* List */}
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-400 text-sm">
            {isZh ? '加载中…' : 'Loading…'}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-700">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-12 text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm mb-2">
              {isZh ? '收件箱还是空的' : 'Your inbox is empty'}
            </p>
            <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
              {isZh
                ? '在手机 APP 中保存任何政策推送或案例，几秒钟后就会出现在这里。或者点击右上角「打开模拟手机端」立即体验。'
                : 'Save any policy push or case in the mobile APP and it will appear here in seconds. Or click "Open Demo Phone" above to try right now.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((it) => {
              const opened = !!it.opened_at
              return (
                <div
                  key={it.id}
                  className={`bg-white border rounded-2xl p-5 transition-all ${
                    opened ? 'border-gray-200 opacity-80' : 'border-blue-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {!opened && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-2" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        {it.tag && (
                          <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                            {it.tag}
                          </span>
                        )}
                        {it.region && (
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {it.region}
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400">
                          {it.source_type === 'push'
                            ? (isZh ? '📲 APP 推送' : '📲 APP push')
                            : it.source_type === 'manual'
                            ? (isZh ? '✋ 手动收藏' : '✋ Saved manually')
                            : (isZh ? '🧪 演示数据' : '🧪 Mock')}
                        </span>
                        <span className="text-[10px] text-gray-300">·</span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(it.saved_at).toLocaleString(isZh ? 'zh-CN' : 'en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1.5 leading-snug">
                        {it.title}
                      </h3>
                      {it.summary && (
                        <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-3">
                          {it.summary}
                        </p>
                      )}
                      <div className="flex items-center gap-3 flex-wrap">
                        <button
                          onClick={() => handleAskAi(it)}
                          className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 inline-flex items-center gap-1.5"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          {isZh ? '转入 AI 问答' : 'Ask AI'}
                        </button>
                        {it.source_url && (
                          <a
                            href={it.source_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            {isZh ? '查看原文 ↗' : 'Source ↗'}
                          </a>
                        )}
                        <button
                          onClick={() => handleMarkRead(it.id, !opened)}
                          className="text-xs text-gray-500 hover:text-gray-800"
                        >
                          {opened ? (isZh ? '标为未读' : 'Mark unread') : (isZh ? '标为已读' : 'Mark read')}
                        </button>
                        <button
                          onClick={() => handleDelete(it.id)}
                          className="text-xs text-gray-400 hover:text-red-600 ml-auto"
                        >
                          {isZh ? '删除' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Hint footer */}
        <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            {isZh ? '🔌 给开发者：APP 端如何写入' : '🔌 Developer note: how the APP writes here'}
          </p>
          <pre className="text-[11px] bg-white border border-blue-100 rounded-lg p-3 overflow-x-auto leading-relaxed">
{`POST /api/inbox/save
Content-Type: application/json

{
  "sync_code": "${syncCode || 'XXXXXX'}",
  "title": "EU AI Act 第 6 条修订生效",
  "summary": "高风险 AI 系统须在 6 个月内完成符合性评估…",
  "tag": "EU AI Act",
  "region": "EU",
  "source_url": "https://...",
  "source_type": "push"
}`}
          </pre>
        </div>
      </section>
    </div>
  )
}

export default function InboxPage({ params }: { params: Promise<{ locale: string }> }) {
  // unwrap params for client component
  const [locale, setLocale] = useState('zh')
  useEffect(() => {
    params.then((p) => setLocale(p.locale))
  }, [params])
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-400 text-sm">Loading…</div>}>
      <InboxPageInner locale={locale} />
    </Suspense>
  )
}
