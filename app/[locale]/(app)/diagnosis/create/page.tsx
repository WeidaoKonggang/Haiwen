'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'

const steps = [
  { id: 1, title: '企业基本信息', titleEn: 'Company Information' },
  { id: 2, title: '目标市场选择', titleEn: 'Target Market' },
  { id: 3, title: '业务类型与产品', titleEn: 'Business & Product' },
  { id: 4, title: '数据合规场景', titleEn: 'Data Compliance' },
]

const targetMarkets = [
  { id: 'eu', label: '欧盟（EU）', risks: ['EU AI Act', 'GDPR'] },
  { id: 'us', label: '美国（US）', risks: ['AI EO', 'State Laws'] },
  { id: 'sg', label: '新加坡', risks: ['PDPA', 'AI Framework'] },
  { id: 'jp', label: '日本', risks: ['APPI'] },
  { id: 'uk', label: '英国', risks: ['UK GDPR', 'DPDI'] },
  { id: 'ae', label: '阿联酋', risks: ['PDPL'] },
  { id: 'br', label: '巴西', risks: ['LGPD'] },
  { id: 'in', label: '印度', risks: ['DPDPA'] },
  { id: 'sea', label: '东南亚（其他）', risks: ['PDPA variants'] },
  { id: 'mena', label: '中东北非', risks: ['Various'] },
]

