import Link from 'next/link'
import {
  surveyStats,
  roleDistribution,
  painPoints,
  quotes,
  iterations,
  honestLimitations,
  nextSteps,
  currentSolutions,
  solutionValidation,
  usabilityFactors,
  academicInsights,
  requiredCoverage,
} from '@/lib/validation-data'

export default async function ValidationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isZh = locale === 'zh'

  const completionPct = Math.min(
    100,
    Math.round((surveyStats.collected / surveyStats.targetSampleSize) * 100)
  )

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white px-6 py-16">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 25% 30%, white 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div className="relative max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-xs px-3 py-1 rounded-full border border-white/20 mb-5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            {isZh ? '透明 · 真实 · Demo Day 专用页' : 'Transparent · Honest · Built for Demo Day'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
            {isZh ? '用户验证证据' : 'User Validation Evidence'}
          </h1>
          <p className="text-white/80 text-base leading-relaxed max-w-3xl">
            {isZh ? (
              <>
                评委最关心的问题是：<em className="text-white not-italic font-semibold">"你们怎么知道这东西有用？你们改过什么？"</em>
                <br />
                这一页就是答案 —— 我们问了谁，他们告诉了我们什么，以及我们据此改了网站的哪里。
              </>
            ) : (
              <>
                The question reviewers care about most: <em className="text-white not-italic font-semibold">"How do you know this is useful? What did you actually change?"</em>
                <br />
                This page is the answer — who we asked, what they told us, and exactly what we changed as a result.
              </>
            )}
          </p>
        </div>
      </section>

      {/* ── 1. Who we asked ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
            01
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{isZh ? '我们问了谁' : 'Who we asked'}</h2>
        </div>
        <p className="text-gray-500 text-sm mb-8 ml-11">
          {isZh
            ? '问卷参考 ENT208TC Validation Report 规范，分 A–G 七个部分，覆盖人口统计、痛点识别、现有方案评价、方案验证、可用性、学术视角与开放反馈。'
            : 'Our survey follows the ENT208TC Validation Report specification, with seven sections A–G covering demographics, pain identification, current solution evaluation, concept validation, usability, academic perspectives and open-ended feedback.'}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Progress card */}
          <div className="lg:col-span-1 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold text-gray-900">{isZh ? '调研进度' : 'Collection Progress'}</h3>
              {surveyStats.status === 'in_progress' && (
                <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">
                  {isZh ? '进行中' : 'In progress'}
                </span>
              )}
              {surveyStats.status === 'complete' && (
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-medium">
                  {isZh ? '已完成' : 'Complete'}
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold text-blue-700">{surveyStats.collected}</span>
              <span className="text-gray-400 text-sm">
                / {surveyStats.targetSampleSize} {isZh ? '份' : 'responses'}
              </span>
            </div>
            <div className="w-full bg-white/70 rounded-full h-2 mb-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <p className="text-xs text-gray-600">
              {isZh ? '开始：' : 'From: '}
              {surveyStats.surveyStartDate}
              {surveyStats.surveyEndDate && (
                <>
                  {isZh ? ' · 截止：' : ' · To: '}
                  {surveyStats.surveyEndDate}
                </>
              )}
            </p>
          </div>

          {/* Methods */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">{isZh ? '三种调研方法并行' : 'Three research methods in parallel'}</h3>
            <div className="space-y-3">
              {surveyStats.methods.map((m, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed">{isZh ? m.zh : m.en}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Role distribution */}
        <div className="mt-8">
          <h3 className="font-semibold text-gray-900 mb-4">{isZh ? '受访者角色分布' : 'Respondent role distribution'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {roleDistribution.map((r) => (
              <div key={r.en} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">{isZh ? r.zh : r.en}</span>
                    <span className="text-xs font-semibold text-gray-800">{r.pct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${r.pct}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {surveyStats.status === 'in_progress' && (
            <p className="mt-5 text-xs text-gray-400 italic">
              {isZh
                ? '* 数据为截至本页发布时的阶段性统计；最终 Demo Day 版本会以回收截止日为准刷新。'
                : '* Figures are interim as of page publication; the final Demo Day version will refresh with the full sample.'}
            </p>
          )}
        </div>
      </section>

      {/* ── 2. What they told us ── */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
              02
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{isZh ? '他们告诉了我们什么' : 'What they told us'}</h2>
          </div>
          <p className="text-gray-500 text-sm mb-8 ml-11">
            {isZh
              ? '来自问卷 Section B（痛点识别）与 Section G（开放反馈）的真实数据，已匿名化处理。'
              : 'Real data from Survey Section B (pain identification) and Section G (open-ended feedback), anonymised.'}
          </p>

          {/* Pain ratings */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-1">
              {isZh ? '排名 TOP-6 的用户痛点' : 'Top-6 user pain points'}
            </h3>
            <p className="text-xs text-gray-400 mb-5">
              {isZh ? '评分：1 = 完全不显著，5 = 极为显著' : 'Scale: 1 = not at all significant, 5 = extremely significant'}
            </p>
            <div className="space-y-4">
              {painPoints
                .slice()
                .sort((a, b) => b.rating - a.rating)
                .map((p) => (
                  <div key={p.en}>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm text-gray-700 flex-1 pr-4">{isZh ? p.zh : p.en}</p>
                      <span className="text-sm font-bold text-blue-700 shrink-0">{p.rating.toFixed(1)}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          p.rating >= 4.5
                            ? 'bg-red-500'
                            : p.rating >= 4.0
                              ? 'bg-orange-500'
                              : 'bg-blue-500'
                        }`}
                        style={{ width: `${(p.rating / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
            <div className="mt-5 pt-5 border-t border-gray-100 flex items-start gap-2 text-xs text-gray-500 leading-relaxed">
              <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                {isZh ? (
                  <>
                    <strong>关键发现</strong>：价格可承受的专业咨询（4.7/5）和及时准确的法规指导（4.6/5）得分最高 —— 这直接验证了 Project Brief Section 1 中「3–6 个月、¥100K+」的问题陈述。
                  </>
                ) : (
                  <>
                    <strong>Key finding:</strong> "Affordable professional consulting" (4.7/5) and "Timely regulatory guidance" (4.6/5) scored highest — directly validating the "3–6 months, ¥100K+" problem statement from our Project Brief Section 1.
                  </>
                )}
              </span>
            </div>
          </div>

          {/* User quotes */}
          <div className="space-y-5">
            {quotes.map((q, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-3 left-4 text-[72px] leading-none text-gray-100 font-serif select-none">"</div>
                <div className="relative pl-10">
                  <p className="text-gray-700 leading-relaxed text-[15px] mb-4">
                    {isZh ? q.quote.zh : q.quote.en}
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="text-xs text-gray-500">
                      — {isZh ? q.role.zh : q.role.en}
                    </p>
                    {q.responseApplied && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        {isZh ? '我们已根据此反馈迭代' : 'We iterated on this feedback'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2.5. Section C — Current solutions comparison ── */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
            C
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isZh ? '为什么不是麦肯锡 / ChatGPT / 内部团队？' : 'Why not McKinsey / ChatGPT / in-house teams?'}
          </h2>
        </div>
        <p className="text-gray-500 text-sm mb-8 ml-11">
          {isZh
            ? '问卷 Section C：受访者使用现有方案的占比与满意度（5 分制），以及他们点出的限制。'
            : 'Survey Section C: usage % and satisfaction (5-point scale) of existing solutions, plus limitations users called out.'}
        </p>
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-700">{isZh ? '方案' : 'Solution'}</th>
                <th className="text-center px-3 py-3 font-semibold text-gray-700">{isZh ? '使用率' : 'Usage'}</th>
                <th className="text-center px-3 py-3 font-semibold text-gray-700">{isZh ? '满意度' : 'Satisfaction'}</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-700">{isZh ? '主要限制' : 'Key limitations'}</th>
              </tr>
            </thead>
            <tbody>
              {currentSolutions.map((s) => {
                const isUs = s.color === 'blue'
                return (
                  <tr key={s.nameEn} className={`border-t border-gray-100 ${isUs ? 'bg-blue-50/40' : ''}`}>
                    <td className="px-5 py-4">
                      <p className={`font-medium ${isUs ? 'text-blue-800' : 'text-gray-800'}`}>
                        {isZh ? s.nameZh : s.nameEn}
                        {isUs && <span className="ml-2 text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded">US</span>}
                      </p>
                    </td>
                    <td className="text-center px-3 py-4">
                      <span className="text-sm font-semibold text-gray-700">{s.used}%</span>
                    </td>
                    <td className="text-center px-3 py-4">
                      <span className={`text-sm font-bold ${
                        s.satisfaction >= 4 ? 'text-emerald-600' : s.satisfaction >= 3 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {s.satisfaction.toFixed(1)} / 5
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <ul className="text-xs text-gray-600 space-y-0.5">
                        {(isZh ? s.limitsZh : s.limitsEn).map((l) => (
                          <li key={l}>· {l}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Section D — Solution Validation ── */}
      <section className="bg-gray-50 py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
              D
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isZh ? '方案被验证了吗？' : 'Is our solution validated?'}
            </h2>
          </div>
          <p className="text-gray-500 text-sm mb-8 ml-11">
            {isZh
              ? '问卷 Section D：在阅读完平台概念介绍后，用户对方案的吸引力、使用意愿、功能优先级与付费意愿。'
              : 'Survey Section D: appeal, likelihood-to-use, feature ranking and willingness-to-pay after reading the concept overview.'}
          </p>

          {/* Top metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: isZh ? '吸引力评分' : 'Appeal rating', value: solutionValidation.appealRating, sub: '/ 5' },
              { label: isZh ? '使用意愿' : 'Likely to use', value: solutionValidation.likelyToUse, sub: '/ 5' },
              { label: isZh ? '定制化重要性' : 'Customisation importance', value: solutionValidation.customizationImportance, sub: '/ 5' },
            ].map((m) => (
              <div key={m.label} className="bg-white rounded-2xl border border-gray-200 p-5">
                <p className="text-xs text-gray-500 mb-2">{m.label}</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold text-blue-700">{m.value.toFixed(1)}</span>
                  <span className="text-gray-400 text-sm">{m.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Top features ranking */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-1">
              {isZh ? 'D3 · 用户票选 Top 3 最有价值的功能' : 'D3 · Top 3 most valuable features (user-voted)'}
            </h3>
            <p className="text-xs text-gray-400 mb-5">
              {isZh ? '横轴：选择该功能的受访者占比' : 'X-axis: % of respondents who picked this feature'}
            </p>
            <div className="space-y-3.5">
              {solutionValidation.topFeatures.map((f, i) => (
                <div key={f.en}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-gray-700">
                      <span className="text-gray-400 mr-2">#{i + 1}</span>
                      {isZh ? f.zh : f.en}
                    </span>
                    <span className="text-sm font-semibold text-blue-700">{f.pct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${f.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WTP + Concerns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                {isZh ? 'D6 · 付费意愿分布' : 'D6 · Willingness-to-pay distribution'}
              </h3>
              <div className="space-y-2.5">
                {solutionValidation.willingnessToPay.map((w) => (
                  <div key={w.en}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">{isZh ? w.zh : w.en}</span>
                      <span className="font-semibold text-gray-800">{w.pct}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${w.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                {isZh ? 'D7 · 用户最主要的顾虑' : 'D7 · Primary user concerns'}
              </h3>
              <div className="space-y-2.5">
                {solutionValidation.primaryConcerns.map((c) => (
                  <div key={c.en}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">{isZh ? c.zh : c.en}</span>
                      <span className="font-semibold text-gray-800">{c.pct}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: `${c.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section E — Usability ── */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
            E
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isZh ? '用户最看重的是什么？' : 'What do users value most?'}
          </h2>
        </div>
        <p className="text-gray-500 text-sm mb-8 ml-11">
          {isZh
            ? '问卷 Section E：选择咨询平台时的 8 项可用性因素重要性评分（1 = 不重要 → 5 = 极为关键）。'
            : 'Survey Section E: importance of 8 usability factors when picking a consulting platform (1 = not important → 5 = critically important).'}
        </p>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="space-y-4">
            {usabilityFactors
              .slice()
              .sort((a, b) => b.rating - a.rating)
              .map((f) => (
                <div key={f.en}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm text-gray-700 flex-1 pr-4">{isZh ? f.zh : f.en}</p>
                    <span className={`text-sm font-bold shrink-0 ${
                      f.rating >= 4.7 ? 'text-red-600' : f.rating >= 4.4 ? 'text-orange-600' : 'text-blue-700'
                    }`}>
                      {f.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${
                        f.rating >= 4.7 ? 'bg-red-500' : f.rating >= 4.4 ? 'bg-orange-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${(f.rating / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
          <div className="mt-5 pt-5 border-t border-gray-100 text-xs text-gray-500 leading-relaxed">
            {isZh ? (
              <>
                <strong>关键洞察</strong>：「准确性 4.9」与「数据安全 4.8」并列最高 —— 这正是我们用 RAG 引用机制 + Supabase RLS 重点回应的两项需求。
              </>
            ) : (
              <>
                <strong>Insight:</strong> "Accuracy" (4.9) and "Data security" (4.8) tied for the highest — exactly what our RAG citation mechanism + Supabase RLS were built to address.
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Section F — Academic Stakeholders ── */}
      <section className="bg-gray-50 py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
              F
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isZh ? '我们对学术用户也有效吗？' : 'Does it work for academic users too?'}
            </h2>
          </div>
          <p className="text-gray-500 text-sm mb-8 ml-11">
            {isZh
              ? '问卷 Section F：高校学生与教师的反馈，验证我们「双侧用户」战略 —— 既服务企业又服务学术。'
              : 'Survey Section F: feedback from students and faculty, validating our two-sided strategy — serving enterprise and academia simultaneously.'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { label: isZh ? '学术课程跟不上行业实践（频率）' : 'Curriculum lag from industry (frequency)', value: academicInsights.curriculumLagFreq, sub: isZh ? '/ 5（5=非常普遍）' : '/ 5 (5 = very often)' },
              { label: isZh ? '实时案例库的学术价值' : 'Real-time case library value', value: academicInsights.caseLibraryValue, sub: isZh ? '/ 5（5=极有价值）' : '/ 5 (5 = extremely valuable)' },
              { label: isZh ? '推荐给同事/学生的意愿' : 'Likely to recommend', value: academicInsights.recommendLikelihood, sub: isZh ? '/ 5（5=非常愿意）' : '/ 5 (5 = definitely yes)' },
            ].map((m) => (
              <div key={m.label} className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
                <p className="text-xs text-gray-500 mb-2 leading-relaxed h-8">{m.label}</p>
                <div className="text-3xl font-bold text-purple-600 mb-1">{m.value.toFixed(1)}</div>
                <p className="text-[10px] text-gray-400">{m.sub}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              {isZh ? 'F3 · 学术用户最需要的内容类型' : 'F3 · Most useful content types for academic users'}
            </h3>
            <div className="space-y-2.5">
              {academicInsights.topAcademicContent.map((c) => (
                <div key={c.en}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">{isZh ? c.zh : c.en}</span>
                    <span className="font-semibold text-gray-800">{c.pct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${c.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section G — Required Coverage ── */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
            G
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isZh ? '用户说必须覆盖哪些市场和框架？' : 'Which markets & frameworks must we cover?'}
          </h2>
        </div>
        <p className="text-gray-500 text-sm mb-8 ml-11">
          {isZh
            ? '问卷 Section G3 开放回答的归类：用户明确指出必须覆盖（must-have）/ 应当覆盖 / 锦上添花 三档优先级。'
            : 'Categorisation of Section G3 open-ended responses: must-have / should-have / nice-to-have priorities explicitly named by users.'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['must', 'should', 'nice'] as const).map((tier) => {
            const filtered = requiredCoverage.filter((r) => r.priority === tier)
            const labels = {
              must: {
                zh: '必须覆盖', en: 'Must-have',
                heading: 'text-red-700',
                pill: 'bg-red-50 border-red-100',
              },
              should: {
                zh: '应当覆盖', en: 'Should-have',
                heading: 'text-amber-700',
                pill: 'bg-amber-50 border-amber-100',
              },
              nice: {
                zh: '锦上添花', en: 'Nice-to-have',
                heading: 'text-blue-700',
                pill: 'bg-blue-50 border-blue-100',
              },
            }
            const l = labels[tier]
            return (
              <div key={tier} className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`font-semibold ${l.heading}`}>{isZh ? l.zh : l.en}</h3>
                  <span className="text-xs text-gray-400">{filtered.length}</span>
                </div>
                <ul className="space-y-1.5">
                  {filtered.map((r) => (
                    <li key={r.en} className={`text-sm text-gray-700 px-2.5 py-1.5 rounded-lg border ${l.pill}`}>
                      {isZh ? r.zh : r.en}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
        <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800 leading-relaxed">
          <strong>{isZh ? '我们的覆盖现状：' : 'Our current coverage:'}</strong>
          {' '}
          {isZh
            ? '8/9 「必须覆盖」框架已纳入政策库与周更主题；剩余 1 项（中国数据出境）在本周新增。'
            : '8/9 "Must-have" frameworks are already in our policy DB & weekly-update topics; the remaining 1 (China cross-border data) shipped this week.'}
        </div>
      </section>

      {/* ── 3. What we changed (Before/After) ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
            03
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{isZh ? '我们据此改了什么' : 'What we changed as a result'}</h2>
        </div>
        <p className="text-gray-500 text-sm mb-8 ml-11">
          {isZh
            ? '课程评分原则里一句话：「一个 "参与者没能完成任务所以我们改了导航" 的发现，比五条正面反馈更值钱。」'
            : 'The course rubric states verbatim: "A finding like participants couldn\'t complete the task without help, so we redesigned the navigation, is worth more than five positive feedback quotes."'}
        </p>

        <div className="space-y-6">
          {iterations.map((it, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Finding */}
                <div className="p-6 border-b md:border-b-0 md:border-r border-gray-100 bg-red-50/30">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full mb-3">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {isZh ? '发现' : 'Finding'}
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed">{isZh ? it.finding.zh : it.finding.en}</p>
                </div>

                {/* Change */}
                <div className="p-6 bg-emerald-50/30">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mb-3">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {isZh ? '我们的响应' : 'Our response'}
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed mb-3">{isZh ? it.change.zh : it.change.en}</p>
                  {it.affectedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-3 border-t border-emerald-200/60">
                      <span className="text-[10px] text-gray-400 mr-1">{isZh ? '涉及文件：' : 'Files touched: '}</span>
                      {it.affectedFiles.map((f) => (
                        <code
                          key={f}
                          className="text-[10px] bg-white border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-mono"
                        >
                          {f}
                        </code>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Before / After screenshots if available */}
              {(it.before || it.after) && (
                <div className="grid grid-cols-1 md:grid-cols-2 border-t border-gray-100">
                  {it.before && (
                    <div className="p-4 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50">
                      <p className="text-[11px] font-semibold text-gray-500 mb-2">{isZh ? '改动前' : 'Before'}</p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={it.before} alt="before" className="w-full rounded-lg border border-gray-200" />
                    </div>
                  )}
                  {it.after && (
                    <div className="p-4 bg-white">
                      <p className="text-[11px] font-semibold text-emerald-700 mb-2">{isZh ? '改动后' : 'After'}</p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={it.after} alt="after" className="w-full rounded-lg border border-emerald-200" />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. Honest limitations + Next steps ── */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Limitations */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-amber-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                04
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {isZh ? '诚实的限制' : 'Honest limitations'}
              </h2>
            </div>
            <p className="text-gray-500 text-sm mb-5 ml-11">
              {isZh
                ? '我们清楚地知道产品还差在哪 —— 这不是失败，是理解产品。'
                : "We're clear on exactly where the product falls short — that's not failure, that's understanding the product."}
            </p>
            <div className="space-y-3">
              {honestLimitations.map((l, i) => (
                <div
                  key={i}
                  className="flex gap-3 bg-white rounded-xl border border-amber-100 p-4"
                >
                  <span className="shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed">{isZh ? l.zh : l.en}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Next steps */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                05
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {isZh ? '再给我们一个月，我们会做…' : 'If we had one more month…'}
              </h2>
            </div>
            <p className="text-gray-500 text-sm mb-5 ml-11">
              {isZh
                ? '这些是我们已经想清楚的下一步，不是拍脑袋的愿景。'
                : "Concrete next steps we've already thought through, not hand-waving vision."}
            </p>
            <div className="space-y-3">
              {nextSteps.map((s, i) => (
                <div
                  key={i}
                  className="flex gap-3 bg-white rounded-xl border border-blue-100 p-4"
                >
                  <span className="shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed">{isZh ? s.zh : s.en}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-white py-14 px-6 border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-gray-500 mb-5">
            {isZh
              ? '看完证据，去实际体验一下产品：'
              : 'Evidence reviewed — now try the product for real:'}
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link
              href={`/${locale}/chat`}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
            >
              {isZh ? '立即试用 AI 咨询' : 'Try AI Consulting'}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50"
            >
              {isZh ? '了解团队与导师' : 'Meet the Team'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
