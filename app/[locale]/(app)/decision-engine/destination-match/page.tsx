'use client'

import { useState, use } from 'react'
import Link from 'next/link'

const markets = [
  { id: 'eu', label: '欧盟', labelEn: 'European Union', region: 'Europe', compliance: 'high', flag: '🇪🇺' },
  { id: 'uk', label: '英国', labelEn: 'United Kingdom', region: 'Europe', compliance: 'high', flag: '🇬🇧' },
  { id: 'us', label: '美国', labelEn: 'United States', region: 'Americas', compliance: 'high', flag: '🇺🇸' },
  { id: 'sg', label: '新加坡', labelEn: 'Singapore', region: 'Asia', compliance: 'medium', flag: '🇸🇬' },
  { id: 'jp', label: '日本', labelEn: 'Japan', region: 'Asia', compliance: 'medium', flag: '🇯🇵' },
  { id: 'ae', label: '阿联酋', labelEn: 'UAE', region: 'Middle East', compliance: 'medium', flag: '🇦🇪' },
  { id: 'br', label: '巴西', labelEn: 'Brazil', region: 'Americas', compliance: 'medium', flag: '🇧🇷' },
  { id: 'in', label: '印度', labelEn: 'India', region: 'Asia', compliance: 'medium', flag: '🇮🇳' },
  { id: 'au', label: '澳大利亚', labelEn: 'Australia', region: 'Asia Pacific', compliance: 'medium', flag: '🇦🇺' },
  { id: 'kr', label: '韩国', labelEn: 'South Korea', region: 'Asia', compliance: 'medium', flag: '🇰🇷' },
]

const results = [
  { market: '新加坡', marketEn: 'Singapore', flag: '🇸🇬', score: 88, complianceCost: '低', complianceCostEn: 'Low', marketSize: '中', marketSizeEn: 'Medium', entryDifficulty: '低', entryDifficultyEn: 'Low', reason: '数字经济政策友好，AI监管框架清晰，华人市场基础好，跨境数据流通便利，合规成本相对较低', reasonEn: 'Friendly digital economy policies, clear AI regulatory framework, strong overseas Chinese market foundation, convenient cross-border data flows, relatively low compliance costs' },
  { market: '日本', marketEn: 'Japan', flag: '🇯🇵', score: 81, complianceCost: '中', complianceCostEn: 'Medium', marketSize: '大', marketSizeEn: 'Large', entryDifficulty: '中', entryDifficultyEn: 'Medium', reason: '市场规模大，AI应用接受度高，个人信息保护法（APPI）要求明确，技术基础设施完善', reasonEn: 'Large market size, high AI adoption rate, clear Personal Information Protection Act (APPI) requirements, excellent tech infrastructure' },
  { market: '阿联酋', marketEn: 'UAE', flag: '🇦🇪', score: 75, complianceCost: '低', complianceCostEn: 'Low', marketSize: '中', marketSizeEn: 'Medium', entryDifficulty: '低', entryDifficultyEn: 'Low', reason: '中东数字化转型战略机遇，监管环境开放，税收优惠，可作为中东和非洲市场的辐射中心', reasonEn: 'Middle East digital transformation opportunity, open regulatory environment, tax incentives, serves as hub for ME/Africa markets' },
  { market: '欧盟', marketEn: 'European Union', flag: '🇪🇺', score: 62, complianceCost: '高', complianceCostEn: 'High', marketSize: '大', marketSizeEn: 'Large', entryDifficulty: '高', entryDifficultyEn: 'High', reason: '市场规模最大，但EU AI Act和GDPR合规成本高，建议先在其他市场积累经验后再进入', reasonEn: 'Largest market size, but high EU AI Act and GDPR compliance costs. Recommend gaining experience in other markets first' },
]

