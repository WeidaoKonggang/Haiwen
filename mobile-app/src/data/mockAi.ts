import type { ConsultationResult, Language } from '../types';

type ResponseTemplate = {
  bullets: string[];
  whyThisMatters: string;
};

export const quickQuestions: Record<Language, string[]> = {
  en: [
    'What ESG updates should AI firms watch this week?',
    'Summarize key risks for entering Southeast Asia.',
    'What should an AI hardware company know about ESG disclosure?',
  ],
  zh: [
    '本周AI企业应关注哪些ESG更新？',
    '进入东南亚市场有哪些主要风险？',
    'AI硬件公司应如何准备ESG披露？',
  ],
};

const templates: Record<Language, Record<'weekly' | 'southeastAsia' | 'hardware' | 'general', ResponseTemplate>> = {
  en: {
    weekly: {
      bullets: [
        'Track AI governance rules where customers ask for model-risk documentation.',
        'Watch ESG disclosure timelines tied to climate, energy use, and supplier transparency.',
        'Prepare concise evidence for enterprise procurement teams before sales diligence.',
        'Separate public regulatory updates from customer-specific contract requirements.',
      ],
      whyThisMatters: 'Busy executives need an early signal on which ESG and globalization topics can delay deals this week.',
    },
    southeastAsia: {
      bullets: [
        'Treat Southeast Asia as separate country markets, not one compliance zone.',
        'Map data residency, cross-border transfer, and local hosting expectations before pilots.',
        'Check whether sector buyers require local partners or government-facing approvals.',
        'Keep ESG and responsible-AI claims consistent across investor, customer, and regulator materials.',
      ],
      whyThisMatters: 'Market entry risk is often created by late compliance discovery, not by product readiness.',
    },
    hardware: {
      bullets: [
        'Document energy efficiency, thermal performance, and expected lifecycle impact.',
        'Prepare supplier due-diligence notes for minerals, components, and manufacturing partners.',
        'Align ESG disclosure language with what enterprise procurement teams can verify.',
        'Keep claims modest unless engineering, operations, and legal teams can support them.',
      ],
      whyThisMatters: 'AI hardware companies face ESG questions earlier because compute intensity is visible to customers and investors.',
    },
    general: {
      bullets: [
        'Prioritize updates that can affect customer diligence, fundraising, or market entry timing.',
        'Create short internal briefs that name the owner, region, risk, and next action.',
        'Save complex regulation and case-law reading for the full website workflow.',
        'Use short briefs to keep leadership focused on the few changes that need a decision.',
      ],
      whyThisMatters: 'Executive attention is limited, so the app should turn broad ESG and globalization noise into quick next steps.',
    },
  },
  zh: {
    weekly: {
      bullets: [
        '跟踪客户正在询问的AI治理和模型风险材料。',
        '关注与气候、能耗和供应商透明度相关的ESG披露节点。',
        '为企业采购尽调准备一页式证据摘要。',
        '区分公开监管变化和客户合同中的专项要求。',
      ],
      whyThisMatters: '管理层需要尽早知道哪些ESG和全球化事项会影响本周交易推进。',
    },
    southeastAsia: {
      bullets: [
        '不要把东南亚当作单一合规市场，应按国家拆分。',
        '试点前先梳理数据驻留、跨境传输和本地托管要求。',
        '确认行业客户是否需要本地伙伴或政府相关审批。',
        '让ESG与负责任AI表述在投资人、客户和监管材料中保持一致。',
      ],
      whyThisMatters: '市场进入风险往往来自太晚发现合规差异，而不是产品本身不成熟。',
    },
    hardware: {
      bullets: [
        '记录能效、散热表现和硬件生命周期影响。',
        '准备矿产、组件和制造伙伴的供应商尽调说明。',
        '让ESG披露语言与企业采购能验证的证据一致。',
        '除非工程、运营和法务都能支持，否则避免过度承诺。',
      ],
      whyThisMatters: 'AI硬件企业会更早被问到ESG问题，因为算力能耗对客户和投资人都很直观。',
    },
    general: {
      bullets: [
        '优先关注会影响客户尽调、融资或市场进入节奏的变化。',
        '内部简报只保留负责人、地区、风险和下一步动作。',
        '完整法规和案例阅读留到网站端完成。',
        '用提醒机制把管理层注意力集中在少数需要决策的事项上。',
      ],
      whyThisMatters: '管理层注意力有限，轻量app应把复杂信息压缩成可执行的下一步。',
    },
  },
};

export function getMockConsultationResponse(
  question: string,
  now = new Date(),
  language: Language = 'en',
): ConsultationResult {
  const cleanedQuestion =
    question.trim() || (language === 'zh' ? '今天应关注哪些ESG与全球化动态？' : 'What ESG and globalization updates should we review?');
  const lowerQuestion = cleanedQuestion.toLowerCase();
  const template = templates[language][selectTemplate(lowerQuestion)];

  return {
    id: `consultation-${slugify(cleanedQuestion)}`,
    language,
    title: cleanedQuestion,
    question: cleanedQuestion,
    bullets: template.bullets,
    whyThisMatters: template.whyThisMatters,
    createdAt: formatDate(now),
  };
}

function selectTemplate(question: string): 'weekly' | 'southeastAsia' | 'hardware' | 'general' {
  if (question.includes('southeast asia') || question.includes('market entry') || question.includes('东南亚') || question.includes('市场')) {
    return 'southeastAsia';
  }

  if (question.includes('hardware') || question.includes('disclosure') || question.includes('硬件') || question.includes('披露')) {
    return 'hardware';
  }

  if (question.includes('this week') || question.includes('updates') || question.includes('本周') || question.includes('更新')) {
    return 'weekly';
  }

  return 'general';
}

export function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function slugify(value: string) {
  const asciiSlug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 72);

  if (asciiSlug) {
    return asciiSlug;
  }

  let hash = 0;
  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }

  return `zh-${hash.toString(16)}`;
}
