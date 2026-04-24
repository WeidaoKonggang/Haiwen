// ── Mock data for all platform modules ──────────────────────────────────────

export interface Policy {
  id: string
  title: string
  titleEn: string
  country: string
  countryEn: string
  type: string
  typeEn: string
  status: 'active' | 'draft' | 'expired'
  publishDate: string
  effectiveDate: string
  summary: string
  summaryEn: string
  keyPoints: string[]
  keyPointsEn: string[]
  riskLevel: 'high' | 'medium' | 'low'
  tags: string[]
  tagsEn: string[]
  publishOrg: string
}

export const policyData: Policy[] = [
  {
    id: 'eu-ai-act',
    title: '欧盟人工智能法案（EU AI Act）',
    titleEn: 'EU Artificial Intelligence Act',
    country: '欧盟',
    countryEn: 'European Union',
    type: 'AI监管',
    typeEn: 'AI Regulation',
    status: 'active',
    publishDate: '2024-03-13',
    effectiveDate: '2024-08-01',
    summary: '全球首部综合性AI监管法规，按风险等级对AI系统进行分类管理，高风险AI系统须满足透明度、数据治理、人工监督等强制合规要求。禁止部分不可接受风险的AI用途。',
    summaryEn: 'The world\'s first comprehensive AI regulation, classifying AI systems by risk level. High-risk AI systems must meet mandatory requirements for transparency, data governance, and human oversight. Certain unacceptable-risk AI uses are prohibited.',
    keyPoints: [
      '禁止社会评分、实时生物识别等不可接受风险AI应用',
      '高风险AI系统须建立质量管理体系、进行合规评估',
      '通用AI模型（GPAI）须满足透明度和版权合规义务',
      '违规最高罚款为全球年营业额的7%或3500万欧元',
      '中国AI企业若向欧盟用户提供服务，须全面适用本法案',
    ],
    keyPointsEn: [
      'Prohibits unacceptable-risk AI applications including social scoring and real-time biometric identification',
      'High-risk AI systems require quality management systems and conformity assessments',
      'General-Purpose AI models must meet transparency and copyright compliance obligations',
      'Maximum fines of 7% of global annual turnover or €35 million',
      'Chinese AI companies serving EU users must fully comply with this Act',
    ],
    riskLevel: 'high',
    tags: ['AI监管', '合规', '欧盟', '高风险'],
    tagsEn: ['AI Regulation', 'Compliance', 'EU', 'High Risk'],
    publishOrg: '欧洲议会与欧盟理事会',
  },
  {
    id: 'gdpr',
    title: '欧盟通用数据保护条例（GDPR）',
    titleEn: 'General Data Protection Regulation (GDPR)',
    country: '欧盟',
    countryEn: 'European Union',
    type: '数据保护',
    typeEn: 'Data Protection',
    status: 'active',
    publishDate: '2016-04-27',
    effectiveDate: '2018-05-25',
    summary: '欧盟最重要的数据保护法规，确立个人数据处理的基本原则和权利体系。任何处理欧盟居民数据的企业（无论注册地）均须合规，违规最高罚款达全球营业额4%。',
    summaryEn: 'The EU\'s landmark data protection regulation establishing core principles and rights for personal data processing. Any organization processing EU resident data regardless of location must comply, with fines up to 4% of global turnover.',
    keyPoints: [
      '数据处理须具备合法依据（同意、合同、法律义务等6种之一）',
      '数据主体享有访问权、删除权、可携权、限制处理权',
      '数据出境须采用标准合同条款（SCC）、充分性决定或约束性企业规则',
      '72小时内向监管机构报告数据泄露事件',
      '须任命数据保护官（DPO）并完成数据保护影响评估（DPIA）',
    ],
    keyPointsEn: [
      'Data processing requires a lawful basis (one of 6: consent, contract, legal obligation, etc.)',
      'Data subjects have rights to access, erasure, portability, and restriction of processing',
      'Data transfers outside EU require Standard Contractual Clauses, adequacy decisions, or BCRs',
      'Data breaches must be reported to supervisory authority within 72 hours',
      'Must appoint a Data Protection Officer (DPO) and conduct DPIAs for high-risk processing',
    ],
    riskLevel: 'high',
    tags: ['数据保护', '隐私', '欧盟', '跨境传输'],
    tagsEn: ['Data Protection', 'Privacy', 'EU', 'Cross-border Transfer'],
    publishOrg: '欧洲议会与欧盟理事会',
  },
  {
    id: 'sg-pdpa',
    title: '新加坡个人数据保护法（PDPA）及AI治理框架',
    titleEn: 'Singapore PDPA & AI Governance Framework',
    country: '新加坡',
    countryEn: 'Singapore',
    type: '数据保护 / AI治理',
    typeEn: 'Data Protection / AI Governance',
    status: 'active',
    publishDate: '2022-02-01',
    effectiveDate: '2022-02-01',
    summary: '新加坡建立了完善的个人数据保护与AI治理双轨体系。PDPA规范数据收集与使用，AI治理框架（Model AI Governance Framework）提供负责任AI部署指导，对AI企业较为友好，是东南亚出海首选目的地之一。',
    summaryEn: 'Singapore maintains a dual framework for personal data protection and AI governance. PDPA regulates data collection and use, while the Model AI Governance Framework guides responsible AI deployment. Singapore is considered one of the most AI-friendly jurisdictions in Southeast Asia.',
    keyPoints: [
      '数据收集须告知目的，只能用于收集时声明的目的',
      '数据出境须确保目标国提供相当于PDPA的保护水平',
      'AI治理框架强调可解释性、公平性、人类监督三大原则',
      '违规罚款上限100万新元（约75万美元）',
      '新加坡对AI企业相对友好，监管弹性较大',
    ],
    keyPointsEn: [
      'Data collection requires notification of purpose and can only be used for stated purposes',
      'Data transfers abroad require ensuring equivalent protection to PDPA',
      'AI Governance Framework emphasizes explainability, fairness, and human oversight',
      'Maximum fine of SGD 1 million (approximately USD 750,000)',
      'Singapore is relatively AI-friendly with flexible regulatory approach',
    ],
    riskLevel: 'low',
    tags: ['数据保护', 'AI治理', '新加坡', '东南亚'],
    tagsEn: ['Data Protection', 'AI Governance', 'Singapore', 'Southeast Asia'],
    publishOrg: '新加坡个人数据保护委员会（PDPC）',
  },
  {
    id: 'us-ai-eo',
    title: '美国AI安全与可信赖行政令',
    titleEn: 'US Executive Order on Safe, Secure, and Trustworthy AI',
    country: '美国',
    countryEn: 'United States',
    type: 'AI监管',
    typeEn: 'AI Regulation',
    status: 'active',
    publishDate: '2023-10-30',
    effectiveDate: '2023-10-30',
    summary: '拜登政府发布的AI安全行政令，要求开发者在发布大型AI模型前向政府报告安全测试结果，建立AI安全标准、评估框架和国家安全审查机制。对涉及AI出口管控和国家安全审查有重要影响。',
    summaryEn: 'Biden administration executive order requiring developers of large AI models to report safety test results to government before deployment, establishing AI safety standards, evaluation frameworks, and national security review mechanisms.',
    keyPoints: [
      '大型AI模型开发商须向政府汇报安全测试结果',
      '建立AI安全与标准国家研究所（NIST）评估框架',
      '对外国AI公司投资美国实施更严格审查',
      '要求在政府AI采购中优先考虑安全认证产品',
      '中国AI企业进入美国市场面临更高合规与安全审查门槛',
    ],
    keyPointsEn: [
      'Large AI model developers must report safety test results to government',
      'Establishes NIST framework for AI safety and standards evaluation',
      'Stricter review of foreign AI company investments in the US',
      'Requires prioritizing safety-certified products in government AI procurement',
      'Chinese AI companies face higher compliance and security review barriers entering US market',
    ],
    riskLevel: 'high',
    tags: ['AI安全', '出口管控', '美国', '国家安全'],
    tagsEn: ['AI Safety', 'Export Control', 'United States', 'National Security'],
    publishOrg: '美国白宫',
  },
  {
    id: 'cn-data-security',
    title: '中国数据安全法',
    titleEn: 'China Data Security Law (DSL)',
    country: '中国',
    countryEn: 'China',
    type: '数据安全',
    typeEn: 'Data Security',
    status: 'active',
    publishDate: '2021-06-10',
    effectiveDate: '2021-09-01',
    summary: '确立中国数据安全保护基本制度，要求对数据进行分级分类管理，重要数据和核心数据实施更严格保护。境外组织和个人在中国境内处理数据须遵守本法，数据出境须满足安全评估要求。',
    summaryEn: 'Establishes China\'s fundamental data security protection system, requiring tiered classification of data. Important and core data receives stricter protection. Foreign organizations processing data in China must comply, and data exports must satisfy security assessment requirements.',
    keyPoints: [
      '数据分三级：一般数据、重要数据、国家核心数据',
      '重要数据须建立数据安全管理制度，配备专职人员',
      '向境外提供重要数据须通过国家网信办安全评估',
      '违规最高罚款100万元，情节严重暂停或吊销许可证',
      '与《个人信息保护法》《网络安全法》共同构成数据合规三件套',
    ],
    keyPointsEn: [
      'Data classified into three tiers: general data, important data, and core national data',
      'Important data requires data security management systems and dedicated personnel',
      'Providing important data abroad requires security assessment from CAC',
      'Maximum fine of RMB 1 million, serious violations may result in license suspension or revocation',
      'Forms the data compliance trilogy with PIPL and Cybersecurity Law',
    ],
    riskLevel: 'medium',
    tags: ['数据安全', '数据分级', '中国', '数据出境'],
    tagsEn: ['Data Security', 'Data Classification', 'China', 'Data Export'],
    publishOrg: '全国人民代表大会常务委员会',
  },
  {
    id: 'cn-algorithm',
    title: '互联网信息服务算法推荐管理规定',
    titleEn: 'China Algorithm Recommendation Regulations',
    country: '中国',
    countryEn: 'China',
    type: 'AI监管',
    typeEn: 'AI Regulation',
    status: 'active',
    publishDate: '2022-01-04',
    effectiveDate: '2022-03-01',
    summary: '中国首部专门针对算法推荐技术的监管规定，要求提供算法推荐服务的企业进行备案，保障用户权益，防止"信息茧房"和大数据杀熟，保护未成年人及劳动者权益。',
    summaryEn: 'China\'s first regulation specifically targeting algorithm recommendation technology, requiring registration of algorithm recommendation services, protecting user rights, preventing filter bubbles and price discrimination, and protecting minors and workers.',
    keyPoints: [
      '算法推荐服务提供者须向网信办备案',
      '禁止利用算法实施不正当价格歧视',
      '须向用户提供关闭算法推荐的选项',
      '保护未成年人，不得向未成年人推送不良信息',
      '保护劳动者权益，不得利用算法过度派单',
    ],
    keyPointsEn: [
      'Algorithm recommendation service providers must register with the CAC',
      'Prohibits using algorithms for unfair price discrimination',
      'Must provide users the option to turn off algorithm recommendations',
      'Protects minors from inappropriate content through algorithmic targeting',
      'Protects workers\' rights, prohibits excessive order assignment through algorithms',
    ],
    riskLevel: 'medium',
    tags: ['算法监管', '推荐系统', '中国', '备案'],
    tagsEn: ['Algorithm Regulation', 'Recommendation Systems', 'China', 'Registration'],
    publishOrg: '国家互联网信息办公室',
  },
  {
    id: 'jp-appi',
    title: '日本个人信息保护法（APPI）2022修订版',
    titleEn: 'Japan Act on the Protection of Personal Information (APPI) 2022',
    country: '日本',
    countryEn: 'Japan',
    type: '数据保护',
    typeEn: 'Data Protection',
    status: 'active',
    publishDate: '2022-04-01',
    effectiveDate: '2022-04-01',
    summary: '日本个人信息保护法2022年修订版强化数据主体权利，增加数据泄露通报义务，扩大对境外数据处理的管辖范围，适用于向日本境内个人提供服务的境外企业。',
    summaryEn: 'Japan\'s 2022 APPI revision strengthens data subject rights, adds data breach notification obligations, and extends jurisdiction to foreign companies processing data of individuals in Japan.',
    keyPoints: [
      '境外企业向日本居民提供服务时须适用本法',
      '违规行为须在30日内向个人信息保护委员会报告',
      '强化用户删除权和拒绝权',
      '对假名化信息和匿名化信息规定了不同的处理要求',
      '日本与欧盟实现GDPR相互充分性认定，有利于数据流通',
    ],
    keyPointsEn: [
      'Applies to foreign companies providing services to individuals in Japan',
      'Violations must be reported to PPC within 30 days',
      'Strengthens user rights to deletion and refusal',
      'Different requirements for pseudonymized vs anonymized information',
      'Japan and EU have mutual adequacy recognition under GDPR, facilitating data flows',
    ],
    riskLevel: 'medium',
    tags: ['数据保护', '隐私', '日本', '东亚'],
    tagsEn: ['Data Protection', 'Privacy', 'Japan', 'East Asia'],
    publishOrg: '日本个人信息保护委员会（PPC）',
  },
  {
    id: 'uk-dpdib',
    title: '英国数据保护与数字信息法案（DPDI Bill）',
    titleEn: 'UK Data Protection and Digital Information Bill',
    country: '英国',
    countryEn: 'United Kingdom',
    type: '数据保护',
    typeEn: 'Data Protection',
    status: 'active',
    publishDate: '2023-03-08',
    effectiveDate: '2024-10-01',
    summary: '英国脱欧后对GDPR的本土化改造，在保持高水平数据保护的同时减少部分合规负担，建立更灵活的数据监管框架。英国与欧盟保持数据充分性协议，允许数据自由流动。',
    summaryEn: 'UK\'s post-Brexit localization of GDPR, maintaining high data protection standards while reducing some compliance burdens and establishing a more flexible regulatory framework. UK and EU maintain an adequacy agreement allowing free data flows.',
    keyPoints: [
      '简化部分GDPR合规要求，降低中小企业负担',
      '英欧数据充分性协议保障双向数据自由流动',
      '建立负责任的AI治理原则',
      '强化对儿童数据的特殊保护',
      '对认可的合法商业目的提供更灵活的合规路径',
    ],
    keyPointsEn: [
      'Simplifies some GDPR compliance requirements, reducing burden on SMEs',
      'UK-EU adequacy agreement ensures bidirectional free data flows',
      'Establishes principles for responsible AI governance',
      'Strengthens special protection for children\'s data',
      'Provides more flexible compliance pathways for recognized legitimate business purposes',
    ],
    riskLevel: 'low',
    tags: ['数据保护', '英国', '脱欧后合规', 'GDPR'],
    tagsEn: ['Data Protection', 'UK', 'Post-Brexit Compliance', 'GDPR'],
    publishOrg: '英国数字、文化、媒体和体育部',
  },
  {
    id: 'br-lgpd',
    title: '巴西通用数据保护法（LGPD）',
    titleEn: 'Brazil General Data Protection Law (LGPD)',
    country: '巴西',
    countryEn: 'Brazil',
    type: '数据保护',
    typeEn: 'Data Protection',
    status: 'active',
    publishDate: '2020-09-18',
    effectiveDate: '2021-08-01',
    summary: '巴西仿照GDPR建立的数据保护法规，是拉丁美洲最重要的数据保护立法。覆盖在巴西收集、处理或存储个人数据的所有活动，无论数据处理者在哪个国家注册。',
    summaryEn: 'Brazil\'s GDPR-inspired data protection law, the most important data protection legislation in Latin America. Covers all activities collecting, processing, or storing personal data in Brazil, regardless of where the data processor is registered.',
    keyPoints: [
      '与GDPR高度相似，共10种合法处理数据的法律依据',
      '数据主体享有访问、更正、删除、携带等多项权利',
      '违规罚款最高为前一年营业额的2%，上限5000万雷亚尔',
      '国家数据保护局（ANPD）负责监管执法',
      '巴西AI市场快速增长，是中国AI企业拉美出海首选目的地',
    ],
    keyPointsEn: [
      'Highly similar to GDPR with 10 lawful bases for data processing',
      'Data subjects have rights to access, correction, deletion, and portability',
      'Fines up to 2% of prior year revenue, capped at BRL 50 million',
      'National Data Protection Authority (ANPD) handles regulatory enforcement',
      'Brazil\'s fast-growing AI market makes it a top choice for Chinese AI companies in Latin America',
    ],
    riskLevel: 'medium',
    tags: ['数据保护', '巴西', '拉丁美洲', 'GDPR相似'],
    tagsEn: ['Data Protection', 'Brazil', 'Latin America', 'GDPR-similar'],
    publishOrg: '巴西国家数据保护局（ANPD）',
  },
  {
    id: 'in-dpdpa',
    title: '印度数字个人数据保护法（DPDPA）',
    titleEn: 'India Digital Personal Data Protection Act (DPDPA)',
    country: '印度',
    countryEn: 'India',
    type: '数据保护',
    typeEn: 'Data Protection',
    status: 'active',
    publishDate: '2023-08-11',
    effectiveDate: '2024-01-01',
    summary: '印度首部综合性个人数据保护法，规范数字个人数据的收集、处理和存储。对向印度用户提供服务的境外企业具有域外管辖权，但整体监管相对GDPR更为灵活。',
    summaryEn: 'India\'s first comprehensive personal data protection law regulating collection, processing, and storage of digital personal data. Has extraterritorial jurisdiction over foreign companies providing services to users in India, with a generally more flexible approach than GDPR.',
    keyPoints: [
      '数据本地化要求相对灵活，允许数据跨境流动（政府批准的国家除外）',
      '个人数据处理须获得同意或符合特定合法目的',
      '违规最高罚款2500亿卢比（约合30亿美元）',
      '印度AI市场规模大增长快，是中国AI企业南亚出海重要目的地',
      '数据保护局尚在建立中，近期执法力度相对有限',
    ],
    keyPointsEn: [
      'Relatively flexible data localization requirements allowing cross-border flows (except approved restricted countries)',
      'Personal data processing requires consent or fits specified legitimate purposes',
      'Maximum fine of INR 250 billion (approximately USD 3 billion)',
      'India\'s large and fast-growing AI market makes it a key destination for Chinese AI companies in South Asia',
      'Data Protection Board still being established, enforcement capacity currently limited',
    ],
    riskLevel: 'medium',
    tags: ['数据保护', '印度', '南亚', '新兴市场'],
    tagsEn: ['Data Protection', 'India', 'South Asia', 'Emerging Market'],
    publishOrg: '印度电子与信息技术部',
  },
]

