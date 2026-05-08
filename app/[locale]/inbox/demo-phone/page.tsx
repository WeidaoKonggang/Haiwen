'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { generateSyncCode, normalizeSyncCode } from '@/lib/sync-code'

interface Push {
  title: string
  summary: string
  tag: string
  region: string
  source_url: string
}

const DEMO_PUSHES: Push[] = [
  {
    title: 'EU AI Act 第 6 条修订生效',
    summary:
      '欧盟修订 AI Act 高风险分类，自 2026 年 6 月起，所有部署在欧盟的高风险 AI 系统须在 6 个月内完成符合性评估，并在 EU 数据库登记。',
    tag: 'EU AI Act',
    region: 'EU',
    source_url: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai',
  },
  {
    title: '新加坡 PDPA 出台 AI 治理实操指南',
    summary:
      'IMDA 与 PDPC 联合发布《Model AI Governance Framework》v2，新增针对生成式 AI 的安全测评与披露要求，建议中国 AI 企业本月内对照自查。',
    tag: 'PDPA',
    region: 'SG',
    source_url: 'https://www.pdpc.gov.sg/',
  },
  {
    title: 'CSRD 强制披露：第二批进入范围',
    summary:
      '欧盟 CSRD 第二批生效，年营业额 4000 万欧元以上的中国 AI 出海企业（含 EU 子公司）须于 2027 年起披露 ESRS 全套指标。',
    tag: 'CSRD',
    region: 'EU',
    source_url: 'https://finance.ec.europa.eu/capital-markets-union-and-financial-markets/company-reporting-and-auditing/company-reporting/corporate-sustainability-reporting_en',
  },
  {
    title: '美国 BIS 更新 AI 芯片出口管制',
    summary:
      '美国商务部工业与安全局更新出口管制条例：新增 H100/H200 等型号至 Entity List 控制范围，影响中国 AI 训练任务的算力供给。',
    tag: 'US Export Control',
    region: 'US',
    source_url: 'https://www.bis.doc.gov/',
  },
  {
    title: 'ISSB S1/S2 在亚太市场加速落地',
    summary:
      '香港、新加坡、日本、马来西亚相继宣布将 ISSB S1/S2 纳入本地强制披露要求；A 股上市公司 ESG 报告也将逐步对标 ISSB。',
    tag: 'ISSB',
    region: 'APAC',
    source_url: 'https://www.ifrs.org/issued-standards/ifrs-sustainability-standards/',
  },
]

