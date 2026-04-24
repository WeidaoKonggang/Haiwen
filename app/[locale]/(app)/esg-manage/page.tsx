import Link from 'next/link'
import { esgMetrics } from '@/lib/mock-data'

export default async function EsgManagePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isZh = locale === 'zh'

  const dimensions = [
    {
      key: 'E',
      label: isZh ? '环境（E）' : 'Environmental (E)',
      score: esgMetrics.environmental.score,
      color: 'green',
      metrics: [
        { label: isZh ? '碳排放' : 'Carbon Emission', value: `${esgMetrics.environmental.carbonEmission.value} ${esgMetrics.environmental.carbonEmission.unit}`, trend: esgMetrics.environmental.carbonEmission.trend },
        { label: isZh ? '能源消耗' : 'Energy Consumption', value: `${esgMetrics.environmental.energyConsumption.value} ${esgMetrics.environmental.energyConsumption.unit}`, trend: esgMetrics.environmental.energyConsumption.trend },
        { label: isZh ? '可再生能源占比' : 'Renewable Energy', value: `${esgMetrics.environmental.renewableEnergy.value}%`, trend: esgMetrics.environmental.renewableEnergy.trend },
      ],
    },
    {
      key: 'S',
      label: isZh ? '社会（S）' : 'Social (S)',
      score: esgMetrics.social.score,
      color: 'blue',
      metrics: [
        { label: isZh ? '员工总数' : 'Total Employees', value: `${esgMetrics.social.employees}人`, trend: null },
        { label: isZh ? '女性员工占比' : 'Female Employee Ratio', value: `${esgMetrics.social.femaleRatio}%`, trend: null },
        { label: isZh ? '人均培训时长' : 'Training Hours/Person', value: `${esgMetrics.social.trainingHours}小时`, trend: null },
      ],
    },
    {
      key: 'G',
      label: isZh ? '治理（G）' : 'Governance (G)',
      score: esgMetrics.governance.score,
      color: 'purple',
      metrics: [
        { label: isZh ? '独立董事比例' : 'Board Independence', value: `${esgMetrics.governance.boardIndependence}%`, trend: null },
        { label: isZh ? '反腐培训覆盖率' : 'Anti-Corruption Training', value: `${esgMetrics.governance.antiCorruptionTraining}%`, trend: null },
        { label: isZh ? '数据泄露事件' : 'Data Breach Incidents', value: `${esgMetrics.governance.dataBreachIncidents}起`, trend: null },
      ],
    },
  ]

  const overallScore = Math.round((esgMetrics.environmental.score + esgMetrics.social.score + esgMetrics.governance.score) / 3)

  const colorConfig: Record<string, { bg: string; text: string; bar: string; light: string }> = {
    green: { bg: 'bg-green-50', text: 'text-green-700', bar: 'bg-green-500', light: 'text-green-600' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', bar: 'bg-blue-500', light: 'text-blue-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', bar: 'bg-purple-500', light: 'text-purple-600' },
  }

  const quickActions = [
    { label: isZh ? 'ESG数据采集' : 'ESG Data Collection', href: '/esg-manage/data-collect', desc: isZh ? '填报环境、社会、治理三维度数据' : 'Input E, S, G dimension data', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'blue' },
    { label: isZh ? 'ESG报告生成' : 'ESG Report Generation', href: '/esg-manage/report-create', desc: isZh ? '一键生成符合GRI/ISSB等标准的ESG报告' : 'Generate ESG reports compliant with GRI/ISSB', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'green' },
    { label: isZh ? '体系规划' : 'System Planning', href: '/esg-manage', desc: isZh ? 'AI生成ESG管理体系建设路线图' : 'AI-generated ESG management system roadmap', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', color: 'purple' },
    { label: isZh ? '评级提升咨询' : 'Rating Improvement', href: '/expert-hall', desc: isZh ? '咨询MSCI/富时ESG评级提升方案' : 'Consult on MSCI/FTSE ESG rating improvement', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', color: 'orange' },
  ]

  const actionColor: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
    orange: 'bg-orange-50 text-orange-700',
  }

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{isZh ? 'ESG全流程管理' : 'ESG Management'}</h1>
        <p className="text-gray-500 text-sm">{isZh ? '适配AI行业的ESG数据采集、报告生成与评级提升一体化管理平台' : 'AI industry-adapted integrated platform for ESG data collection, report generation, and rating improvement'}</p>
      </div>

      {/* Overall Score */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Overall */}
          <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl">
            <p className="text-xs text-gray-500 mb-2">{isZh ? 'ESG综合评分' : 'ESG Overall Score'}</p>
            <span className="text-4xl font-bold text-gray-900">{overallScore}</span>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-1">+5 {isZh ? '较上季度' : 'vs last Q'}</span>
          </div>

          {/* 3 Dimensions */}
          {dimensions.map((dim) => {
            const c = colorConfig[dim.color]
            return (
              <div key={dim.key} className={`${c.bg} rounded-2xl p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-semibold ${c.text}`}>{dim.label}</span>
                  <span className={`text-2xl font-bold ${c.light}`}>{dim.score}</span>
                </div>
                <div className="w-full bg-white/60 rounded-full h-1.5 mb-3">
                  <div className={`${c.bar} h-1.5 rounded-full`} style={{ width: `${dim.score}%` }} />
                </div>
                <div className="space-y-1">
                  {dim.metrics.map((metric) => (
                    <div key={metric.label} className="flex justify-between text-xs">
                      <span className="text-gray-500">{metric.label}</span>
                      <span className={`font-medium ${c.text}`}>{metric.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">{isZh ? '功能入口' : 'Feature Access'}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={`/${locale}${action.href}`}
              className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all group">
              <div className={`w-10 h-10 ${actionColor[action.color]} rounded-xl flex items-center justify-center mb-3`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">{action.label}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Standards Compliance */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">{isZh ? 'ESG标准适配状态' : 'ESG Standards Compliance Status'}</h2>
        <div className="space-y-3">
          {[
            { std: 'GRI 2021', status: 'completed', desc: isZh ? '已完成GRI通用准则与环境专项准则适配' : 'GRI Universal and Environmental standards adapted', progress: 85 },
            { std: 'ISSB IFRS S1/S2', status: 'inProgress', desc: isZh ? '气候相关信息披露（S2）适配进行中，计划Q1完成' : 'Climate disclosure (S2) adaptation in progress, Q1 target', progress: 55 },
            { std: 'TCFD', status: 'inProgress', desc: isZh ? '气候风险治理架构已建立，情景分析待完善' : 'Climate risk governance established, scenario analysis pending', progress: 68 },
            { std: 'SASB (Tech)', status: 'planned', desc: isZh ? '科技行业专项指标（数据安全、算法公平性）待导入' : 'Tech sector metrics (data security, algorithmic fairness) pending', progress: 20 },
            { std: 'EU CSRD/ESRS', status: 'planned', desc: isZh ? '欧盟CSRD适用性评估中，适用时间线待确认' : 'EU CSRD applicability assessment in progress', progress: 10 },
          ].map((item) => (
            <div key={item.std} className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 w-36 shrink-0">{item.std}</span>
              <div className="flex-1">
                <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${item.status === 'completed' ? 'bg-green-500' : item.status === 'inProgress' ? 'bg-blue-500' : 'bg-gray-300'}`}
                    style={{ width: `${item.progress}%` }} />
                </div>
              </div>
              <span className="text-xs text-gray-400 w-8 text-right">{item.progress}%</span>
              <span className={`text-xs px-2 py-0.5 rounded-full w-16 text-center ${
                item.status === 'completed' ? 'bg-green-50 text-green-700' :
                item.status === 'inProgress' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-500'
              }`}>
                {item.status === 'completed' ? (isZh ? '已完成' : 'Done') :
                 item.status === 'inProgress' ? (isZh ? '进行中' : 'In Progress') : (isZh ? '计划中' : 'Planned')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
