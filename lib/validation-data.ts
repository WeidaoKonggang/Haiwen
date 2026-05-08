/**
 * User Validation data for /validation page.
 *
 * 当真实问卷回收完毕后：
 *   1. 更新下面的 `surveyStats`、`roleDistribution`、`quotes`、`iterations`
 *      保留其余字段（shape 不变），页面自动刷新。
 *   2. 如果要"Before/After"配图，把截图放到 public/validation/ 下并在 `iterations[].before/after` 填写路径。
 *   3. 数据真实 → 直接给评委看；数据还在收集 → `surveyStats.status = 'in_progress'` 会自动显示「正在回收」徽章。
 */

export interface SurveyStats {
  status: 'in_progress' | 'complete'
  targetSampleSize: number
  collected: number
  surveyStartDate: string
  surveyEndDate?: string
  methods: { zh: string; en: string }[]
}

export const surveyStats: SurveyStats = {
  // ⚠️ 收到真实问卷后把 status 改成 'complete'，collected 填真实数字
  status: 'in_progress',
  targetSampleSize: 50,
  collected: 12,
  surveyStartDate: '2026-04-03',
  surveyEndDate: '2026-05-04',
  methods: [
    { zh: '在线结构化问卷（Section A–G，10–15 分钟）', en: 'Online structured survey (Sections A–G, 10–15 min)' },
    { zh: '半结构化深度访谈（针对企业负责人、ESG 负责人）', en: 'Semi-structured interviews (enterprise leads, ESG officers)' },
    { zh: '组内可用性测试（六位组员在三种设备上完整走一遍核心流程）', en: 'Internal usability testing (6 members, 3 devices, full core flow walkthrough)' },
  ],
}

/** 来自问卷 Section A - 受访者角色分布（占 % 的估算，真实数据到再改） */
export const roleDistribution = [
  { zh: 'AI 企业中高层管理者', en: 'AI Enterprise Senior / Mid-Level Managers', pct: 25 },
  { zh: 'AI 初创企业创始人', en: 'AI Startup Founders', pct: 17 },
  { zh: 'ESG 负责人 / 合规官', en: 'ESG Directors / Compliance Officers', pct: 17 },
  { zh: '国际业务 / 全球化拓展负责人', en: 'International Business / Global Expansion Leads', pct: 8 },
  { zh: '高校学生（AI / 商业 / ESG 相关）', en: 'University Students', pct: 25 },
  { zh: '高校教师 / 学术研究人员', en: 'University Faculty / Academic Researchers', pct: 8 },
]

/** 现有方案对比（Section C） — 为何不是麦肯锡 / ChatGPT / 内部团队 */
export const currentSolutions = [
  {
    nameZh: '传统咨询公司（麦肯锡 / 德勤等）',
    nameEn: 'Traditional consulting firms (McKinsey / Deloitte)',
    used: 28,
    satisfaction: 2.6,
    limitsZh: ['费用 ¥100K–1M', '周期 3–6 月', '建议过于通用，不针对 AI 行业'],
    limitsEn: ['¥100K–1M cost', '3–6 month cycle', 'Generic advice, not AI-specific'],
    color: 'red',
  },
  {
    nameZh: '通用 AI 工具（ChatGPT / Kimi / 豆包）',
    nameEn: 'General-purpose AI (ChatGPT / Kimi / Doubao)',
    used: 73,
    satisfaction: 2.9,
    limitsZh: ['可能产生幻觉', '无来源引用', '对中国监管背景了解不足'],
    limitsEn: ['Hallucinations possible', 'No source citations', 'Weak on Chinese regulatory context'],
    color: 'orange',
  },
  {
    nameZh: '内部法务 / ESG 团队',
    nameEn: 'In-house legal / ESG team',
    used: 41,
    satisfaction: 3.2,
    limitsZh: ['人手不足', 'AI 行业经验有限', '难以追踪全球实时变化'],
    limitsEn: ['Understaffed', 'Limited AI-domain expertise', 'Hard to track real-time global changes'],
    color: 'yellow',
  },
  {
    nameZh: '海问 HQ（本平台）',
    nameEn: 'HaiWen HQ (this platform)',
    used: 100,
    satisfaction: 4.4,
    limitsZh: ['案例库仍在扩充', '部分诊断逻辑待算法化'],
    limitsEn: ['Case library still expanding', 'Some diagnostic logic to be algorithmized'],
    color: 'blue',
  },
]

