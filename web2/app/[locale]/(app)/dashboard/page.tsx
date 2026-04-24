import Link from 'next/link'
import { dashboardStats, riskEventData } from '@/lib/mock-data'

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isZh = locale === 'zh'

  const kpis = [
    {
      title: isZh ? '合规评分' : 'Compliance Score',
      value: dashboardStats.complianceScore,
      unit: '/100',
      trend: '+3',
      trendUp: true,
      color: 'blue',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      desc: isZh ? '较上月提升3分' : '+3 from last month',
    },
    {
      title: isZh ? '风险指数' : 'Risk Index',
      value: dashboardStats.riskIndex,
      unit: '/10',
      trend: '-0.4',
      trendUp: true,
      color: 'orange',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      desc: isZh ? '较上月下降，风险降低' : 'Decreased from last month',
    },
    {
      title: isZh ? 'ESG评分' : 'ESG Score',
      value: dashboardStats.esgScore,
      unit: '/100',
      trend: '+5',
      trendUp: true,
      color: 'green',
      icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      desc: isZh ? '本季度ESG数据已采集' : 'Q4 ESG data collected',
    },
    {
      title: isZh ? '进行中项目' : 'Active Projects',
      value: dashboardStats.activeProjects,
      unit: isZh ? '个' : '',
      trend: '+1',
      trendUp: true,
      color: 'purple',
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      desc: isZh ? '欧盟合规、ESG体系建设等' : 'EU compliance, ESG setup, etc.',
    },
  ]

  const colorConfig: Record<string, { bg: string; text: string; bar: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', bar: 'bg-blue-500' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', bar: 'bg-orange-500' },
    green: { bg: 'bg-green-50', text: 'text-green-600', bar: 'bg-green-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', bar: 'bg-purple-500' },
  }

  const quickActions = [
    { label: isZh ? '发起合规诊断' : 'Start Diagnosis', href: '/diagnosis/create', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: 'blue' },
    { label: isZh ? 'AI智能咨询' : 'AI Consulting', href: '/ai-chat', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', color: 'indigo' },
    { label: isZh ? '政策数据库' : 'Policy Database', href: '/policy-db', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13', color: 'violet' },
    { label: isZh ? 'ESG数据采集' : 'ESG Data Input', href: '/esg-manage/data-collect', icon: 'M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z', color: 'green' },
    { label: isZh ? '出海目的地匹配' : 'Destination Match', href: '/decision-engine/destination-match', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276', color: 'cyan' },
    { label: isZh ? '生成ESG报告' : 'Generate ESG Report', href: '/esg-manage/report-create', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'teal' },
  ]

  const actionColorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
    indigo: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
    violet: 'bg-violet-50 text-violet-700 hover:bg-violet-100',
    green: 'bg-green-50 text-green-700 hover:bg-green-100',
    cyan: 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100',
    teal: 'bg-teal-50 text-teal-700 hover:bg-teal-100',
  }

  const recentActivities = [
    { text: isZh ? 'EU AI Act合规诊断报告已生成' : 'EU AI Act compliance report generated', time: '2小时前', type: 'success' },
    { text: isZh ? 'GDPR跨境传输评估已完成' : 'GDPR cross-border transfer assessment done', time: '1天前', type: 'success' },
    { text: isZh ? 'Q3 ESG数据采集已提交审核' : 'Q3 ESG data submitted for review', time: '2天前', type: 'info' },
    { text: isZh ? '新加坡PDPA政策更新提醒' : 'Singapore PDPA policy update alert', time: '3天前', type: 'warning' },
    { text: isZh ? '出海决策方案（东南亚方向）已导出' : 'Go-global plan (Southeast Asia) exported', time: '5天前', type: 'info' },
  ]

  const pendingTasks = [
    { text: isZh ? '完善EU AI Act合规整改清单' : 'Complete EU AI Act remediation checklist', priority: 'high', due: isZh ? '3天后到期' : 'Due in 3 days' },
    { text: isZh ? '上传Q3碳排放核算数据' : 'Upload Q3 carbon emission data', priority: 'medium', due: isZh ? '7天后到期' : 'Due in 7 days' },
    { text: isZh ? '确认新加坡子公司注册资料' : 'Confirm Singapore subsidiary registration docs', priority: 'medium', due: isZh ? '10天后到期' : 'Due in 10 days' },
    { text: isZh ? '预约ESG评级提升咨询' : 'Schedule ESG rating consultation', priority: 'low', due: isZh ? '本月内' : 'This month' },
  ]

  const priorityConfig: Record<string, { bg: string; text: string; label: string }> = {
    high: { bg: 'bg-red-50', text: 'text-red-600', label: isZh ? '紧急' : 'Urgent' },
    medium: { bg: 'bg-orange-50', text: 'text-orange-600', label: isZh ? '重要' : 'Important' },
    low: { bg: 'bg-gray-50', text: 'text-gray-500', label: isZh ? '普通' : 'Normal' },
  }

  const highRisks = riskEventData.filter((r) => r.status === 'active')

  return (
    <div className="p-6 max-w-[1200px]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {isZh ? '👋 欢迎回来' : '👋 Welcome back'}
        </h1>
        <p className="text-gray-500 text-sm">
          {isZh
            ? `今日 ${new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}，以下是您的平台概览`
            : `Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => {
          const c = colorConfig[kpi.color]
          return (
            <div key={kpi.title} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center`}>
                  <svg className={`w-5 h-5 ${c.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={kpi.icon} />
                  </svg>
                </div>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                  {kpi.trend}
                </span>
              </div>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-3xl font-bold text-gray-900">{kpi.value}</span>
                <span className="text-sm text-gray-400 mb-0.5">{kpi.unit}</span>
              </div>
              <p className="text-sm text-gray-500 font-medium mb-0.5">{kpi.title}</p>
              <p className="text-xs text-gray-400">{kpi.desc}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              {isZh ? '快捷操作' : 'Quick Actions'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={`/${locale}${action.href}`}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${actionColorMap[action.color]}`}
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
                  </svg>
                  <span className="truncate">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              {isZh ? '最近动态' : 'Recent Activity'}
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    activity.type === 'success' ? 'bg-green-400' :
                    activity.type === 'warning' ? 'bg-orange-400' : 'bg-blue-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">{activity.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Risk Alerts */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">{isZh ? '风险预警' : 'Risk Alerts'}</h2>
              <Link href={`/${locale}/risk-assessment`} className="text-xs text-blue-600 hover:underline">
                {isZh ? '全部 →' : 'All →'}
              </Link>
            </div>
            <div className="space-y-3">
              {highRisks.slice(0, 2).map((risk) => (
                <div key={risk.id} className={`rounded-xl p-3 ${risk.level === 'high' ? 'bg-red-50 border border-red-100' : 'bg-orange-50 border border-orange-100'}`}>
                  <div className="flex items-start gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${risk.level === 'high' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                      {risk.level === 'high' ? (isZh ? '高风险' : 'High') : (isZh ? '中风险' : 'Medium')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 mt-2 leading-relaxed line-clamp-2">{isZh ? risk.title : risk.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{risk.region} · {risk.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">{isZh ? '待办事项' : 'Pending Tasks'}</h2>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{pendingTasks.length}</span>
            </div>
            <div className="space-y-3">
              {pendingTasks.map((task, i) => {
                const p = priorityConfig[task.priority]
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded border-2 border-gray-200 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 leading-relaxed">{task.text}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${p.bg} ${p.text} font-medium`}>{p.label}</span>
                        <span className="text-[10px] text-gray-400">{task.due}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