export default function DestinationMatchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const isZh = locale === 'zh'

  const [step, setStep] = useState(1)
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([])
  const [industry, setIndustry] = useState('')
  const [productType, setProductType] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const toggleMarket = (id: string) => {
    setSelectedMarkets(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id])
  }

  const handleAnalyze = () => {
    setAnalyzing(true)
    setTimeout(() => { setAnalyzing(false); setShowResults(true) }, 2500)
  }

  const scoreColor = (s: number) => s >= 80 ? 'text-green-600' : s >= 70 ? 'text-blue-600' : s >= 60 ? 'text-orange-500' : 'text-red-500'
  const scoreBg = (s: number) => s >= 80 ? 'bg-green-50 border-green-200' : s >= 70 ? 'bg-blue-50 border-blue-200' : s >= 60 ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-200'

  if (showResults) {
    return (
      <div className="p-6 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button onClick={() => setShowResults(false)} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              {isZh ? '重新分析' : 'Re-analyze'}
            </button>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{isZh ? '目的地匹配分析结果' : 'Destination Match Analysis Results'}</h1>
            <p className="text-sm text-gray-500">{isZh ? '基于您的业务信息，AI推荐以下市场优先级排序' : 'Based on your business profile, AI recommends the following market priority ranking'}</p>
          </div>
          <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
            {isZh ? '导出报告' : 'Export Report'}
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {results.map((r, i) => (
            <div key={r.market} className={`bg-white rounded-2xl border p-5 ${scoreBg(r.score)}`}>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border text-sm font-bold text-gray-600 shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{r.flag}</span>
                      <h3 className="font-semibold text-gray-900">{isZh ? r.market : r.marketEn}</h3>
                      {i === 0 && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{isZh ? '首推' : 'Top Pick'}</span>}
                    </div>
                    <span className={`text-2xl font-bold ${scoreColor(r.score)}`}>{r.score}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {[
                      { label: isZh ? '合规成本' : 'Compliance Cost', val: isZh ? r.complianceCost : r.complianceCostEn },
                      { label: isZh ? '市场规模' : 'Market Size', val: isZh ? r.marketSize : r.marketSizeEn },
                      { label: isZh ? '进入难度' : 'Entry Difficulty', val: isZh ? r.entryDifficulty : r.entryDifficultyEn },
                    ].map(item => (
                      <div key={item.label} className="bg-white/70 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                        <p className="text-sm font-semibold text-gray-800">{item.val}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{isZh ? r.reason : r.reasonEn}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">{isZh ? '下一步建议' : 'Next Steps'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link href={`/${locale}/diagnosis/create`}
              className="flex items-center gap-2 p-3 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all text-sm text-gray-700">
              <span className="text-lg">🔍</span>
              {isZh ? '发起合规诊断' : 'Start Compliance Diagnosis'}
            </Link>
            <Link href={`/${locale}/solution-tools`}
              className="flex items-center gap-2 p-3 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all text-sm text-gray-700">
              <span className="text-lg">🛠</span>
              {isZh ? '生成进入方案' : 'Generate Entry Plan'}
            </Link>
            <Link href={`/${locale}/expert-hall`}
              className="flex items-center gap-2 p-3 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all text-sm text-gray-700">
              <span className="text-lg">👤</span>
              {isZh ? '咨询市场专家' : 'Consult Market Expert'}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <Link href={`/${locale}/decision-engine`} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          {isZh ? '返回决策引擎' : 'Back to Decision Engine'}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{isZh ? '出海目的地匹配' : 'Destination Market Matching'}</h1>
        <p className="text-sm text-gray-500">{isZh ? '填写业务信息，AI将为您推荐最优出海市场组合' : 'Fill in your business profile and AI will recommend optimal overseas markets'}</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>{s}</div>
            {s < 3 && <div className={`h-0.5 w-12 transition-all ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
        <span className="text-xs text-gray-400 ml-2">
          {step === 1 ? (isZh ? '基本信息' : 'Basic Info') : step === 2 ? (isZh ? '目标市场' : 'Target Markets') : (isZh ? '确认分析' : 'Confirm')}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold text-gray-900">{isZh ? '第一步：业务基本信息' : 'Step 1: Basic Business Information'}</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{isZh ? '所属行业' : 'Industry'}<span className="text-red-500 ml-1">*</span></label>
              <select value={industry} onChange={e => setIndustry(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">{isZh ? '请选择' : 'Please select'}</option>
                {['AI/大模型', '企业SaaS', '金融科技', '医疗健康', '教育科技', '电商/零售', '自动驾驶', '智能制造'].map(i => (
                  <option key={i}>{i}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{isZh ? '主要产品/服务类型' : 'Main Product / Service Type'}<span className="text-red-500 ml-1">*</span></label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'saas', label: 'SaaS软件', labelEn: 'SaaS Software' },
                  { id: 'api', label: 'API服务', labelEn: 'API Service' },
                  { id: 'hardware', label: '智能硬件', labelEn: 'Smart Hardware' },
                  { id: 'platform', label: '平台/市场', labelEn: 'Platform/Marketplace' },
                  { id: 'consulting', label: '技术咨询', labelEn: 'Tech Consulting' },
                  { id: 'data', label: '数据服务', labelEn: 'Data Service' },
                ].map(p => (
                  <button key={p.id} onClick={() => setProductType(p.id)}
                    className={`px-3 py-2 rounded-xl text-sm border transition-all ${productType === p.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    {isZh ? p.label : p.labelEn}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{isZh ? '年营业额区间' : 'Annual Revenue Range'}</label>
              <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option>{isZh ? '请选择' : 'Please select'}</option>
                <option>{isZh ? '1000万以下' : 'Under ¥10M'}</option>
                <option>{isZh ? '1000万–1亿' : '¥10M–100M'}</option>
                <option>{isZh ? '1亿–10亿' : '¥100M–1B'}</option>
                <option>{isZh ? '10亿以上' : 'Above ¥1B'}</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">{isZh ? '第二步：意向目标市场' : 'Step 2: Target Markets of Interest'}</h2>
            <p className="text-xs text-gray-400 mb-4">{isZh ? '可多选，AI将针对您选择的市场进行深度匹配分析' : 'Multiple selection allowed; AI will perform in-depth matching analysis for your selected markets'}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {markets.map(m => {
                const selected = selectedMarkets.includes(m.id)
                return (
                  <button key={m.id} onClick={() => toggleMarket(m.id)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="text-2xl mb-1">{m.flag}</div>
                    <p className={`text-xs font-medium ${selected ? 'text-blue-700' : 'text-gray-700'}`}>{isZh ? m.label : m.labelEn}</p>
                  </button>
                )
              })}
            </div>
            {selectedMarkets.length > 0 && (
              <p className="text-xs text-blue-600 mt-3">{isZh ? `已选择 ${selectedMarkets.length} 个目标市场` : `${selectedMarkets.length} markets selected`}</p>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-4">{isZh ? '第三步：确认并开始分析' : 'Step 3: Confirm & Start Analysis'}</h2>
            <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">{isZh ? '所属行业' : 'Industry'}</span><span className="font-medium">{industry || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">{isZh ? '产品类型' : 'Product Type'}</span><span className="font-medium">{productType || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">{isZh ? '目标市场' : 'Target Markets'}</span><span className="font-medium">{selectedMarkets.length} {isZh ? '个' : 'markets'}</span></div>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700 leading-relaxed">
              {isZh
                ? 'AI将综合分析以下维度：各市场监管合规要求与成本、市场规模与增长潜力、竞争格局、文化与语言匹配度、时区与运营支持、历史案例成功率，为您输出详细的市场优先级排序报告。'
                : 'AI will comprehensively analyze: regulatory compliance requirements and costs, market size and growth potential, competitive landscape, cultural/language fit, timezone and operational support, and historical success rates, to produce a detailed market priority ranking report.'}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6 pt-5 border-t border-gray-100">
          <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}
            className="px-5 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40">
            {isZh ? '上一步' : 'Back'}
          </button>
          {step < 3 ? (
            <button onClick={() => setStep(s => s + 1)}
              className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
              {isZh ? '下一步' : 'Next'}
            </button>
          ) : (
            <button onClick={handleAnalyze} disabled={analyzing}
              className={`px-5 py-2 rounded-xl text-sm font-medium ${analyzing ? 'bg-blue-400 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
              {analyzing ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  {isZh ? 'AI分析中...' : 'Analyzing...'}
                </span>
              ) : (isZh ? '开始AI分析' : 'Start AI Analysis')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