export interface EsgStandard {
  id: string
  name: string
  nameEn: string
  org: string
  orgEn: string
  version: string
  publishDate: string
  effectiveDate?: string
  summary: string
  summaryEn: string
  dimensions: string[]
  dimensionsEn: string[]
  applicability: string
  applicabilityEn: string
  tags: string[]
}

export const esgStandardsData: EsgStandard[] = [
  {
    id: 'gri',
    name: 'GRI可持续发展报告标准',
    nameEn: 'GRI Sustainability Reporting Standards',
    org: '全球报告倡议组织（GRI）',
    orgEn: 'Global Reporting Initiative (GRI)',
    version: 'GRI 2021',
    publishDate: '2021-10-01',
    summary: '全球使用最广泛的可持续发展报告框架，被90%以上的《财富》250强企业采用。分为通用准则（GRI 1-3）和行业准则，涵盖环境、社会、治理全维度披露要求。',
    summaryEn: 'The world\'s most widely used sustainability reporting framework, adopted by over 90% of Fortune 250 companies. Divided into universal standards (GRI 1-3) and sector standards, covering full ESG disclosure requirements.',
    dimensions: ['环境（气候变化、生物多样性、能源、水资源）', '社会（雇员、供应链、社区、人权）', '治理（反腐败、税务透明度、公共政策）'],
    dimensionsEn: ['Environmental (climate change, biodiversity, energy, water)', 'Social (employees, supply chain, community, human rights)', 'Governance (anti-corruption, tax transparency, public policy)'],
    applicability: '适用于所有规模和类型的组织，中国出海企业境外上市或与跨国企业合作时广泛采用',
    applicabilityEn: 'Applicable to all organizations of all sizes and types; widely adopted by Chinese companies listing overseas or partnering with multinationals',
    tags: ['通用框架', '全球最广泛', '强制+自愿'],
  },
  {
    id: 'issb',
    name: 'ISSB可持续相关财务信息披露准则（IFRS S1/S2）',
    nameEn: 'ISSB IFRS Sustainability Disclosure Standards (S1/S2)',
    org: '国际可持续准则理事会（ISSB）',
    orgEn: 'International Sustainability Standards Board (ISSB)',
    version: 'IFRS S1/S2 2023',
    publishDate: '2023-06-26',
    summary: '国际财务报告准则体系下的首套可持续发展披露准则。S1要求披露一般可持续发展相关风险与机遇，S2专门针对气候相关风险披露。正在成为全球资本市场的基准披露标准。',
    summaryEn: 'The first sustainability disclosure standards under the IFRS system. S1 requires disclosure of general sustainability-related risks and opportunities; S2 focuses on climate-related risk disclosures. Becoming the benchmark standard for global capital markets.',
    dimensions: ['气候相关风险与机遇（S2核心）', '可持续发展相关风险与机遇（S1核心）', '与财务报表集成披露'],
    dimensionsEn: ['Climate-related risks and opportunities (S2 core)', 'Sustainability-related risks and opportunities (S1 core)', 'Integrated disclosure with financial statements'],
    applicability: '适用于国际资本市场融资或上市的企业，香港联交所已宣布强制采用',
    applicabilityEn: 'For companies seeking international capital market financing or listing; Hong Kong Stock Exchange has announced mandatory adoption',
    tags: ['财务整合', '气候重点', '资本市场'],
  },
  {
    id: 'tcfd',
    name: '气候相关财务信息披露工作组建议（TCFD）',
    nameEn: 'Task Force on Climate-related Financial Disclosures (TCFD)',
    org: '金融稳定委员会（FSB）',
    orgEn: 'Financial Stability Board (FSB)',
    version: '2023版',
    publishDate: '2023-10-09',
    summary: 'G20支持的气候信息披露框架，从治理、战略、风险管理、指标与目标四个维度要求企业披露气候相关风险与机遇信息。ISSB的IFRS S2已整合TCFD建议，多国已将其纳入强制披露要求。',
    summaryEn: 'G20-backed climate disclosure framework requiring organizations to disclose climate-related risks and opportunities across four dimensions: governance, strategy, risk management, and metrics & targets. IFRS S2 integrates TCFD recommendations, and multiple countries have mandated it.',
    dimensions: ['治理（董事会和管理层对气候风险的监督）', '战略（气候风险对业务战略的影响）', '风险管理（气候风险识别、评估、管理流程）', '指标与目标（气候相关KPI和减排目标）'],
    dimensionsEn: ['Governance (board and management oversight of climate risks)', 'Strategy (impact of climate risks on business strategy)', 'Risk Management (climate risk identification, assessment, management)', 'Metrics & Targets (climate-related KPIs and emission reduction targets)'],
    applicability: '全球多国监管机构要求强制披露，适合出海欧美市场的企业优先采用',
    applicabilityEn: 'Mandated by regulators in multiple countries; priority for companies targeting European and American markets',
    tags: ['气候重点', '金融机构', '多国强制'],
  },
  {
    id: 'sasb',
    name: 'SASB行业特定可持续发展会计标准',
    nameEn: 'SASB Industry-Specific Sustainability Accounting Standards',
    org: '可持续发展会计准则理事会（SASB）',
    orgEn: 'Sustainability Accounting Standards Board (SASB)',
    version: '2023版（ISSB整合）',
    publishDate: '2023-01-01',
    summary: '针对77个行业制定的行业特定ESG披露标准，已并入ISSB体系。科技行业专项标准包含数据隐私与安全、算法偏见、绿色算力等AI企业专属ESG指标，是AI科技企业ESG报告的核心参考框架。',
    summaryEn: 'Industry-specific ESG disclosure standards for 77 industries, now integrated into the ISSB system. Technology sector standards include AI-specific ESG metrics such as data privacy and security, algorithmic bias, and green computing, making it the core reference for AI tech company ESG reporting.',
    dimensions: ['科技行业：数据安全与隐私、算法公平性', 'AI算力：能耗与碳排放、绿色数据中心', '员工：多元化、薪酬公平、安全'],
    dimensionsEn: ['Technology: data security & privacy, algorithmic fairness', 'AI Computing: energy consumption & carbon emissions, green data centers', 'People: diversity, pay equity, safety'],
    applicability: 'AI科技企业ESG报告首选，提供行业对标数据，适合美国上市或与美国机构投资者合作的企业',
    applicabilityEn: 'Top choice for AI tech company ESG reporting; provides industry benchmarks; ideal for US-listed companies or those working with US institutional investors',
    tags: ['行业特定', 'AI科技专项', '美国导向'],
  },
  {
    id: 'csrd',
    name: '欧盟企业可持续发展报告指令（CSRD/ESRS）',
    nameEn: 'EU Corporate Sustainability Reporting Directive (CSRD/ESRS)',
    org: '欧盟委员会',
    orgEn: 'European Commission',
    version: 'ESRS 2023',
    publishDate: '2023-07-31',
    effectiveDate: '2024-01-01',
    summary: '欧盟最严格的ESG强制披露框架，要求在欧盟经营的大型企业按欧洲可持续发展报告准则（ESRS）强制披露ESG信息，涵盖12项主题准则，覆盖面远超现有要求。年营业额超1.5亿欧元的中国企业若在欧盟有子公司亦须合规。',
    summaryEn: 'The EU\'s strictest mandatory ESG disclosure framework, requiring large companies operating in the EU to mandatorily disclose ESG information under European Sustainability Reporting Standards (ESRS), covering 12 topic standards with far broader scope than existing requirements.',
    dimensions: ['环境：气候变化、污染、水资源、生物多样性、资源循环', '社会：劳工权益、价值链工人、受影响社区、消费者和终端用户', '治理：商业行为、公司治理'],
    dimensionsEn: ['Environmental: climate change, pollution, water, biodiversity, circular economy', 'Social: own workforce, workers in value chain, affected communities, consumers & end users', 'Governance: business conduct, corporate governance'],
    applicability: '在欧盟年营业额超1.5亿欧元且有欧盟子公司的中国AI企业须强制遵从，欧洲出海重要合规要求',
    applicabilityEn: 'Mandatory for Chinese AI companies with EU subsidiaries and EU revenue exceeding €150 million; key compliance requirement for European market entry',
    tags: ['欧盟强制', '最严格框架', '上市公司'],
  },
]