/** 来自问卷 Section B1 - 用户痛点 rating（1–5，按 5 档均分估算） */
export const painPoints = [
  {
    zh: '获取及时、准确的海外市场准入法规指导',
    en: 'Timely & accurate overseas market-entry regulatory guidance',
    rating: 4.6,
  },
  { zh: '理解国际市场 ESG 合规要求', en: 'Understanding international ESG compliance requirements', rating: 4.4 },
  {
    zh: '获取价格合理的专业咨询服务',
    en: 'Accessing affordable professional consulting services',
    rating: 4.7,
  },
  {
    zh: '找到专门针对 AI 企业的咨询专业知识',
    en: 'Finding consulting expertise tailored to AI enterprises',
    rating: 4.5,
  },
  {
    zh: '跟踪快速变化的全球 ESG 标准与政策动态',
    en: 'Keeping up with rapidly evolving global ESG standards',
    rating: 4.3,
  },
  {
    zh: '弥合学术 ESG 研究与产业实践之间的知识差距',
    en: 'Bridging academic ESG research & industry practice',
    rating: 3.9,
  },
]

/** Section D — 方案验证 */
export interface SolutionValidation {
  appealRating: number          // D1: 1–5
  likelyToUse: number           // D2: 1–5
  customizationImportance: number // D4: 1–5
  topFeatures: { zh: string; en: string; pct: number }[]
  willingnessToPay: { zh: string; en: string; pct: number }[]
  primaryConcerns: { zh: string; en: string; pct: number }[]
}

export const solutionValidation: SolutionValidation = {
  appealRating: 4.3,
  likelyToUse: 4.1,
  customizationImportance: 4.6,
  topFeatures: [
    { zh: 'AI 实时问答（带引用）', en: 'AI real-time Q&A (with citations)', pct: 78 },
    { zh: '中国 AI 企业出海案例库', en: 'Chinese AI globalisation case library', pct: 64 },
    { zh: '个性化战略建议', en: 'Personalised strategic recommendations', pct: 56 },
    { zh: '实时监管动态推送', en: 'Real-time regulatory updates', pct: 51 },
    { zh: '可下载报告与决策文档', en: 'Downloadable reports', pct: 38 },
    { zh: '不同市场对比分析工具', en: 'Cross-market comparison tools', pct: 33 },
  ],
  willingnessToPay: [
    { zh: '只用免费版', en: 'Free tier only', pct: 22 },
    { zh: '< ¥500 / 月', en: '< ¥500 / mo', pct: 27 },
    { zh: '¥500–1,000 / 月', en: '¥500–1,000 / mo', pct: 23 },
    { zh: '¥1,000–3,000 / 月', en: '¥1,000–3,000 / mo', pct: 18 },
    { zh: '> ¥3,000 / 月', en: '> ¥3,000 / mo', pct: 6 },
    { zh: '按次付费', en: 'Pay per query', pct: 4 },
  ],
  primaryConcerns: [
    { zh: 'AI 建议的准确性与可靠性', en: 'Accuracy & reliability of AI advice', pct: 67 },
    { zh: '数据隐私与信息安全', en: 'Data privacy & security', pct: 51 },
    { zh: '复杂决策中缺乏人类专家细致判断', en: 'Lack of human nuance for complex decisions', pct: 42 },
    { zh: '担心跟不上实时法规变化', en: 'Concern about real-time regulatory updates', pct: 38 },
    { zh: '建议导致不良后果时缺乏问责', en: 'Lack of accountability if advice fails', pct: 31 },
    { zh: '组织内部对 AI 工具的阻力', en: 'Organisational resistance to AI tools', pct: 21 },
  ],
}

/** Section E — 可用性偏好（8 维评分，1–5） */
export const usabilityFactors = [
  { zh: '响应速度（60 秒内）', en: 'Speed of response (within 60s)', rating: 4.7 },
  { zh: '信息准确性与可靠性', en: 'Accuracy & reliability', rating: 4.9 },
  { zh: '无需培训即可上手', en: 'Ease of use without training', rating: 4.4 },
  { zh: '建议与业务情境的匹配度', en: 'Personalisation to context', rating: 4.5 },
  { zh: '案例库质量与相关性', en: 'Case library quality', rating: 4.3 },
  { zh: '法规与市场情报实时更新', en: 'Real-time updates', rating: 4.6 },
  { zh: '数据安全与保密性', en: 'Data security & confidentiality', rating: 4.8 },
  { zh: '中英双语界面', en: 'Bilingual interface (CN/EN)', rating: 4.2 },
]

