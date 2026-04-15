'use client'

import { useState, use } from 'react'
import Link from 'next/link'

const standards = [
  { id: 'gri', label: 'GRI 2021', desc: '全球报告倡议组织通用准则', descEn: 'Global Reporting Initiative Universal Standards', popular: true },
  { id: 'issb', label: 'ISSB IFRS S1/S2', desc: '国际可持续发展准则理事会', descEn: 'International Sustainability Standards Board', popular: true },
  { id: 'tcfd', label: 'TCFD', desc: '气候相关财务信息披露工作组', descEn: 'Task Force on Climate-related Financial Disclosures', popular: false },
  { id: 'sasb', label: 'SASB (Tech)', desc: '可持续会计准则委员会科技行业', descEn: 'Sustainability Accounting Standards Board - Tech', popular: false },
  { id: 'csrd', label: 'EU CSRD/ESRS', desc: '欧盟企业可持续发展报告指令', descEn: 'EU Corporate Sustainability Reporting Directive', popular: false },
  { id: 'cass', label: '中国CASS-ESG', desc: '中国社科院ESG评价体系', descEn: 'Chinese Academy of Social Sciences ESG', popular: false },
]

const chapters = [
  { id: 'overview', label: '企业概述', labelEn: 'Company Overview', status: 'ready' },
  { id: 'governance', label: '治理架构', labelEn: 'Governance Structure', status: 'ready' },
  { id: 'environmental', label: '环境（E）指标', labelEn: 'Environmental (E) Metrics', status: 'ready' },
  { id: 'social', label: '社会（S）指标', labelEn: 'Social (S) Metrics', status: 'partial' },
  { id: 'risk', label: '风险管理', labelEn: 'Risk Management', status: 'partial' },
  { id: 'targets', label: '目标与展望', labelEn: 'Targets & Outlook', status: 'missing' },
]