export interface Expert {
  id: string
  name: string
  title: string
  institution: string
  bio: string
  specialties: string[]
  experience: string
  cases: number
  rating: number
  avatar: string
  tags: string[]
  available: boolean
  verified: boolean
  hourlyRate: number
}

export const expertData: Expert[] = [
  { id: 'e1', name: '张明博士', title: 'EU AI Act & GDPR合规专家', institution: '北京大学法学院（兼职）', bio: '前欧盟委员会法律顾问，专注AI法规与数据保护合规领域12年，服务过80+家中国出海企业。', specialties: ['欧盟合规', 'AI监管', 'GDPR'], experience: '12年', cases: 87, rating: 4.9, avatar: 'ZM', tags: ['欧盟', 'AI法案', '数据保护'], available: true, verified: true, hourlyRate: 3800 },
  { id: 'e2', name: '李华女士', title: 'ESG评级提升顾问（MSCI/富时）', institution: '明晟MSCI前高级分析师', bio: '拥有9年ESG评级研究经验，帮助20+家中国企业成功提升MSCI和富时ESG评级，GRI认证顾问。', specialties: ['ESG评级', 'MSCI', '可持续发展报告'], experience: '9年', cases: 63, rating: 4.8, avatar: 'LH', tags: ['ESG评级', '上市公司', '报告编制'], available: true, verified: true, hourlyRate: 3200 },
  { id: 'e3', name: '王磊先生', title: '跨境税务与转让定价专家', institution: '德勤（Deloitte）税务合伙人', bio: '15年跨国企业税务规划经验，专注中国AI企业出海架构设计和转让定价方案，服务142个跨境项目。', specialties: ['跨境税务', '转让定价', '税务筹划'], experience: '15年', cases: 142, rating: 4.7, avatar: 'WL', tags: ['税务', '跨境', '出海架构'], available: false, verified: true, hourlyRate: 4500 },
  { id: 'e4', name: '陈静女士', title: '东南亚AI政策与市场准入专家', institution: '新加坡国立大学访问研究员', bio: '8年东南亚市场经验，深度研究新加坡、马来西亚、印尼等市场AI监管政策与市场进入策略。', specialties: ['东南亚合规', 'AI政策', '市场准入'], experience: '8年', cases: 54, rating: 4.8, avatar: 'CJ', tags: ['东南亚', '新加坡', '印尼'], available: true, verified: true, hourlyRate: 2800 },
  { id: 'e5', name: '赵宇先生', title: '海外运营与本地化战略专家', institution: '前字节跳动海外运营总监', bio: '主导过TikTok欧美市场本地化运营，11年AI产品出海品牌与运营经验，擅长用户增长与团队搭建。', specialties: ['本地化运营', '团队搭建', '品牌推广'], experience: '11年', cases: 76, rating: 4.6, avatar: 'ZY', tags: ['运营', '本地化', '品牌'], available: true, verified: false, hourlyRate: 2500 },
  { id: 'e6', name: '刘晨女士', title: '数据隐私与跨境数据合规律师', institution: '方达律师事务所合伙人', bio: '国际数据保护律师，CIPP/E认证，专注GDPR、中国数据安全法、个人信息保护法的合规实践。', specialties: ['数据隐私', '跨境数据传输', '隐私政策'], experience: '10年', cases: 98, rating: 4.9, avatar: 'LC', tags: ['数据合规', '隐私法', '律师'], available: true, verified: true, hourlyRate: 4200 },
  { id: 'e7', name: '周峰先生', title: '供应链ESG与碳排放核算专家', institution: 'SGS认证高级审核员', bio: 'ISO 14064认证审核员，专注AI企业供应链碳足迹核算和Scope 1/2/3排放量化方法论。', specialties: ['供应链ESG', '碳核算', 'ISO14064'], experience: '7年', cases: 45, rating: 4.7, avatar: 'ZF', tags: ['碳排放', '供应链', 'ESG数据'], available: false, verified: true, hourlyRate: 2200 },
  { id: 'e8', name: '黄敏女士', title: '绿色金融与ESG投融资顾问', institution: '中国绿色债券协会委员', bio: '13年绿色金融从业经验，协助30+企业完成绿色债券发行与ESG融资，熟悉主流ESG评级机构要求。', specialties: ['绿色金融', 'ESG投资', '可持续债券'], experience: '13年', cases: 89, rating: 4.8, avatar: 'HM', tags: ['绿色金融', '融资', '投资者关系'], available: true, verified: true, hourlyRate: 3500 },
]