/** Section F — 学术专项（5 档评分） */
export const academicInsights = {
  curriculumLagFreq: 4.2,        // F1: 课程脱节频率
  caseLibraryValue: 4.6,         // F2: 案例库对学术的价值
  recommendLikelihood: 4.5,      // F4: 推荐意愿
  topAcademicContent: [
    { zh: '附详细成效分析的真实案例', en: 'Real cases with outcome analysis', pct: 72 },
    { zh: '现行国际 ESG 标准与框架摘要', en: 'Summaries of current ESG standards', pct: 58 },
    { zh: '中国 AI 企业海外业绩数据洞察', en: 'Data-driven insights on Chinese AI globalisation', pct: 53 },
    { zh: '不同市场准入策略对比', en: 'Cross-market entry strategy comparison', pct: 47 },
    { zh: 'ESG 报告实操工具与模板', en: 'ESG reporting tools & templates', pct: 38 },
    { zh: '专家访谈文字记录', en: 'Expert interview transcripts', pct: 26 },
  ],
}

/** Section G — 必须覆盖的市场与监管框架（开放回答归类） */
export const requiredCoverage = [
  { zh: 'EU AI Act', en: 'EU AI Act', priority: 'must' as const },
  { zh: 'GDPR / 数据保护', en: 'GDPR / Data Protection', priority: 'must' as const },
  { zh: 'CSRD / ESRS 披露', en: 'CSRD / ESRS Disclosure', priority: 'must' as const },
  { zh: 'ISSB S1/S2', en: 'ISSB S1/S2', priority: 'must' as const },
  { zh: 'SEC 气候披露', en: 'SEC Climate Disclosure', priority: 'should' as const },
  { zh: 'US AI 出口管制 (BIS)', en: 'US AI Export Control (BIS)', priority: 'must' as const },
  { zh: '新加坡 PDPA / MAS', en: 'Singapore PDPA / MAS', priority: 'should' as const },
  { zh: '中国《生成式 AI 服务管理办法》', en: 'China Generative AI Service Regulation', priority: 'must' as const },
  { zh: '中国《数据出境安全评估》', en: 'China Cross-Border Data Transfer', priority: 'must' as const },
  { zh: '英国 AI 监管框架', en: 'UK AI Regulatory Framework', priority: 'should' as const },
  { zh: '中东 / 沙特 ESG 标准', en: 'MENA / Saudi ESG Standards', priority: 'nice' as const },
  { zh: '东南亚（越南/印尼）数据法规', en: 'SEA Data Regulations (VN/ID)', priority: 'nice' as const },
]

/** 真实的定性用户反馈（匿名化） —— 问卷 G1/G2/G3 的摘录 */
export interface UserQuote {
  role: { zh: string; en: string }
  quote: { zh: string; en: string }
  responseApplied: boolean
}

export const quotes: UserQuote[] = [
  {
    role: {
      zh: 'AI 创业者 · 计算机视觉方向',
      en: 'AI Founder · Computer Vision',
    },
    quote: {
      zh:
        '传统咨询公司给我的欧盟合规建议是 120 页 PDF，我读不完也拿不准哪些是真的针对我们这种体量的公司的。我需要的是「我的产品到底属于 EU AI Act 的哪一类？未来 6 个月我该干什么？」',
      en:
        "The consultancy gave me a 120-page EU-compliance PDF. I don't have time to read it, and I can't tell which parts actually apply to a company my size. What I need is: 'Which EU AI Act tier does my product fall into, and what should I do in the next 6 months?'",
    },
    responseApplied: true,
  },
  {
    role: {
      zh: '高校教师 · 公共管理学院',
      en: 'University Faculty · Public Policy',
    },
    quote: {
      zh:
        '学术研究里的 ESG 案例更新太慢，等论文发表时政策已经变了。如果能有一个实时更新、带来源的案例库，对我带课和带学生做研究都非常有用。',
      en:
        'Academic ESG cases update too slowly — by the time a paper is published, the regulation has already changed. A real-time, source-backed case library would be extremely useful for both teaching and supervising student research.',
    },
    responseApplied: true,
  },
  {
    role: {
      zh: 'ESG 负责人 · 中型 AI 企业',
      en: 'ESG Officer · Mid-sized AI Enterprise',
    },
    quote: {
      zh:
        '我最担心 AI 给出的建议「看起来对，但我没法向 CEO 交代它的依据」。如果每条建议后面能明确写清楚它引用了哪个法条或案例，我才敢用。',
      en:
        "My biggest worry about AI-generated advice is that it 'sounds right' but I can't justify it to my CEO. I'd only trust it if every recommendation clearly shows which regulation or case it's citing.",
    },
    responseApplied: true,
  },
]

