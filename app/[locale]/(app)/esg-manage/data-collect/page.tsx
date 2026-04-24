'use client'

import { useState, use } from 'react'
import Link from 'next/link'

const tabs = [
  { id: 'E', label: '环境（E）', labelEn: 'Environmental (E)', color: 'green' },
  { id: 'S', label: '社会（S）', labelEn: 'Social (S)', color: 'blue' },
  { id: 'G', label: '治理（G）', labelEn: 'Governance (G)', color: 'purple' },
]

const eMetrics = [
  { id: 'carbon', label: '碳排放总量（范围一+二）', unit: '吨CO₂e', required: true },
  { id: 'energy', label: '能源消耗总量', unit: '兆瓦时(MWh)', required: true },
  { id: 'renewable', label: '可再生能源占比', unit: '%', required: false },
  { id: 'water', label: '用水总量', unit: '立方米', required: false },
  { id: 'waste', label: '固体废弃物产生量', unit: '吨', required: false },
  { id: 'datacenter_pue', label: '数据中心PUE值', unit: '比值', required: true },
]

const sMetrics = [
  { id: 'employees', label: '员工总数（年末）', unit: '人', required: true },
  { id: 'female_ratio', label: '女性员工占比', unit: '%', required: true },
  { id: 'training_hours', label: '人均培训时长', unit: '小时/人', required: false },
  { id: 'satisfaction', label: '员工满意度调研分数', unit: '/100', required: false },
  { id: 'injury_rate', label: '工伤事故率', unit: '‰', required: true },
  { id: 'community', label: '社区投入金额', unit: '万元', required: false },
]

const gMetrics = [
  { id: 'board_independent', label: '独立董事占比', unit: '%', required: true },
  { id: 'female_board', label: '女性董事占比', unit: '%', required: false },
  { id: 'anticorrupt_training', label: '反腐败培训覆盖率', unit: '%', required: true },
  { id: 'data_breach', label: '数据泄露事件数量', unit: '起', required: true },
  { id: 'compliance_violations', label: '合规违规事件数量', unit: '起', required: true },
  { id: 'tax_rate', label: '综合税务贡献额', unit: '万元', required: false },
]

const metricsMap: Record<string, typeof eMetrics> = { E: eMetrics, S: sMetrics, G: gMetrics }

export default function EsgDataCollectPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const isZh = locale === 'zh'

  const [activeTab, setActiveTab] = useState('E')
  const [values, setValues] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const currentMetrics = metricsMap[activeTab] || []
  const filledCount = currentMetrics.filter((m) => values[m.id]?.trim()).length

  const tabColor: Record<string, { active: string; text: string }> = {
    green: { active: 'bg-green-600 text-white', text: 'text-green-600' },
    blue: { active: 'bg-blue-600 text-white', text: 'text-blue-600' },
    purple: { active: 'bg-purple-600 text-white', text: 'text-purple-600' },
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href={`/${locale}/esg-manage`} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            {isZh ? '返回ESG管理' : 'Back to ESG'}
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{isZh ? 'ESG数据采集' : 'ESG Data Collection'}</h1>
          <p className="text-sm text-gray-500">{isZh ? '按环境、社会、治理三维度填报ESG指标数据' : 'Input ESG indicator data across Environmental, Social, and Governance dimensions'}</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            {isZh ? '下载模板' : 'Download Template'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            {isZh ? '批量导入' : 'Bulk Import'}
          </button>
        </div>
      </div>

      {/* Year & Period */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 flex items-center gap-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1">{isZh ? '统计年度' : 'Report Year'}</label>
          <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-400 bg-white">
            <option>2024</option><option>2023</option><option>2022</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">{isZh ? '统计周期' : 'Period'}</label>
          <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-400 bg-white">
            <option>{isZh ? '全年' : 'Full Year'}</option>
            <option>Q1</option><option>Q2</option><option>Q3</option><option>Q4</option>
          </select>
        </div>
        <div className="ml-auto text-sm text-gray-500">
          {isZh ? `已填写 ${filledCount}/${currentMetrics.length} 项指标` : `${filledCount}/${currentMetrics.length} indicators filled`}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => {
          const c = tabColor[tab.color]
          const isActive = activeTab === tab.id
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? c.active : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {isZh ? tab.label : tab.labelEn}
            </button>
          )
        })}
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {currentMetrics.map((metric) => (
            <div key={metric.id}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {metric.label}
                {metric.required && <span className="text-red-500 ml-1">*</span>}
                <span className="text-gray-400 font-normal ml-1">({metric.unit})</span>
              </label>
              <input
                type="number"
                value={values[metric.id] || ''}
                onChange={(e) => setValues((prev) => ({ ...prev, [metric.id]: e.target.value }))}
                placeholder={isZh ? '请输入数值' : 'Enter value'}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            {isZh ? '* 为必填项，提交后AI将自动进行数据校验和合规性核查' : '* Required fields. AI will auto-validate data after submission'}
          </p>
          <div className="flex gap-3">
            <button onClick={handleSave}
              className="px-5 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
              {saved ? (isZh ? '✓ 已保存' : '✓ Saved') : (isZh ? '暂存草稿' : 'Save Draft')}
            </button>
            <Link href={`/${locale}/esg-manage`}
              className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
              {isZh ? '提交数据' : 'Submit Data'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