export default function EsgReportCreatePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const isZh = locale === 'zh'

  const [selectedStandards, setSelectedStandards] = useState<string[]>(['gri'])
  const [reportYear, setReportYear] = useState('2024')
  const [reportLang, setReportLang] = useState('zh')
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const toggleStandard = (id: string) => {
    setSelectedStandards(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
    }, 3000)
  }

  const statusConfig: Record<string, { color: string; label: string; labelEn: string }> = {
    ready: { color: 'text-green-600 bg-green-50', label: '数据完整', labelEn: 'Complete' },
    partial: { color: 'text-orange-600 bg-orange-50', label: '部分缺失', labelEn: 'Partial' },
    missing: { color: 'text-red-600 bg-red-50', label: '数据缺失', labelEn: 'Missing' },
  }

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href={`/${locale}/esg-manage`} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            {isZh ? '返回ESG管理' : 'Back to ESG'}
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{isZh ? 'ESG报告生成' : 'ESG Report Generation'}</h1>
          <p className="text-sm text-gray-500">{isZh ? 'AI驱动的ESG报告自动生成，符合GRI/ISSB等国际主流标准' : 'AI-powered ESG report generation compliant with GRI/ISSB and other major standards'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Config */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Settings */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">{isZh ? '报告基本设置' : 'Report Settings'}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">{isZh ? '报告年度' : 'Report Year'}</label>
                <select value={reportYear} onChange={e => setReportYear(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                  <option>2024</option><option>2023</option><option>2022</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">{isZh ? '报告语言' : 'Language'}</label>
                <select value={reportLang} onChange={e => setReportLang(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="zh">{isZh ? '中文' : 'Chinese'}</option>
                  <option value="en">{isZh ? '英文' : 'English'}</option>
                  <option value="both">{isZh ? '中英双语' : 'Bilingual'}</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">{isZh ? '输出格式' : 'Output Format'}</label>
                <select className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                  <option>PDF</option>
                  <option>Word (.docx)</option>
                  <option>HTML</option>
                </select>
              </div>
            </div>
          </div>

          {/* Standard Selection */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-1">{isZh ? '适配报告标准' : 'Report Standards'}</h2>
            <p className="text-xs text-gray-400 mb-4">{isZh ? '选择一个或多个标准，AI将自动适配对应章节结构和披露要求' : 'Select one or more standards; AI will automatically adapt chapter structure and disclosure requirements'}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {standards.map(std => {
                const selected = selectedStandards.includes(std.id)
                return (
                  <button key={std.id} onClick={() => toggleStandard(std.id)}
                    className={`relative text-left p-4 rounded-xl border-2 transition-all ${selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    {std.popular && (
                      <span className="absolute top-2 right-2 text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">{isZh ? '常用' : 'Popular'}</span>
                    )}
                    <p className={`text-sm font-semibold mb-0.5 ${selected ? 'text-blue-700' : 'text-gray-800'}`}>{std.label}</p>
                    <p className="text-xs text-gray-500">{isZh ? std.desc : std.descEn}</p>
                    {selected && (
                      <svg className="absolute bottom-2 right-2 w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Data Completeness Check */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">{isZh ? '报告章节数据检查' : 'Chapter Data Check'}</h2>
            <div className="space-y-3">
              {chapters.map(ch => {
                const sc = statusConfig[ch.status]
                return (
                  <div key={ch.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${ch.status === 'ready' ? 'bg-green-500' : ch.status === 'partial' ? 'bg-orange-400' : 'bg-red-400'}`} />
                      <span className="text-sm text-gray-700">{isZh ? ch.label : ch.labelEn}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${sc.color}`}>{isZh ? sc.label : sc.labelEn}</span>
                      {ch.status !== 'ready' && (
                        <Link href={`/${locale}/esg-manage/data-collect`} className="text-xs text-blue-600 hover:underline">
                          {isZh ? '补充数据' : 'Add Data'}
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 p-3 bg-orange-50 border border-orange-100 rounded-xl">
              <p className="text-xs text-orange-700">
                {isZh ? '⚠️ 部分章节数据不完整，AI将基于已有数据生成，缺失部分将标注待补充。建议先完善数据再生成报告以提升质量。' : '⚠️ Some chapters have incomplete data. AI will generate based on available data and mark missing sections. We recommend completing data first for higher quality.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">{isZh ? '生成摘要' : 'Generation Summary'}</h3>
            <div className="space-y-2 text-xs text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>{isZh ? '报告年度' : 'Year'}</span>
                <span className="font-medium text-gray-900">{reportYear}</span>
              </div>
              <div className="flex justify-between">
                <span>{isZh ? '适配标准' : 'Standards'}</span>
                <span className="font-medium text-gray-900">{selectedStandards.length} {isZh ? '项' : 'selected'}</span>
              </div>
              <div className="flex justify-between">
                <span>{isZh ? '数据完整度' : 'Data Coverage'}</span>
                <span className="font-medium text-orange-600">67%</span>
              </div>
              <div className="flex justify-between">
                <span>{isZh ? '预计页数' : 'Est. Pages'}</span>
                <span className="font-medium text-gray-900">~45 {isZh ? '页' : 'pages'}</span>
              </div>
            </div>

            {!generated ? (
              <button onClick={handleGenerate} disabled={generating || selectedStandards.length === 0}
                className={`w-full py-3 rounded-xl text-sm font-medium transition-all ${generating ? 'bg-blue-400 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                {generating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {isZh ? 'AI生成中...' : 'Generating...'}
                  </span>
                ) : (isZh ? '立即生成报告' : 'Generate Report')}
              </button>
            ) : (
              <div className="space-y-2">
                <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-center">
                  <p className="text-sm font-medium text-green-700">✓ {isZh ? '报告生成完成' : 'Report Generated'}</p>
                  <p className="text-xs text-green-600 mt-1">{isZh ? 'ESG报告2024.pdf' : 'ESG_Report_2024.pdf'}</p>
                </div>
                <button className="w-full py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700">
                  {isZh ? '下载报告PDF' : 'Download PDF'}
                </button>
                <button onClick={() => setGenerated(false)}
                  className="w-full py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">
                  {isZh ? '重新生成' : 'Regenerate'}
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">{isZh ? 'AI报告特性' : 'AI Report Features'}</h3>
            <div className="space-y-2">
              {[
                { icon: '✓', text: isZh ? '自动适配GRI/ISSB披露要求' : 'Auto-adapt GRI/ISSB disclosures' },
                { icon: '✓', text: isZh ? '智能填充行业对标数据' : 'Intelligent industry benchmarking' },
                { icon: '✓', text: isZh ? '数据异常自动标注提醒' : 'Auto-flag data anomalies' },
                { icon: '✓', text: isZh ? '中英文双语版本支持' : 'Bilingual Chinese/English support' },
                { icon: '✓', text: isZh ? '支持PDF/Word导出格式' : 'PDF/Word export formats' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="text-green-600 shrink-0">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">{isZh ? '需要专业核查？' : 'Need Professional Review?'}</h3>
            <p className="text-xs text-blue-700 leading-relaxed mb-3">
              {isZh ? '我们的ESG专家可对AI生成的报告进行专业审阅和修订，确保报告质量符合监管要求。' : 'Our ESG experts can professionally review and revise AI-generated reports to ensure compliance quality.'}
            </p>
            <Link href={`/${locale}/expert-hall`}
              className="block w-full text-center py-2 bg-blue-600 text-white rounded-xl text-xs font-medium hover:bg-blue-700">
              {isZh ? '预约ESG专家审阅' : 'Book Expert Review'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
