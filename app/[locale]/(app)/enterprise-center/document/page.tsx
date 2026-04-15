import Link from 'next/link'

const documents = [
  { id: 'd001', name: 'EU AI Act合规诊断报告', nameEn: 'EU AI Act Compliance Diagnosis Report', type: 'report', date: '2024-11-15', size: '2.4 MB', project: 'EU AI Act合规整改', projectEn: 'EU AI Act Remediation', tags: ['诊断', 'EU'], tagsEn: ['Diagnosis', 'EU'] },
  { id: 'd002', name: 'GDPR数据处理协议（DPA）模板', nameEn: 'GDPR Data Processing Agreement (DPA) Template', type: 'template', date: '2024-11-10', size: '156 KB', project: 'GDPR数据合规', projectEn: 'GDPR Compliance', tags: ['模板', 'GDPR'], tagsEn: ['Template', 'GDPR'] },
  { id: 'd003', name: 'ESG数据采集表（2024年度）', nameEn: 'ESG Data Collection Form (2024)', type: 'form', date: '2024-11-08', size: '89 KB', project: 'ESG 2024年报', projectEn: 'ESG 2024 Report', tags: ['ESG', '数据'], tagsEn: ['ESG', 'Data'] },
  { id: 'd004', name: '新加坡PDPA合规检查清单', nameEn: 'Singapore PDPA Compliance Checklist', type: 'checklist', date: '2024-10-20', size: '234 KB', project: '新加坡PDPA', projectEn: 'Singapore PDPA', tags: ['清单', '新加坡'], tagsEn: ['Checklist', 'Singapore'] },
  { id: 'd005', name: '隐私政策（GDPR版本）v2.1', nameEn: 'Privacy Policy (GDPR Version) v2.1', type: 'policy', date: '2024-10-15', size: '78 KB', project: 'GDPR数据合规', projectEn: 'GDPR Compliance', tags: ['政策', '隐私'], tagsEn: ['Policy', 'Privacy'] },
  { id: 'd006', name: 'AI风险评估报告（Q4 2024）', nameEn: 'AI Risk Assessment Report (Q4 2024)', type: 'report', date: '2024-10-01', size: '1.8 MB', project: 'EU AI Act合规整改', projectEn: 'EU AI Act Remediation', tags: ['风险', 'AI'], tagsEn: ['Risk', 'AI'] },
]

const typeConfig: Record<string, { label: string; labelEn: string; icon: string; color: string }> = {
  report: { label: '报告', labelEn: 'Report', icon: '📊', color: 'bg-blue-50 text-blue-700' },
  template: { label: '模板', labelEn: 'Template', icon: '📝', color: 'bg-green-50 text-green-700' },
  form: { label: '表格', labelEn: 'Form', icon: '📋', color: 'bg-purple-50 text-purple-700' },
  checklist: { label: '清单', labelEn: 'Checklist', icon: '✅', color: 'bg-orange-50 text-orange-700' },
  policy: { label: '政策文件', labelEn: 'Policy Doc', icon: '📜', color: 'bg-gray-100 text-gray-700' },
}

export default async function DocumentPage({ params }: { params: Promise<{ locale: string }> }) {
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
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{isZh ? '文档管理' : 'Document Management'}</h1>
          <p className="text-sm text-gray-500">{isZh ? '合规文件的集中存储、版本管理与团队共享' : 'Centralized compliance document storage, version control, and team sharing'}</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            {isZh ? '上传文件' : 'Upload File'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {Object.entries(typeConfig).map(([key, t]) => {
          const count = documents.filter(d => d.type === key).length
          return (
            <div key={key} className="bg-white rounded-2xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{t.icon}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${t.color}`}>{isZh ? t.label : t.labelEn}</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{count}</p>
            </div>
          )
        })}
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4 flex items-center gap-3 flex-wrap">
        <input type="text" placeholder={isZh ? '搜索文件名称...' : 'Search documents...'}
          className="flex-1 min-w-48 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        <select className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option>{isZh ? '全部类型' : 'All Types'}</option>
          {Object.entries(typeConfig).map(([key, t]) => (
            <option key={key} value={key}>{isZh ? t.label : t.labelEn}</option>
          ))}
        </select>
        <select className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option>{isZh ? '全部项目' : 'All Projects'}</option>
          <option>{isZh ? 'EU AI Act合规整改' : 'EU AI Act Remediation'}</option>
          <option>{isZh ? 'GDPR数据合规' : 'GDPR Compliance'}</option>
        </select>
      </div>

      {/* Document List */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {documents.map(doc => {
            const tc = typeConfig[doc.type]
            return (
              <div key={doc.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                <span className="text-2xl shrink-0">{tc.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-gray-900 truncate">{isZh ? doc.name : doc.nameEn}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${tc.color}`}>{isZh ? tc.label : tc.labelEn}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{isZh ? doc.project : doc.projectEn}</span>
                    <span>·</span>
                    <span>{doc.date}</span>
                    <span>·</span>
                    <span>{doc.size}</span>
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  {(isZh ? doc.tags : doc.tagsEn).map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full hidden sm:inline">{tag}</span>
                  ))}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button className="text-xs text-blue-600 hover:underline">{isZh ? '查看' : 'View'}</button>
                  <button className="text-xs text-gray-500 hover:underline">{isZh ? '下载' : 'Download'}</button>
                  <button className="text-xs text-gray-400 hover:underline">{isZh ? '分享' : 'Share'}</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
