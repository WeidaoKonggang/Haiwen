'use client'

import { useState, use } from 'react'
import Link from 'next/link'

const faqs = [
  {
    category: '快速开始',
    categoryEn: 'Getting Started',
    items: [
      { q: '如何开始使用海问平台？', qEn: 'How do I get started with HaiWen?', a: '注册账号后，建议先前往"合规诊断"模块，填写企业基本信息和目标市场，AI将为您生成初步的合规诊断报告，帮助您了解当前合规状况和优先处理事项。', aEn: 'After registering, we recommend visiting the Compliance Diagnosis module first. Fill in your company information and target markets, and AI will generate a preliminary compliance diagnosis report to help you understand your current compliance status and priorities.' },
      { q: '平台支持哪些目标出海市场？', qEn: 'Which target overseas markets does the platform support?', a: '目前支持欧盟（EU）、英国、美国、新加坡、日本、阿联酋、巴西、印度、澳大利亚、韩国等10个主要市场，并持续扩展覆盖范围。', aEn: 'Currently supports 10 major markets: EU, UK, US, Singapore, Japan, UAE, Brazil, India, Australia, and South Korea, with continuous expansion.' },
    ],
  },
  {
    category: '合规诊断',
    categoryEn: 'Compliance Diagnosis',
    items: [
      { q: 'AI合规诊断的准确性如何？', qEn: 'How accurate is the AI compliance diagnosis?', a: 'AI诊断基于最新的法规数据库和真实出海案例训练，准确率在行业专家验证下达到85%以上。建议将AI诊断结果与专业合规律师意见结合使用，以获得最高精度。', aEn: 'AI diagnosis is based on the latest regulatory database and real overseas case training, with accuracy validated by industry experts at over 85%. We recommend combining AI diagnosis results with professional compliance lawyer opinions for highest accuracy.' },
      { q: '诊断报告多久会更新一次？', qEn: 'How often are diagnosis reports updated?', a: '当目标市场出现重大政策变动时，系统会自动推送提醒，建议您及时重新评估合规状态。您也可以随时手动发起新的诊断。', aEn: 'The system automatically pushes notifications when major policy changes occur in target markets. We recommend reassessing compliance status promptly. You can also initiate a new diagnosis at any time.' },
    ],
  },
  {
    category: 'ESG管理',
    categoryEn: 'ESG Management',
    items: [
      { q: '平台支持哪些ESG报告标准？', qEn: 'Which ESG reporting standards does the platform support?', a: '目前支持GRI 2021、ISSB IFRS S1/S2、TCFD、SASB（科技行业）、EU CSRD/ESRS以及中国CASS-ESG评价体系，可同时适配多个标准。', aEn: 'Currently supports GRI 2021, ISSB IFRS S1/S2, TCFD, SASB (Tech sector), EU CSRD/ESRS, and China CASS-ESG, with simultaneous multi-standard adaptation.' },
      { q: 'ESG报告生成需要多长时间？', qEn: 'How long does ESG report generation take?', a: '在数据完整的情况下，AI通常在3-5分钟内完成报告生成。报告生成完成后，建议请专业ESG顾问进行审阅，以确保符合监管要求。', aEn: 'With complete data, AI typically generates reports within 3-5 minutes. After generation, we recommend having a professional ESG advisor review it to ensure regulatory compliance.' },
    ],
  },
  {
    category: '数据安全',
    categoryEn: 'Data Security',
    items: [
      { q: '企业数据如何保护？', qEn: 'How is enterprise data protected?', a: '我们采用银行级别的AES-256加密存储，数据在传输过程中使用TLS 1.3加密。企业数据彼此完全隔离，我们承诺不将企业数据用于AI模型训练。', aEn: 'We use bank-grade AES-256 encrypted storage, with TLS 1.3 encryption during data transmission. Enterprise data is completely isolated from each other, and we commit to never using enterprise data for AI model training.' },
      { q: '平台是否符合GDPR要求？', qEn: 'Is the platform GDPR compliant?', a: '是的，我们已完成GDPR合规认证，提供数据主体权利管理、数据处理协议（DPA）签署、数据删除等完整功能，支持企业的GDPR合规需求。', aEn: 'Yes, we have completed GDPR compliance certification and provide complete features including data subject rights management, data processing agreement (DPA) signing, and data deletion to support enterprise GDPR compliance needs.' },
    ],
  },
]