export default function DiagnosisCreatePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const router = useRouter()
  const isZh = locale === 'zh'

  const [currentStep, setCurrentStep] = useState(1)
  const [generating, setGenerating] = useState(false)
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    revenue: '',
    overseasExp: '',
    targetMarkets: [] as string[],
    productType: '',
    businessModel: '',
    dataType: '',
    hasCrossBorder: '',
    hasAlgorithm: '',
    hasAIContent: '',
  })

  const toggleMarket = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      targetMarkets: prev.targetMarkets.includes(id)
        ? prev.targetMarkets.filter((m) => m !== id)
        : [...prev.targetMarkets, id],
    }))
  }

  const handleSubmit = async () => {
    setGenerating(true)
    await new Promise((r) => setTimeout(r, 3000))
    router.push(`/${locale}/diagnosis/report/r001`)
  }

  const canProceed = () => {
    if (currentStep === 1) return formData.companyName && formData.industry
    if (currentStep === 2) return formData.targetMarkets.length > 0
    if (currentStep === 3) return formData.productType && formData.businessModel
    if (currentStep === 4) return formData.hasCrossBorder && formData.hasAlgorithm
    return true
  }

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{isZh ? '发起合规诊断' : 'Start Compliance Diagnosis'}</h1>
        <p className="text-gray-500 text-sm">{isZh ? '填写以下信息，AI将为您生成个性化合规诊断报告' : 'Fill in the information below and AI will generate a personalized compliance diagnosis report'}</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center gap-2 flex-1 min-w-0">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              step.id < currentStep ? 'bg-blue-600 text-white' :
              step.id === currentStep ? 'bg-blue-100 text-blue-700 border-2 border-blue-500' :
              'bg-gray-100 text-gray-400'
            }`}>
              {step.id < currentStep ? '✓' : step.id}
            </div>
            <span className={`text-xs hidden sm:block truncate ${step.id === currentStep ? 'text-blue-700 font-medium' : 'text-gray-400'}`}>
              {isZh ? step.title : step.titleEn}
            </span>
            {i < steps.length - 1 && <div className={`h-px flex-1 ${step.id < currentStep ? 'bg-blue-300' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Form content */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        {/* Step 1 */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold text-gray-900">{isZh ? '企业基本信息' : 'Company Information'}</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{isZh ? '企业名称 *' : 'Company Name *'}</label>
              <input value={formData.companyName} onChange={(e) => setFormData((p) => ({ ...p, companyName: e.target.value }))}
                placeholder={isZh ? '请输入企业全称' : 'Enter full company name'}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{isZh ? '所属行业 *' : 'Industry *'}</label>
              <select value={formData.industry} onChange={(e) => setFormData((p) => ({ ...p, industry: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">{isZh ? '请选择行业' : 'Select industry'}</option>
                {['AI基础设施', 'AI应用软件', '智能硬件', '数据服务', '自动驾驶', '医疗AI', '金融科技', '教育科技'].map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{isZh ? '年营业额规模' : 'Annual Revenue'}</label>
              <select value={formData.revenue} onChange={(e) => setFormData((p) => ({ ...p, revenue: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">{isZh ? '请选择规模' : 'Select range'}</option>
                {[isZh ? '1000万以下' : 'Under ¥10M', isZh ? '1000万-1亿' : '¥10M-100M', isZh ? '1亿-10亿' : '¥100M-1B', isZh ? '10亿以上' : 'Over ¥1B'].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{isZh ? '是否有出海经验' : 'Overseas Experience'}</label>
              <div className="flex gap-3">
                {[isZh ? '无出海经验' : 'No experience', isZh ? '正在规划出海' : 'Planning', isZh ? '已在海外运营' : 'Already operating'].map((opt) => (
                  <label key={opt} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer text-sm transition-all ${formData.overseasExp === opt ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    <input type="radio" value={opt} checked={formData.overseasExp === opt} onChange={(e) => setFormData((p) => ({ ...p, overseasExp: e.target.value }))} className="hidden" />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold text-gray-900">{isZh ? '目标市场选择（可多选）' : 'Target Markets (Multiple Allowed)'}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {targetMarkets.map((market) => {
                const selected = formData.targetMarkets.includes(market.id)
                return (
                  <button key={market.id} onClick={() => toggleMarket(market.id)}
                    className={`text-left p-3 rounded-xl border transition-all ${selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <p className={`text-sm font-medium ${selected ? 'text-blue-700' : 'text-gray-700'}`}>{market.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{market.risks.join(', ')}</p>
                  </button>
                )
              })}
            </div>
            {formData.targetMarkets.length > 0 && (
              <p className="text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                {isZh ? `已选择 ${formData.targetMarkets.length} 个目标市场，将针对性评估对应合规要求` : `${formData.targetMarkets.length} markets selected, compliance requirements will be assessed accordingly`}
              </p>
            )}
          </div>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold text-gray-900">{isZh ? '业务类型与产品' : 'Business Type & Product'}</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{isZh ? 'AI产品/服务类型 *' : 'AI Product/Service Type *'}</label>
              <div className="grid grid-cols-2 gap-2">
                {[isZh ? 'AI SaaS软件' : 'AI SaaS', isZh ? 'AI平台/API' : 'AI Platform/API', isZh ? 'AI硬件设备' : 'AI Hardware', isZh ? '数据服务' : 'Data Services', isZh ? 'AI代理/助手' : 'AI Agent/Assistant', isZh ? '生成式AI' : 'Generative AI'].map((type) => (
                  <label key={type} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer text-sm transition-all ${formData.productType === type ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    <input type="radio" value={type} checked={formData.productType === type} onChange={(e) => setFormData((p) => ({ ...p, productType: e.target.value }))} className="hidden" />
                    {type}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{isZh ? '商业模式 *' : 'Business Model *'}</label>
              <div className="flex gap-3">
                {['B2B', 'B2C', 'B2G'].map((model) => (
                  <label key={model} className={`flex-1 text-center py-2.5 rounded-xl border cursor-pointer text-sm font-medium transition-all ${formData.businessModel === model ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    <input type="radio" value={model} checked={formData.businessModel === model} onChange={(e) => setFormData((p) => ({ ...p, businessModel: e.target.value }))} className="hidden" />
                    {model}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{isZh ? '数据处理类型' : 'Data Processing Type'}</label>
              <select value={formData.dataType} onChange={(e) => setFormData((p) => ({ ...p, dataType: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">{isZh ? '请选择' : 'Select'}</option>
                <option value="personal">{isZh ? '处理个人数据（用户数据）' : 'Personal data (user data)'}</option>
                <option value="corporate">{isZh ? '处理企业/机构数据' : 'Corporate/institutional data'}</option>
                <option value="both">{isZh ? '两者均有' : 'Both'}</option>
                <option value="none">{isZh ? '不处理个人数据' : 'No personal data'}</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-base font-semibold text-gray-900">{isZh ? '数据合规场景' : 'Data Compliance Scenarios'}</h2>
            {[
              { key: 'hasCrossBorder', question: isZh ? '是否涉及跨境数据传输（向境外传输用户数据）？' : 'Does your business involve cross-border data transfers (sending user data abroad)?' },
              { key: 'hasAlgorithm', question: isZh ? '是否提供算法推荐服务（个性化推荐、排名、推送等）？' : 'Do you provide algorithm recommendation services (personalized recommendations, rankings, etc.)?' },
              { key: 'hasAIContent', question: isZh ? '是否提供AI生成内容服务（文本、图像、视频生成等）？' : 'Do you provide AI-generated content services (text, image, video generation, etc.)?' },
            ].map((item) => (
              <div key={item.key} className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700 font-medium mb-3">{item.question}</p>
                <div className="flex gap-3">
                  {[isZh ? '是' : 'Yes', isZh ? '否' : 'No', isZh ? '不确定' : 'Unsure'].map((opt) => (
                    <label key={opt} className={`px-5 py-2 rounded-lg border cursor-pointer text-sm font-medium transition-all ${(formData as any)[item.key] === opt ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>
                      <input type="radio" value={opt} checked={(formData as any)[item.key] === opt}
                        onChange={(e) => setFormData((p) => ({ ...p, [item.key]: e.target.value }))} className="hidden" />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-blue-700 leading-relaxed">
                  {isZh ? '提交后AI将基于您的信息生成个性化合规诊断报告，通常需要1-2分钟。报告将展示合规评分、风险识别、缺口分析及整改建议。' : 'After submission, AI will generate a personalized compliance diagnosis report based on your information, typically taking 1-2 minutes.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Generating state */}
        {generating && (
          <div className="absolute inset-0 bg-white/90 rounded-2xl flex flex-col items-center justify-center">
            <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium text-gray-700">{isZh ? 'AI合规诊断中，请稍候...' : 'AI diagnosing, please wait...'}</p>
            <p className="text-xs text-gray-400 mt-1">{isZh ? '正在分析目标市场法规要求，预计1-2分钟' : 'Analyzing target market regulations, approx 1-2 minutes'}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
          disabled={currentStep === 1}
          className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isZh ? '← 上一步' : '← Previous'}
        </button>

        {currentStep < 4 ? (
          <button
            onClick={() => setCurrentStep((s) => s + 1)}
            disabled={!canProceed()}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isZh ? '下一步 →' : 'Next →'}
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canProceed() || generating}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {generating ? (isZh ? 'AI诊断中...' : 'Diagnosing...') : (isZh ? '提交并生成报告 →' : 'Submit & Generate Report →')}
          </button>
        )}
      </div>
    </div>
  )
}