function DemoPhoneInner({ locale }: { locale: string }) {
  const isZh = locale === 'zh'
  const searchParams = useSearchParams()
  const [syncCode, setSyncCode] = useState<string | null>(null)
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set())
  const [savingIdx, setSavingIdx] = useState<number | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    let code = normalizeSyncCode(searchParams.get('code'))
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
  }, [searchParams])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  const handleSave = useCallback(
    async (idx: number) => {
      if (!syncCode || savedIds.has(idx)) return
      const push = DEMO_PUSHES[idx]
      setSavingIdx(idx)
      try {
        const res = await fetch('/api/inbox/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sync_code: syncCode,
            title: push.title,
            summary: push.summary,
            tag: push.tag,
            region: push.region,
            source_url: push.source_url,
            source_type: 'push',
          }),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'failed')
        setSavedIds((s) => new Set(s).add(idx))
        showToast(isZh ? '✓ 已同步到电脑端' : '✓ Synced to web')
      } catch (e) {
        showToast(isZh ? '保存失败：' + (e as Error).message : 'Failed: ' + (e as Error).message)
      } finally {
        setSavingIdx(null)
      }
    },
    [syncCode, savedIds, isZh]
  )

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-md mx-auto">
        {/* breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
          <Link href={`/${locale}/inbox`} className="hover:text-gray-800">
            ← {isZh ? '返回收件箱' : 'Back to Inbox'}
          </Link>
          <span>·</span>
          <span className="text-gray-400">
            {isZh ? '模拟手机端（演示用）' : 'Mock phone (demo)'}
          </span>
        </div>

        {/* phone frame */}
        <div className="bg-gray-900 rounded-[2.5rem] p-2.5 shadow-2xl">
          <div className="bg-white rounded-[2rem] overflow-hidden">
            {/* Status bar */}
            <div className="bg-gray-50 px-6 py-2 flex items-center justify-between text-[11px] text-gray-500 border-b border-gray-100">
              <span className="font-semibold">9:41</span>
              <div className="flex items-center gap-1">
                <span>●●●</span>
                <span>HQ</span>
                <span>🔋</span>
              </div>
            </div>

            {/* App header */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-5 py-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold">HQ</span>
                  </div>
                  <span className="font-semibold text-sm">{isZh ? '海问 APP' : 'HaiWen APP'}</span>
                </div>
                <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded-full">v1.0</span>
              </div>
              <p className="text-xs text-white/80">
                {isZh ? '今日 5 条全球 AI 监管推送' : '5 global AI-reg pushes today'}
              </p>

              {/* Sync code */}
              <div className="mt-3 bg-white/10 rounded-lg px-3 py-2 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-white/70 mb-0.5">
                    {isZh ? '同步到网页' : 'Sync to Web'}
                  </p>
                  <code className="text-sm font-bold tracking-widest">{syncCode || '------'}</code>
                </div>
                <Link
                  href={`/${locale}/inbox?code=${syncCode || ''}`}
                  className="text-[10px] bg-white text-blue-700 px-2.5 py-1 rounded-md font-semibold"
                >
                  {isZh ? '打开网页 →' : 'Open Web →'}
                </Link>
              </div>
            </div>

            {/* Push list */}
            <div className="p-3 space-y-2.5 bg-gray-50 max-h-[60vh] overflow-y-auto">
              {DEMO_PUSHES.map((p, idx) => {
                const saved = savedIds.has(idx)
                const saving = savingIdx === idx
                return (
                  <div key={idx} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                      <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-semibold">
                        {p.tag}
                      </span>
                      <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                        {p.region}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 leading-snug mb-1">
                      {p.title}
                    </p>
                    <p className="text-[11px] text-gray-500 leading-relaxed mb-2.5 line-clamp-3">
                      {p.summary}
                    </p>
                    <button
                      onClick={() => handleSave(idx)}
                      disabled={saved || saving || !syncCode}
                      className={`w-full text-[11px] font-semibold py-2 rounded-lg transition-all ${
                        saved
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : saving
                          ? 'bg-gray-100 text-gray-400'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {saved
                        ? (isZh ? '✓ 已保存到收件箱' : '✓ Saved to inbox')
                        : saving
                        ? (isZh ? '同步中…' : 'Syncing…')
                        : (isZh ? '⭐ 保存到电脑端' : '⭐ Save to Web')}
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Bottom nav */}
            <div className="flex items-center justify-around bg-white border-t border-gray-100 py-2.5">
              {[
                { l: isZh ? '推送' : 'Push', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
                { l: isZh ? '收藏' : 'Saved', icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z' },
                { l: isZh ? '问答' : 'Chat', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
                { l: isZh ? '我的' : 'Me', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
              ].map((tab, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <svg className={`w-4 h-4 ${i === 0 ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                  </svg>
                  <span className={`text-[9px] ${i === 0 ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                    {tab.l}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* hint */}
        <p className="mt-6 text-center text-xs text-gray-500 leading-relaxed">
          {isZh ? (
            <>
              这是一个完全互动的演示。点击任何 ⭐ 按钮，再回到 <Link href={`/${locale}/inbox?code=${syncCode || ''}`} className="text-blue-600 underline">/inbox</Link> 页面就能看到刚保存的内容。
              <br />
              真实手机 APP 通过同样的 <code className="text-[10px] bg-gray-100 px-1 py-0.5 rounded">POST /api/inbox/save</code> 接口写入。
            </>
          ) : (
            <>
              This is a fully interactive demo. Tap any ⭐ button, then return to <Link href={`/${locale}/inbox?code=${syncCode || ''}`} className="text-blue-600 underline">/inbox</Link> to see what you just saved.
              <br />
              The real mobile APP writes via the same <code className="text-[10px] bg-gray-100 px-1 py-0.5 rounded">POST /api/inbox/save</code> endpoint.
            </>
          )}
        </p>

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-5 py-3 rounded-full shadow-lg">
            {toast}
          </div>
        )}
      </div>
    </div>
  )
}

export default function DemoPhonePage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState('zh')
  useEffect(() => {
    params.then((p) => setLocale(p.locale))
  }, [params])
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-400 text-sm">Loading…</div>}>
      <DemoPhoneInner locale={locale} />
    </Suspense>
  )
}