const guides = [
  { icon: '🚀', title: '5分钟快速入门', titleEn: '5-Minute Quick Start', desc: '从注册到完成第一次合规诊断的完整引导', descEn: 'Complete guide from registration to first compliance diagnosis', href: '#' },
  { icon: '📊', title: '合规诊断使用手册', titleEn: 'Compliance Diagnosis Manual', desc: '详解合规诊断流程与报告解读方法', descEn: 'Detailed compliance diagnosis process and report interpretation', href: '#' },
  { icon: '🌿', title: 'ESG数据采集指南', titleEn: 'ESG Data Collection Guide', desc: 'ESG指标定义、计算方法与填报要求', descEn: 'ESG indicator definitions, calculation methods, and reporting requirements', href: '#' },
  { icon: '🔒', title: '数据安全白皮书', titleEn: 'Data Security White Paper', desc: '平台安全架构与企业数据保护承诺', descEn: 'Platform security architecture and enterprise data protection commitments', href: '#' },
]

export default function HelpPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const isZh = locale === 'zh'
  const [openFaq, setOpenFaq] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{isZh ? '帮助中心' : 'Help Center'}</h1>
          <p className="text-gray-500 mb-6">{isZh ? '查找使用指南、常见问题与联系支持' : 'Find usage guides, FAQs, and contact support'}</p>
          <div className="relative max-w-md mx-auto">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder={isZh ? '搜索帮助文章...' : 'Search help articles...'}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Quick Guides */}
        <div className="mb-10">
          <h2 className="text-base font-semibold text-gray-900 mb-4">{isZh ? '使用指南' : 'Usage Guides'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {guides.map((g, i) => (
              <a key={i} href={g.href}
                className="bg-white rounded-2xl border border-gray-200 p-5 flex items-start gap-3 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer">
                <span className="text-2xl shrink-0">{g.icon}</span>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{isZh ? g.title : g.titleEn}</h3>
                  <p className="text-xs text-gray-500">{isZh ? g.desc : g.descEn}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-10">
          <h2 className="text-base font-semibold text-gray-900 mb-4">{isZh ? '常见问题' : 'Frequently Asked Questions'}</h2>
          <div className="space-y-4">
            {faqs.map((cat) => (
              <div key={cat.category} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700">{isZh ? cat.category : cat.categoryEn}</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {cat.items.map((item, i) => {
                    const key = `${cat.category}-${i}`
                    const open = openFaq === key
                    return (
                      <div key={i}>
                        <button onClick={() => setOpenFaq(open ? null : key)}
                          className="w-full text-left flex items-start justify-between gap-3 px-5 py-4 hover:bg-gray-50 transition-colors">
                          <span className="text-sm text-gray-800 font-medium">{isZh ? item.q : item.qEn}</span>
                          <svg className={`w-4 h-4 text-gray-400 shrink-0 mt-0.5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {open && (
                          <div className="px-5 pb-4">
                            <p className="text-sm text-gray-600 leading-relaxed">{isZh ? item.a : item.aEn}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">{isZh ? '仍需帮助？联系我们' : 'Still Need Help? Contact Us'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: '💬', label: isZh ? '在线客服' : 'Live Chat', desc: isZh ? '工作日 9:00–18:00' : 'Weekdays 9:00–18:00', action: isZh ? '开始对话' : 'Start Chat', href: `/${locale}/ai-chat` },
              { icon: '📧', label: isZh ? '邮件支持' : 'Email Support', desc: 'support@haiwenai.com', action: isZh ? '发送邮件' : 'Send Email', href: 'mailto:support@haiwenai.com' },
              { icon: '👤', label: isZh ? '预约专家' : 'Book Expert', desc: isZh ? '1对1专业咨询服务' : '1-on-1 professional consultation', action: isZh ? '预约咨询' : 'Book Now', href: `/${locale}/expert-hall` },
            ].map((c, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 text-center">
                <span className="text-2xl block mb-2">{c.icon}</span>
                <p className="text-sm font-semibold text-gray-900 mb-0.5">{c.label}</p>
                <p className="text-xs text-gray-400 mb-3">{c.desc}</p>
                <Link href={c.href}
                  className="inline-block px-4 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-medium hover:bg-blue-700">
                  {c.action}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
