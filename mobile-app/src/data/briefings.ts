import type { BriefingItem } from '../types';
import { getJuheBriefings } from '../services/juheNews';
import { WEBSITE_URL } from './website';

function briefingUrl(id: string) {
  return `${WEBSITE_URL}/briefings/${id}`;
}

const baseMockBriefings: BriefingItem[] = [
  {
    id: 'eu-ai-act-esg-reporting',
    source: 'mock',
    url: briefingUrl('eu-ai-act-esg-reporting'),
    title: {
      en: 'EU buyers merge AI governance and ESG checks',
      zh: '欧盟买家正在合并AI治理与ESG审查',
    },
    region: 'EU',
    category: 'AI Governance',
    summary: {
      en: 'Procurement teams want model oversight, energy use, and human review evidence in one pack.',
      zh: '采购团队希望在一套材料中看到模型监督、能耗和人工审核证据。',
    },
    whyThisMatters: {
      en: 'A single evidence pack can shorten enterprise sales diligence.',
      zh: '一套清晰证据包能缩短企业客户的销售尽调时间。',
    },
    transcript: {
      en: 'EU buyers are combining AI governance and ESG checks. Prepare oversight, energy, and supplier evidence before diligence starts.',
      zh: '欧盟买家正在合并AI治理与ESG审查。尽调开始前，请准备好模型监督、能耗和供应商证据。',
    },
  },
  {
    id: 'singapore-sustainability-disclosure',
    source: 'mock',
    url: briefingUrl('singapore-sustainability-disclosure'),
    title: {
      en: 'Singapore makes ESG reporting more practical',
      zh: '新加坡让成长型企业ESG报告更可执行',
    },
    region: 'Singapore',
    category: 'ESG Disclosure',
    summary: {
      en: 'New guidance favors phased climate and sustainability disclosure for regional growth companies.',
      zh: '新指引更强调分阶段完成气候与可持续披露。',
    },
    whyThisMatters: {
      en: 'Singapore is a common regional hub, so early readiness helps investors and partners move faster.',
      zh: '新加坡常作为区域总部，提前准备能降低投资人与伙伴沟通摩擦。',
    },
    transcript: {
      en: 'Singapore is making ESG reporting more practical. Map emissions, owners, and customer-facing claims early.',
      zh: '新加坡正在让ESG报告更可执行。请尽早梳理排放、负责人和面向客户的披露说法。',
    },
  },
  {
    id: 'china-green-computing-supply-chain',
    source: 'mock',
    url: briefingUrl('china-green-computing-supply-chain'),
    title: {
      en: 'China AI infrastructure faces green-compute questions',
      zh: '中国AI基础设施面临绿色算力提问',
    },
    region: 'China',
    category: 'Sustainability Reporting',
    summary: {
      en: 'Enterprise customers ask data center and hardware partners for efficiency and lifecycle proof.',
      zh: '大型客户开始要求数据中心和硬件伙伴提供能效与生命周期证明。',
    },
    whyThisMatters: {
      en: 'Sustainability documentation can become a procurement advantage.',
      zh: '可持续材料可以从后期阻碍变成采购优势。',
    },
    transcript: {
      en: 'AI infrastructure providers should document efficiency, lifecycle plans, and supplier controls before procurement talks.',
      zh: 'AI基础设施企业应在采购沟通前准备能效、生命周期和供应商管控材料。',
    },
  },
  {
    id: 'sea-data-compliance-market-entry',
    source: 'mock',
    url: briefingUrl('sea-data-compliance-market-entry'),
    title: {
      en: 'SEA entry needs country-level data playbooks',
      zh: '进入东南亚需要按国家拆分数据方案',
    },
    region: 'Southeast Asia',
    category: 'Market Entry',
    summary: {
      en: 'Teams are checking data flows, hosting expectations, and sector procurement rules.',
      zh: '出海团队正在核查数据流、托管要求和行业采购规则。',
    },
    whyThisMatters: {
      en: 'Country checklists prevent expansion teams from treating the region as one market.',
      zh: '国家级清单能避免把东南亚误当作单一合规市场。',
    },
    transcript: {
      en: 'Separate data flow, hosting, reseller, and sector rules by country before committing sales timelines.',
      zh: '承诺销售时间表前，请按国家拆分数据流、托管、经销和行业规则。',
    },
  },
  {
    id: 'us-ai-procurement-risk',
    source: 'mock',
    url: briefingUrl('us-ai-procurement-risk'),
    title: {
      en: 'US buyers tighten AI vendor risk reviews',
      zh: '美国企业买家收紧AI供应商风险审查',
    },
    region: 'United States',
    category: 'Data Compliance',
    summary: {
      en: 'Procurement asks sharper questions on data handling, auditability, security, and sustainability.',
      zh: '采购团队更关注数据处理、可审计性、安全控制和可持续承诺。',
    },
    whyThisMatters: {
      en: 'Short answers help pilots convert into paid contracts.',
      zh: '简明回答有助于试点项目转化为正式合同。',
    },
    transcript: {
      en: 'Prepare data handling, audit logs, security controls, and sustainability commitments before pilots expand.',
      zh: '试点扩大前，请准备数据处理、审计日志、安全控制和可持续承诺。',
    },
  },
];

export const MIN_BRIEFING_COUNT = 8;

export const mockBriefings: BriefingItem[] = [
  ...baseMockBriefings,
  ...baseMockBriefings.map((briefing, index) => ({
    ...briefing,
    id: `${briefing.id}-archive-${index + 1}`,
    url: briefingUrl(`${briefing.id}-archive-${index + 1}`),
    title: {
      en: `Archive signal: ${briefing.title.en}`,
      zh: `延伸关注：${briefing.title.zh}`,
    },
    summary: {
      en: `Earlier signal for demo continuity. ${briefing.summary.en}`,
      zh: `用于演示补充的历史信号。${briefing.summary.zh}`,
    },
    transcript: {
      en: `Archive signal. ${briefing.transcript.en}`,
      zh: `延伸关注。${briefing.transcript.zh}`,
    },
  })),
];

type GetBriefingsOptions = {
  loadLiveBriefings?: () => Promise<BriefingItem[]>;
};

export async function getBriefings(options: GetBriefingsOptions = {}): Promise<BriefingItem[]> {
  const loadLiveBriefings = options.loadLiveBriefings ?? getJuheBriefings;

  try {
    const liveBriefings = await loadLiveBriefings();

    if (liveBriefings.length > 0) {
      return fillBriefingsToMinimum(liveBriefings);
    }
  } catch (error) {
    console.warn('Live briefing feed unavailable; using mock briefings.', error);
  }

  return mockBriefings.slice(0, MIN_BRIEFING_COUNT);
}

function fillBriefingsToMinimum(liveBriefings: BriefingItem[]) {
  const seen = new Set<string>();
  const combined = [...liveBriefings, ...mockBriefings].filter((briefing) => {
    if (seen.has(briefing.id)) {
      return false;
    }

    seen.add(briefing.id);
    return true;
  });

  return combined.slice(0, MIN_BRIEFING_COUNT);
}