export interface ServiceProvider {
  id: string
  name: string
  type: string
  description: string
  services: string[]
  regions: string[]
  contactMethod: string
  verified: boolean
}

export const serviceProviderData: ServiceProvider[] = [
  { id: 'sp1', name: '方达律师事务所（跨境业务部）', type: '律所', description: '中国领先的国际律所，专注中国企业海外并购、合规与争议解决', services: ['合规审查', '数据保护', 'AI法案应对', '境外公司设立'], regions: ['欧盟', '美国', '东南亚'], contactMethod: '预约咨询', verified: true },
  { id: 'sp2', name: '德勤（Deloitte）ESG咨询团队', type: '咨询机构', description: '全球四大之一，提供ESG战略规划、数据采集、报告编制全链路服务', services: ['ESG战略', '碳核算', 'ESG报告', '评级提升'], regions: ['全球'], contactMethod: '预约咨询', verified: true },
  { id: 'sp3', name: 'SGS可持续发展认证', type: 'ESG认证机构', description: '全球领先的认证检测机构，提供ESG披露鉴证、碳排放核查、ISO认证', services: ['ESG鉴证', '碳核查', 'ISO14064', '第三方评估'], regions: ['全球'], contactMethod: '申请认证', verified: true },
  { id: 'sp4', name: '空中云汇（Airwallex）', type: '跨境支付', description: '中国领先的跨境支付平台，支持企业级多币种收付款和全球账户', services: ['多币种账户', '跨境收款', 'FX兑换', 'API支付接入'], regions: ['欧美', '东南亚', '澳洲'], contactMethod: '立即注册', verified: true },
  { id: 'sp5', name: '新加坡纬壹科技城（one-north）', type: '海外园区', description: '新加坡政府支持的科技创新园区，为入驻企业提供政策扶持与资源对接', services: ['注册落地', '办公空间', '政府补贴', '本地资源'], regions: ['新加坡'], contactMethod: '申请入驻', verified: true },
  { id: 'sp6', name: '红杉中国出海基金', type: '投融资机构', description: '专注中国科技企业出海的风险投资机构，提供资金与生态资源支持', services: ['种子轮融资', '出海战略', '生态资源', '海外市场对接'], regions: ['全球'], contactMethod: '递交BP', verified: false },
]