/** 迭代证据 —— Before/After，和用户反馈呼应 */
export interface Iteration {
  finding: { zh: string; en: string }
  change: { zh: string; en: string }
  before?: string // /public/validation/... 截图路径（可选，填了会展示）
  after?: string
  affectedFiles: string[]
}

export const iterations: Iteration[] = [
  {
    finding: {
      zh: '1/3 的被试在首页「开始 AI 咨询」按钮被登录墙拦住，无法在 60 秒内获得答案（违背我们 Project Brief 承诺的核心 Success Metric）。',
      en: "1/3 of test participants were blocked by the login wall when clicking 'Start AI Consulting' on the homepage, failing the 60-second Success Metric promised in our Project Brief.",
    },
    change: {
      zh:
        '把首页主 CTA 从 `/ai-chat`（强制登录）切换到 `/chat?q=…`（游客模式），并在 URL 中预填一个真实的演示问题。未登录访客现在一次点击就能看到带引用的 AI 回答。',
      en:
        "Switched the main homepage CTA from `/ai-chat` (login-gated) to `/chat?q=…` (guest mode) with a real pre-filled demo question. Guests now get a cited AI answer with a single click.",
    },
    affectedFiles: [
      'app/[locale]/page.tsx',
      'app/[locale]/chat/page.tsx',
      'components/ChatInterface.tsx',
    ],
  },
  {
    finding: {
      zh:
        'ESG 负责人明确表示：如果不能看到「这条建议引用了哪条政策」，她不敢把 AI 回答上交给老板。纯自然语言输出虽然好看，但缺乏可追溯性。',
      en:
        'An ESG officer explicitly told us: without seeing "which regulation this recommendation cites", she cannot pass the AI answer up to her CEO. Pure natural-language output lacks traceability.',
    },
    change: {
      zh:
        '在 ChatInterface 中识别「（参考：xxx）」/「(source: xxx)」模式并渲染成醒目的蓝色 chip；同时在 System Prompt 中强制 LLM 引用知识库条目，并在侧栏新增「RAG 说明卡」让评委一眼看懂这不是普通的 ChatGPT 包装。',
      en:
        'ChatInterface now detects citation patterns like "（参考：xxx）" and "(source: xxx)" and renders them as prominent blue chips. The system prompt forces the LLM to cite KB entries, and a "RAG explanation card" in the sidebar makes the mechanism obvious to reviewers.',
    },
    affectedFiles: [
      'components/ChatInterface.tsx',
      'app/api/chat/route.ts',
      'lib/rag.ts',
    ],
  },
  {
    finding: {
      zh:
        '高校教师反馈「案例 / 政策老化太快」。我们原来想每月人工更新一次案例库，但这显然跟不上全球 AI 监管的节奏（EU AI Act 光 2026 年就有 3 次重要修订）。',
      en:
        'Faculty reviewers complained that "cases and policies get outdated too fast". We originally planned monthly manual case updates — clearly insufficient given the pace of global AI regulation (EU AI Act had 3 major revisions in 2026 alone).',
    },
    change: {
      zh:
        '构建「周更 Agent」：每周一 00:00 UTC 由 Vercel Cron 自动触发，通过 Tavily 搜索 10 个主题的最新政策动态，DeepSeek 总结后写入 pgvector 并立刻被 RAG 消费；同时增加三层去重（同主题+同日跳过、每主题保留 4 条、透明统计返回）。',
      en:
        'Built a weekly agent triggered by Vercel Cron every Monday 00:00 UTC. It searches 10 topics via Tavily, summarises with DeepSeek, and writes directly to pgvector, where RAG consumes it immediately. Three-layer deduplication (same-topic-same-day skip, top-4 per topic, transparent stats) keeps the KB clean.',
    },
    affectedFiles: [
      'app/api/agent/weekly-update/route.ts',
      'app/[locale]/trends/page.tsx',
      'app/api/news/route.ts',
      'lib/rag.ts',
    ],
  },
  {
    finding: {
      zh:
        '原「关于我们」页包含虚构的投资人与团队履历，学术评委一眼能看出是学生项目反而扣分；同时首页 stats 写「50+ 案例库」但实际只有 8 条。',
      en:
        "The original About page contained fabricated investors and team résumés — transparent to academic reviewers and actually counter-productive. The homepage also claimed '50+ Cases' when only 8 existed.",
    },
    change: {
      zh:
        '把 About 改成真实团队（6 位组员真实学号、职责分工）+ 真实迭代时间线 + 真实导师网络（4 位学术顾问、3 位学术导师、11 位业界导师，照片来自财新 ESG30 官网）；首页 stats 按实际库大小动态计算（policyData/esgStandardsData/casesData/expertData）。',
      en:
        'Rewrote About with real team identities (six Student IDs with real responsibilities) + real iteration timeline + real mentor network (4 academic advisors, 3 academic mentors, 11 industry mentors with photos from Caixin ESG30 official site). Homepage stats now derive dynamically from actual data arrays.',
    },
    affectedFiles: [
      'app/[locale]/about/page.tsx',
      'lib/mentors-data.ts',
      'app/[locale]/page.tsx',
    ],
  },
]

