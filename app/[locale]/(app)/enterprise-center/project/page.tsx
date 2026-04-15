import Link from 'next/link'

const projects = [
  {
    id: 'p001',
    name: 'EU AI Act合规整改',
    nameEn: 'EU AI Act Compliance Remediation',
    market: '欧盟',
    marketEn: 'EU',
    status: 'active',
    priority: 'high',
    progress: 35,
    deadline: '2025-07-31',
    owner: '张伟',
    ownerEn: 'Zhang Wei',
    tasks: { total: 12, done: 4 },
    tags: ['AI法规', 'GDPR'],
    tagsEn: ['AI Regulation', 'GDPR'],
  },
  {
    id: 'p002',
    name: 'GDPR数据合规项目',
    nameEn: 'GDPR Data Compliance Project',
    market: '欧盟/英国',
    marketEn: 'EU/UK',
    status: 'active',
    priority: 'high',
    progress: 60,
    deadline: '2025-03-31',
    owner: '李梅',
    ownerEn: 'Li Mei',
    tasks: { total: 8, done: 5 },
    tags: ['数据保护', '跨境传输'],
    tagsEn: ['Data Protection', 'Cross-border Transfer'],
  },
  {
    id: 'p003',
    name: 'ESG 2024年报生成',
    nameEn: 'ESG 2024 Annual Report',
    market: '全球',
    marketEn: 'Global',
    status: 'active',
    priority: 'medium',
    progress: 20,
    deadline: '2025-04-30',
    owner: '王刚',
    ownerEn: 'Wang Gang',
    tasks: { total: 6, done: 1 },
    tags: ['ESG', 'GRI'],
    tagsEn: ['ESG', 'GRI'],
  },
  {
    id: 'p004',
    name: '新加坡PDPA合规',
    nameEn: 'Singapore PDPA Compliance',
    market: '新加坡',
    marketEn: 'Singapore',
    status: 'completed',
    priority: 'medium',
    progress: 100,
    deadline: '2024-10-31',
    owner: '陈静',
    ownerEn: 'Chen Jing',
    tasks: { total: 5, done: 5 },
    tags: ['个人数据'],
    tagsEn: ['Personal Data'],
  },
]

const statusConfig: Record<string, { label: string; labelEn: string; color: string }> = {
  active: { label: '进行中', labelEn: 'Active', color: 'bg-blue-50 text-blue-700' },
  completed: { label: '已完成', labelEn: 'Completed', color: 'bg-green-50 text-green-700' },
  paused: { label: '暂停', labelEn: 'Paused', color: 'bg-gray-100 text-gray-500' },
}

const priorityConfig: Record<string, { label: string; labelEn: string; dot: string }> = {
  high: { label: '高优先级', labelEn: 'High Priority', dot: 'bg-red-500' },
  medium: { label: '中优先级', labelEn: 'Medium Priority', dot: 'bg-orange-400' },
  low: { label: '低优先级', labelEn: 'Low Priority', dot: 'bg-green-400' },
}

export default async function ProjectPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isZh = locale === 'zh'

  const active = projects.filter(p => p.status === 'active')
  const completed = projects.filter(p => p.status === 'completed')

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href={`/${locale}/enterprise-center`} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            {isZh ? '返回企业中心' : 'Back to Enterprise Center'}
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{isZh ? '项目管理' : 'Project Management'}</h1>
          <p className="text-sm text-gray-500">{isZh ? '追踪合规项目进度，协同团队完成合规整改任务' : 'Track compliance project progress and collaborate on remediation tasks'}</p>
        </div>
        <Link href={`/${locale}/diagnosis/create`}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
          {isZh ? '+ 新建项目' : '+ New Project'}
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: isZh ? '进行中' : 'Active Projects', value: active.length, color: 'text-blue-600' },
          { label: isZh ? '已完成' : 'Completed', value: completed.length, color: 'text-green-600' },
          { label: isZh ? '总任务数' : 'Total Tasks', value: projects.reduce((s, p) => s + p.tasks.total, 0), color: 'text-gray-700' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Project List */}
      <div className="space-y-4">
        {projects.map(p => {
          const sc = statusConfig[p.status]
          const pc = priorityConfig[p.priority]
          return (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${pc.dot}`} />
                    <h3 className="text-sm font-semibold text-gray-900">{isZh ? p.name : p.nameEn}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${sc.color}`}>{isZh ? sc.label : sc.labelEn}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>🌍 {isZh ? p.market : p.marketEn}</span>
                    <span>👤 {isZh ? p.owner : p.ownerEn}</span>
                    <span>📅 {isZh ? '截止' : 'Due'} {p.deadline}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-400 mb-0.5">{isZh ? '任务完成' : 'Tasks'}</p>
                  <p className="text-sm font-semibold text-gray-900">{p.tasks.done}/{p.tasks.total}</p>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{isZh ? '整体进度' : 'Progress'}</span>
                  <span>{p.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${p.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-1.5 flex-wrap">
                  {(isZh ? p.tags : p.tagsEn).map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Link href={`/${locale}/diagnosis/report/r001`}
                    className="text-xs text-blue-600 border border-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-50">
                    {isZh ? '查看报告' : 'View Report'}
                  </Link>
                  <Link href={`/${locale}/ai-chat`}
                    className="text-xs text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
                    {isZh ? '咨询AI' : 'Ask AI'}
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