export interface RiskEvent {
  id: string
  title: string
  level: 'high' | 'medium' | 'low'
  category: string
  region: string
  date: string
  description: string
  impact: string
  suggestion: string
  status: 'active' | 'monitoring' | 'resolved'
}

export const riskEventData: RiskEvent[] = [
  { id: 'r1', title: 'EU AI Act高风险AI系统合规截止期临近', level: 'high', category: '政策合规风险', region: '欧盟', date: '2025-08-01', description: 'EU AI Act对高风险AI系统的合规要求将于2025年8月1日起正式生效，企业须在此前完成合规评估和质量管理体系建立。', impact: '未及时合规可能面临全球营业额7%的罚款，同时影响在欧盟的业务运营资质。', suggestion: '立即启动EU AI Act合规差距分析，建立合规路线图，重点完成风险分类评估和质量管理体系搭建。', status: 'active' },
  { id: 'r2', title: '美国对华AI芯片出口管制持续收紧', level: 'high', category: '地缘政治风险', region: '美国', date: '2024-10-17', description: '美国商务部持续更新对华AI芯片出口限制清单，最新规定将部分高性能GPU纳入许可证管制范围，影响企业算力采购和云服务使用。', impact: '可能影响企业在美国云平台的AI服务部署，以及在第三国采购高性能算力的合法性。', suggestion: '评估现有算力供应链风险，布局多元化算力来源，加强与国内外合规云服务商合作。', status: 'active' },
  { id: 'r3', title: '新加坡PDPA修订草案公开征询意见', level: 'medium', category: '政策合规风险', region: '新加坡', date: '2024-09-15', description: '新加坡个人数据保护委员会发布PDPA修订草案，拟强化数据出境管理要求，引入更严格的同意机制，预计2025年底正式实施。', impact: '将增加以新加坡为出海跳板的企业的合规成本，需提前规划数据架构调整。', suggestion: '密切关注立法进展，提前评估数据处理流程合规差距，参与公开征询表达行业立场。', status: 'monitoring' },
  { id: 'r4', title: 'ESG数据造假监管趋严，信息披露须真实准确', level: 'medium', category: 'ESG违规风险', region: '全球', date: '2024-08-20', description: '欧美监管机构对"漂绿"（Greenwashing）行为的执法力度持续加强，多家企业因ESG数据不实遭受重罚，AI行业算力碳排放数据成关注重点。', impact: 'ESG数据不实将导致监管处罚、声誉损失，影响境外融资和上市审查。', suggestion: '建立严格的ESG数据采集与核查机制，引入第三方鉴证，确保碳排放等关键数据可验证。', status: 'monitoring' },
  { id: 'r5', title: '印度市场AI监管框架草案发布', level: 'low', category: '政策合规风险', region: '印度', date: '2024-07-01', description: '印度政府发布AI监管框架草案，对AI系统的透明度、问责机制和用户保护提出基本要求，预计正式立法时间为2025年。', impact: '对计划进入印度市场的AI企业影响相对有限，但需提前关注立法走向。', suggestion: '持续跟踪印度AI立法进展，在产品设计阶段预置合规功能，降低未来改造成本。', status: 'resolved' },
]

export const esgMetrics = {
  environmental: {
    score: 72,
    carbonEmission: { value: 1250, unit: '吨CO₂e', trend: -8 },
    energyConsumption: { value: 3200, unit: '兆瓦时', trend: -5 },
    renewableEnergy: { value: 35, unit: '%', trend: +12 },
    waterUsage: { value: 890, unit: '立方米', trend: -3 },
  },
  social: {
    score: 68,
    employees: 428,
    femaleRatio: 38,
    trainingHours: 42,
    satisfactionRate: 89,
  },
  governance: {
    score: 81,
    boardIndependence: 60,
    antiCorruptionTraining: 100,
    dataBreachIncidents: 0,
    complianceRate: 97,
  },
}

export const dashboardStats = {
  complianceScore: 74,
  riskIndex: 3.2,
  esgScore: 71,
  activeProjects: 3,
  pendingTasks: 7,
  policyUpdates: 5,
  riskAlerts: 2,
}
