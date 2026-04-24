import Link from 'next/link'

export default async function EnterpriseCenterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isZh = locale === 'zh'

  const modules = [
    {
      href: '/enterprise-center/account',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
      label: isZh ? '账号与权限' : 'Account & Permissions',
      desc: isZh ? '管理团队成员、角色分配与数据访问权限' : 'Manage team members, role assignments and data access permissions',
      color: 'blue',
      badge: null,
    },
    {
      href: '/enterprise-center/project',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
      label: isZh ? '项目管理' : 'Project Management',
      desc: isZh ? '合规项目进度追踪、里程碑管理与任务协作' : 'Compliance project progress tracking, milestone management and task collaboration',
      color: 'green',
      badge: isZh ? '3个进行中' : '3 Active',
    },
    {
      href: '/enterprise-center/document',
      icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
      label: isZh ? '文档管理' : 'Document Management',
      desc: isZh ? '合规文件存储、版本控制与权限共享管理' : 'Compliance document storage, version control and permission-based sharing',
      color: 'purple',
      badge: isZh ? '12份文件' : '12 Docs',
    },
    {
      href: '/enterprise-center/message',
      icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
      label: isZh ? '消息中心' : 'Message Center',
      desc: isZh ? '系统通知、合规预警与专家沟通消息管理' : 'System notifications, compliance alerts and expert communication management',
      color: 'orange',
      badge: isZh ? '5条未读' : '5 Unread',
    },
  ]

  const colorMap: Record<string, { icon: string; badge: string }> = {
    blue: { icon: 'bg-blue-50 text-blue-600', badge: 'bg-blue-50 text-blue-700' },
    green: { icon: 'bg-green-50 text-green-600', badge: 'bg-green-50 text-green-700' },
    purple: { icon: 'bg-purple-50 text-purple-600', badge: 'bg-purple-50 text-purple-700' },
    orange: { icon: 'bg-orange-50 text-orange-600', badge: 'bg-orange-50 text-orange-700' },
  }

  const orgStats = [
    { label: isZh ? '团队成员' : 'Team Members', value: '8' },
    { label: isZh ? '活跃项目' : 'Active Projects', value: '3' },
    { label: isZh ? '合规文档' : 'Compliance Docs', value: '12' },
    { label: isZh ? '订阅套餐' : 'Subscription', value: isZh ? '企业版' : 'Enterprise' },
  ]

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{isZh ? '企业管理中心' : 'Enterprise Management Center'}</h1>
        <p className="text-gray-500 text-sm">{isZh ? '企业账号、团队协作与合规项目一体化管理' : 'Integrated management for enterprise accounts, team collaboration, and compliance projects'}</p>
      </div>

      {/* Org Overview */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            海
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{isZh ? '示例科技有限公司' : 'Example Tech Co., Ltd.'}</h2>
            <p className="text-xs text-gray-400">{isZh ? '企业版 · 有效期至2025年12月31日' : 'Enterprise Plan · Valid until Dec 31, 2025'}</p>
          </div>
          <span className="ml-auto text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-100">{isZh ? '正常使用中' : 'Active'}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {orgStats.map((s, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {modules.map(mod => {
          const c = colorMap[mod.color]
          return (
            <Link key={mod.href} href={`/${locale}${mod.href}`}
              className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.icon}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={mod.icon} />
                  </svg>
                </div>
                {mod.badge && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.badge}`}>{mod.badge}</span>
                )}
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{mod.label}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{mod.desc}</p>
            </Link>
          )
        })}
      </div>

      {/* Subscription CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-1">{isZh ? '升级到旗舰版，解锁更多功能' : 'Upgrade to Premium for More Features'}</h3>
            <p className="text-sm text-white/80">{isZh ? '多品牌管理、API集成、专属客户成功经理、无限存储空间' : 'Multi-brand management, API integration, dedicated CSM, unlimited storage'}</p>
          </div>
          <button className="shrink-0 ml-4 px-4 py-2 bg-white text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors">
            {isZh ? '了解方案' : 'Learn More'}
          </button>
        </div>
      </div>
    </div>
  )
}
