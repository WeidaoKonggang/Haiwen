'use client'

import { useState, use } from 'react'
import Link from 'next/link'

const messages = [
  { id: 'm001', type: 'alert', title: 'EU AI Act高风险AI系统合规要求临近', titleEn: 'EU AI Act High-Risk AI System Requirements Approaching', body: 'EU AI Act高风险AI系统合规要求将于2025年8月正式生效，距今还有约8个月时间，建议尽快启动合规整改工作。', bodyEn: 'EU AI Act high-risk AI system requirements take effect August 2025, approximately 8 months away. Remediation should begin immediately.', time: '2024-12-01 09:00', read: false, category: 'compliance' },
  { id: 'm002', type: 'system', title: '合规诊断报告已生成完毕', titleEn: 'Compliance Diagnosis Report Generated', body: '您于2024-11-15发起的EU AI Act综合合规诊断已完成，可前往查看报告详情。', bodyEn: 'Your EU AI Act comprehensive compliance diagnosis initiated on 2024-11-15 is complete. View the report for details.', time: '2024-11-15 14:35', read: false, category: 'system' },
  { id: 'm003', type: 'expert', title: '专家回复：ESG评级提升咨询', titleEn: 'Expert Reply: ESG Rating Improvement Consultation', body: '您好，关于您提出的MSCI ESG评级提升方案，我已根据您的企业情况整理了具体建议，请查阅附件内容。', bodyEn: 'Regarding the MSCI ESG rating improvement plan you requested, I have prepared specific recommendations based on your company profile. Please review the attached content.', time: '2024-11-12 16:20', read: true, category: 'expert' },
  { id: 'm004', type: 'alert', title: '新加坡PDPA修订草案发布', titleEn: 'Singapore PDPA Amendment Draft Published', body: '新加坡个人数据保护委员会（PDPC）于2024-11-10发布了PDPA修订草案，涉及AI使用场景下的数据处理要求，建议关注。', bodyEn: 'Singapore PDPC published a PDPA amendment draft on 2024-11-10 regarding data processing requirements in AI use cases. Worth monitoring.', time: '2024-11-10 10:00', read: true, category: 'compliance' },
  { id: 'm005', type: 'system', title: 'ESG数据报告已提交成功', titleEn: 'ESG Data Report Submitted Successfully', body: '2024年Q3 ESG数据已成功提交，系统将在48小时内完成数据验证并更新评分。', bodyEn: '2024 Q3 ESG data submitted successfully. The system will complete data validation and update scores within 48 hours.', time: '2024-11-08 15:00', read: true, category: 'system' },
]

const typeConfig: Record<string, { icon: string; color: string; label: string; labelEn: string }> = {
  alert: { icon: '⚠️', color: 'border-l-orange-400', label: '合规预警', labelEn: 'Compliance Alert' },
  system: { icon: '🔔', color: 'border-l-blue-400', label: '系统通知', labelEn: 'System Notice' },
  expert: { icon: '👤', color: 'border-l-purple-400', label: '专家消息', labelEn: 'Expert Message' },
}

export default function MessagePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const isZh = locale === 'zh'

  const [filter, setFilter] = useState('all')
  const [readState, setReadState] = useState<Record<string, boolean>>({})

  const filtered = messages.filter(m => {
    if (filter === 'unread') return !m.read && !readState[m.id]
    if (filter !== 'all') return m.category === filter
    return true
  })

  const unreadCount = messages.filter(m => !m.read && !readState[m.id]).length

  const markRead = (id: string) => setReadState(prev => ({ ...prev, [id]: true }))

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href={`/${locale}/enterprise-center`} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            {isZh ? '返回企业中心' : 'Back to Enterprise Center'}
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">{isZh ? '消息中心' : 'Message Center'}</h1>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{unreadCount}</span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">{isZh ? '合规预警、系统通知与专家沟通消息' : 'Compliance alerts, system notifications and expert communications'}</p>
        </div>
        <button className="text-sm text-blue-600 hover:underline">
          {isZh ? '全部标为已读' : 'Mark All Read'}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[
          { id: 'all', label: '全部', labelEn: 'All' },
          { id: 'unread', label: '未读', labelEn: 'Unread' },
          { id: 'compliance', label: '合规预警', labelEn: 'Alerts' },
          { id: 'system', label: '系统通知', labelEn: 'System' },
          { id: 'expert', label: '专家消息', labelEn: 'Expert' },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${filter === f.id ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {isZh ? f.label : f.labelEn}
          </button>
        ))}
      </div>

      {/* Message List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-400">
            <p className="text-sm">{isZh ? '暂无消息' : 'No messages'}</p>
          </div>
        ) : (
          filtered.map(msg => {
            const tc = typeConfig[msg.type]
            const isRead = msg.read || readState[msg.id]
            return (
              <div key={msg.id}
                onClick={() => markRead(msg.id)}
                className={`bg-white rounded-2xl border border-l-4 ${tc.color} p-5 cursor-pointer hover:shadow-sm transition-all ${!isRead ? 'border-gray-200 shadow-sm' : 'border-gray-100 opacity-80'}`}>
                <div className="flex items-start gap-3">
                  <span className="text-xl shrink-0">{tc.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`text-sm font-semibold ${isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                          {isZh ? msg.title : msg.titleEn}
                        </h3>
                        {!isRead && <span className="w-2 h-2 bg-red-500 rounded-full shrink-0" />}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${msg.type === 'alert' ? 'bg-orange-50 text-orange-600' : msg.type === 'expert' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                          {isZh ? tc.label : tc.labelEn}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 shrink-0">{msg.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{isZh ? msg.body : msg.bodyEn}</p>
                    {msg.type === 'alert' && (
                      <div className="mt-2 flex gap-2">
                        <Link href={`/${locale}/risk-assessment`} className="text-xs text-orange-600 border border-orange-200 px-3 py-1 rounded-lg hover:bg-orange-50">
                          {isZh ? '查看风险详情' : 'View Risk Details'}
                        </Link>
                        <Link href={`/${locale}/ai-chat`} className="text-xs text-gray-500 border border-gray-200 px-3 py-1 rounded-lg hover:bg-gray-50">
                          {isZh ? '咨询AI' : 'Ask AI'}
                        </Link>
                      </div>
                    )}
                    {msg.type === 'system' && msg.id === 'm002' && (
                      <Link href={`/${locale}/diagnosis/report/r001`} className="mt-2 inline-block text-xs text-blue-600 border border-blue-200 px-3 py-1 rounded-lg hover:bg-blue-50">
                        {isZh ? '查看报告' : 'View Report'}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
