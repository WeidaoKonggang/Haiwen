import Link from 'next/link'

const members = [
  { name: '张伟', nameEn: 'Zhang Wei', email: 'zhang.wei@example.com', role: 'admin', roleEn: 'Admin', dept: '合规部', deptEn: 'Compliance', status: 'active', avatar: '张' },
  { name: '李梅', nameEn: 'Li Mei', email: 'li.mei@example.com', role: 'editor', roleEn: 'Editor', dept: '法务部', deptEn: 'Legal', status: 'active', avatar: '李' },
  { name: '王刚', nameEn: 'Wang Gang', email: 'wang.gang@example.com', role: 'viewer', roleEn: 'Viewer', dept: 'ESG部门', deptEn: 'ESG Dept', status: 'active', avatar: '王' },
  { name: '陈静', nameEn: 'Chen Jing', email: 'chen.jing@example.com', role: 'editor', roleEn: 'Editor', dept: '战略部', deptEn: 'Strategy', status: 'inactive', avatar: '陈' },
]

const roleConfig: Record<string, { bg: string; text: string; label: string; labelEn: string; perms: string[]; permsEn: string[] }> = {
  admin: {
    bg: 'bg-purple-50', text: 'text-purple-700',
    label: '管理员', labelEn: 'Admin',
    perms: ['所有功能', '团队管理', '账单管理', '数据导出'],
    permsEn: ['All features', 'Team management', 'Billing', 'Data export'],
  },
  editor: {
    bg: 'bg-blue-50', text: 'text-blue-700',
    label: '编辑员', labelEn: 'Editor',
    perms: ['数据采集', '诊断报告', 'ESG管理', 'AI咨询'],
    permsEn: ['Data collection', 'Diagnosis', 'ESG management', 'AI chat'],
  },
  viewer: {
    bg: 'bg-gray-100', text: 'text-gray-600',
    label: '查看员', labelEn: 'Viewer',
    perms: ['仅查看报告', '数据查阅'],
    permsEn: ['View reports only', 'Data reading'],
  },
}

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isZh = locale === 'zh'

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href={`/${locale}/enterprise-center`} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            {isZh ? '返回企业中心' : 'Back to Enterprise Center'}
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{isZh ? '账号与权限管理' : 'Account & Permissions'}</h1>
          <p className="text-sm text-gray-500">{isZh ? '管理团队成员、角色与数据访问权限' : 'Manage team members, roles, and data access permissions'}</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
          {isZh ? '+ 邀请成员' : '+ Invite Member'}
        </button>
      </div>

      {/* Role Definitions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {Object.entries(roleConfig).map(([key, role]) => (
          <div key={key} className={`rounded-2xl border p-4 ${role.bg}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${role.bg} ${role.text} border`}>{isZh ? role.label : role.labelEn}</span>
            </div>
            <div className="space-y-1">
              {(isZh ? role.perms : role.permsEn).map((p, i) => (
                <p key={i} className={`text-xs ${role.text}`}>· {p}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">{isZh ? `团队成员（${members.length}人）` : `Team Members (${members.length})`}</h2>
          <input type="text" placeholder={isZh ? '搜索成员' : 'Search members'}
            className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-40" />
        </div>
        <div className="divide-y divide-gray-50">
          {members.map((m, i) => {
            const rc = roleConfig[m.role]
            return (
              <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                  {m.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{isZh ? m.name : m.nameEn}</p>
                  <p className="text-xs text-gray-400">{m.email}</p>
                </div>
                <span className="text-xs text-gray-500 hidden sm:block">{isZh ? m.dept : m.deptEn}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rc.bg} ${rc.text}`}>
                  {isZh ? rc.label : rc.labelEn}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${m.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {m.status === 'active' ? (isZh ? '活跃' : 'Active') : (isZh ? '停用' : 'Inactive')}
                </span>
                <div className="flex gap-2">
                  <button className="text-xs text-blue-600 hover:underline">{isZh ? '编辑' : 'Edit'}</button>
                  <button className="text-xs text-red-400 hover:underline">{isZh ? '移除' : 'Remove'}</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mt-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">{isZh ? 'API访问密钥' : 'API Access Keys'}</h2>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="text-sm font-medium text-gray-700">{isZh ? '生产环境密钥' : 'Production API Key'}</p>
            <p className="text-xs text-gray-400 font-mono mt-0.5">hq_live_••••••••••••••••2a8f</p>
          </div>
          <div className="flex gap-2">
            <button className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100">{isZh ? '复制' : 'Copy'}</button>
            <button className="text-xs px-3 py-1.5 border border-red-200 rounded-lg text-red-500 hover:bg-red-50">{isZh ? '重置' : 'Reset'}</button>
          </div>
        </div>
        <button className="mt-3 text-sm text-blue-600 hover:underline">+ {isZh ? '创建新密钥' : 'Create New Key'}</button>
      </div>
    </div>
  )
}