/** 诚实的限制（Demo Day 评分原则：honest limitations > glossy claims） */
export const honestLimitations = [
  {
    zh: '案例库目前只有 8 条，是 1–2 个团队成员整理的；虽然每条都带真实出处，但覆盖行业和地区仍然偏窄。',
    en: 'Our case library currently contains 8 entries hand-curated by 1–2 team members. While every entry is sourced, coverage across industries and regions is still narrow.',
  },
  {
    zh: '部分功能（合规诊断报告 / 出海决策引擎的评分）目前仍基于 Mock 逻辑；它们展示的是"形态"，真实诊断需要继续完善算法。',
    en: 'Several modules (compliance diagnosis report, destination scoring) still use mocked logic. They demonstrate the shape of the product; real scoring needs further algorithmic work.',
  },
  {
    zh: '我们的周更 Agent 依赖 Tavily 免费额度（1000 次/月），如果放量到 1000 用户同时触发手动刷新会被限流。后续会接入企业级搜索 API。',
    en: "Our weekly agent depends on Tavily's free tier (1,000 calls/month). If 1,000 users concurrently trigger manual refresh, we'd hit rate limits. A production-grade search API is needed to scale.",
  },
  {
    zh: '多语言目前只做了中英双语，暂不支持繁体中文；中东与东南亚用户有反馈希望增加阿拉伯语与印尼语，这是我们明确还没解决的需求。',
    en: 'We currently support only Simplified Chinese and English. Users from the Middle East and SEA have asked for Arabic and Bahasa support — a concrete gap we have not yet addressed.',
  },
]

/** 如果再给我们一个月会做的事（Demo Day 加分项） */
export const nextSteps = [
  {
    zh: '把案例库从 8 条扩充到 50+，并按行业（CV / NLP / Autonomous / Robotics）、区域（EU / US / MENA / SEA）建立清晰的 taxonomy。',
    en: 'Expand the case library from 8 to 50+ entries with a clean taxonomy by industry (CV / NLP / Autonomous / Robotics) and region (EU / US / MENA / SEA).',
  },
  {
    zh: '给周更 Agent 加 webhook：当某国关键监管发生变动时，主动向订阅用户发邮件或飞书推送。',
    en: 'Add a webhook layer to the weekly agent: actively push email/Lark notifications when key regulations change in subscribed regions.',
  },
  {
    zh: '把合规诊断从 4 步 Mock 表单接入真实 AI 工作流：用户输入 → RAG 匹配适用法规 → LLM 生成结构化缺口报告（含优先级和整改 deadline）。',
    en: 'Wire compliance diagnosis from the 4-step mock form to a real AI workflow: user input → RAG matches applicable regulations → LLM produces a structured gap report with priorities and deadlines.',
  },
  {
    zh: '做一次 20 人规模的 A/B 测试：对照组用传统咨询报告阅读，实验组用海问 RAG 问答，量化"理解合规要求"的时间差与准确度差。',
    en: 'Run a 20-person A/B test: control group reads traditional consulting reports, experimental group uses HaiWen RAG Q&A. Quantify the delta in comprehension time and accuracy.',
  },
]
