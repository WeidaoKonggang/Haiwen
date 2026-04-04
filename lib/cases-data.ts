export interface CaseItem {
  id: string
  company: string
  companyEn: string
  abbr: string
  industry: string
  industryEn: string
  region: string
  regionEn: string
  challenge: string
  challengeEn: string
  solution: string
  solutionEn: string
  esgImpact: string
  esgImpactEn: string
  esgCategory: string
  year: number
  tags: string[]
  tagsEn: string[]
  color: string
}

export const casesData: CaseItem[] = [
  {
    id: '1',
    company: '商汤科技',
    companyEn: 'SenseTime',
    abbr: 'ST',
    industry: '计算机视觉',
    industryEn: 'Computer Vision',
    region: '阿联酋',
    regionEn: 'UAE',
    challenge:
      '如何在中东市场建立AI智慧城市解决方案，同时满足当地数据主权与隐私法规要求',
    challengeEn:
      'How to establish AI smart city solutions in the Middle East while meeting local data sovereignty and privacy regulations',
    solution:
      '与阿布扎比政府合作，部署完全本地化的计算机视觉平台，实现交通优化、能源管理和安防系统智能化，并在当地建立数据中心',
    solutionEn:
      'Partnered with Abu Dhabi government to deploy fully localized computer vision platform for traffic optimization, energy management, and smart security, establishing a local data center',
    esgImpact:
      '减少城市能耗15%，交通事故率下降23%，推动阿联酋2031智慧城市战略落地实施',
    esgImpactEn:
      '15% reduction in urban energy consumption, 23% decrease in traffic accidents, advancing UAE Vision 2031 smart city strategy',
    esgCategory: 'E+S',
    year: 2022,
    tags: ['智慧城市', '中东', '数据本地化', '能源节约'],
    tagsEn: ['Smart City', 'Middle East', 'Data Localization', 'Energy Saving'],
    color: '#2563EB',
  },
  {
    id: '2',
    company: '科大讯飞',
    companyEn: 'iFlytek',
    abbr: 'IF',
    industry: 'AI教育',
    industryEn: 'AI Education',
    region: '肯尼亚',
    regionEn: 'Kenya',
    challenge:
      '在教育资源匮乏的非洲市场，如何用AI解决语言障碍和教育公平问题',
    challengeEn:
      'How to use AI to address language barriers and educational equity in resource-scarce African markets',
    solution:
      '开发支持斯瓦希里语及多种非洲语言的AI教育平台，提供个性化学习路径、语音识别辅助，以低带宽优化适配农村网络环境',
    solutionEn:
      'Developed AI education platform supporting Swahili and multiple African languages, with personalized learning, speech recognition, and low-bandwidth optimization for rural networks',
    esgImpact:
      '覆盖肯尼亚50万学生，农村学生升学率提升18%，获联合国教科文组织认可',
    esgImpactEn:
      'Reached 500,000 students in Kenya, 18% improvement in rural student advancement rates, recognized by UNESCO',
    esgCategory: 'S',
    year: 2023,
    tags: ['教育公平', '非洲', '多语言AI', '普惠教育'],
    tagsEn: ['Educational Equity', 'Africa', 'Multilingual AI', 'Inclusive Education'],
    color: '#7C3AED',
  },
  {
    id: '3',
    company: '百度Apollo',
    companyEn: 'Baidu Apollo',
    abbr: 'BD',
    industry: '自动驾驶',
    industryEn: 'Autonomous Driving',
    region: '日本',
    regionEn: 'Japan',
    challenge:
      '如何将Apollo自动驾驶技术适配日本严格的道路交通法规、左舵驾驶习惯与老龄化社会出行需求',
    challengeEn:
      "How to adapt Apollo autonomous driving to Japan's strict traffic laws, left-hand driving, and mobility needs of an aging society",
    solution:
      '与本田、丰田合作进行本地化研发，针对日本道路条件优化感知算法，在东京建立本地测试中心并取得运营许可',
    solutionEn:
      'Partnered with Honda and Toyota for local R&D, optimized perception for Japanese roads, established local testing center in Tokyo with operating license',
    esgImpact:
      '预计减少交通事故30%，为老龄人口提供无障碍出行，降低城市碳排放',
    esgImpactEn:
      "Projected 30% traffic accident reduction, accessible mobility for elderly population, reduced urban carbon emissions",
    esgCategory: 'E+S',
    year: 2023,
    tags: ['自动驾驶', '日本', '交通安全', '老龄化社会'],
    tagsEn: ['Autonomous Driving', 'Japan', 'Road Safety', 'Aging Society'],
    color: '#DC2626',
  },
  {
    id: '4',
    company: '华为云',
    companyEn: 'Huawei Cloud',
    abbr: 'HW',
    industry: '云计算',
    industryEn: 'Cloud Computing',
    region: '德国',
    regionEn: 'Germany',
    challenge:
      '在欧洲最严格的数据保护（GDPR）和ESG监管环境下，建立可信赖的AI云服务并打消客户顾虑',
    challengeEn:
      "Building trusted AI cloud services under Europe's strictest data protection (GDPR) and ESG regulatory environment",
    solution:
      '在德国建立完全本地化数据中心，100%符合GDPR，推出绿色AI计算方案使用100%可再生能源，引入独立第三方安全审计',
    solutionEn:
      'Established fully localized data center in Germany, 100% GDPR compliant, launched green AI computing with 100% renewable energy, introduced independent third-party security audits',
    esgImpact:
      '数据中心PUE值1.2（行业领先水平），减少碳足迹40%，获ISO 14001环境管理认证',
    esgImpactEn:
      'Data center PUE of 1.2 (industry leading), 40% carbon footprint reduction, ISO 14001 environmental certification',
    esgCategory: 'E+G',
    year: 2022,
    tags: ['绿色计算', 'GDPR合规', '欧洲', '可再生能源'],
    tagsEn: ['Green Computing', 'GDPR Compliance', 'Europe', 'Renewable Energy'],
    color: '#059669',
  },
  {
    id: '5',
    company: '旷视科技',
    companyEn: 'Megvii',
    abbr: 'MG',
    industry: '供应链AI',
    industryEn: 'Supply Chain AI',
    region: '欧盟',
    regionEn: 'EU',
    challenge:
      '如何在欧盟AI法案（EU AI Act）监管框架下，合规开展仓储物流AI业务并保持商业竞争力',
    challengeEn:
      'How to operate warehouse logistics AI business compliantly under the EU AI Act while maintaining commercial competitiveness',
    solution:
      '重构产品架构以满足EU AI Act高风险系统要求，建立透明度报告机制、人工监督系统和可解释AI模块',
    solutionEn:
      'Restructured product architecture to meet EU AI Act high-risk requirements, established transparency reporting, human oversight systems, and explainable AI modules',
    esgImpact:
      '仓储效率提升35%，成为中国AI企业合规EU AI Act的标杆案例，获欧洲合规认证',
    esgImpactEn:
      '35% warehouse efficiency improvement, became benchmark case for Chinese AI companies complying with EU AI Act',
    esgCategory: 'G',
    year: 2024,
    tags: ['EU AI法案', '供应链', '合规治理', '可解释AI'],
    tagsEn: ['EU AI Act', 'Supply Chain', 'Governance', 'Explainable AI'],
    color: '#D97706',
  },
  {
    id: '6',
    company: '云从科技',
    companyEn: 'CloudWalk',
    abbr: 'CW',
    industry: '金融科技',
    industryEn: 'FinTech',
    region: '非洲',
    regionEn: 'Africa',
    challenge:
      '为金融基础设施薄弱的非洲国家提供普惠金融服务，同时应对生物识别数据的伦理挑战和监管要求',
    challengeEn:
      'Providing inclusive financial services for underbanked African populations while addressing biometric data ethics and regulatory requirements',
    solution:
      '部署AI身份认证系统服务无银行账户人群，与当地监管合作制定生物识别数据保护框架，建立社区数据信托机制',
    solutionEn:
      'Deployed AI identity verification for unbanked populations, collaborated with local regulators on biometric data protection framework, established community data trust mechanisms',
    esgImpact:
      '为300万非洲用户提供首个金融账户，推动金融包容性，建立负责任AI生物识别使用规范',
    esgImpactEn:
      'Provided first financial accounts to 3 million African users, promoted financial inclusion, established responsible AI biometrics standards',
    esgCategory: 'S+G',
    year: 2022,
    tags: ['普惠金融', '非洲', '负责任AI', '生物识别伦理'],
    tagsEn: ['Financial Inclusion', 'Africa', 'Responsible AI', 'Biometrics Ethics'],
    color: '#0891B2',
  },
  {
    id: '7',
    company: '地平线机器人',
    companyEn: 'Horizon Robotics',
    abbr: 'HR',
    industry: '汽车AI芯片',
    industryEn: 'Automotive AI Chips',
    region: '欧洲',
    regionEn: 'Europe',
    challenge:
      '如何让国产AI芯片打入欧洲汽车OEM供应链，满足ISO 26262功能安全标准和欧盟排放法规',
    challengeEn:
      'How to enter European automotive OEM supply chains with domestic AI chips while meeting ISO 26262 functional safety and EU emission regulations',
    solution:
      '取得ISO 26262 ASIL-D功能安全认证，与大众、Stellantis建立合作，提供集成自动驾驶和能耗优化功能的Journey 5芯片',
    solutionEn:
      'Obtained ISO 26262 ASIL-D certification, partnered with VW and Stellantis, delivered Journey 5 chip integrating autonomous driving and energy optimization',
    esgImpact:
      '助力欧洲车企减少碳排放约15%，降低ADAS成本使安全技术普及化，减少道路伤亡',
    esgImpactEn:
      '~15% carbon emission reduction for European OEMs, lowered ADAS costs to democratize safety tech, reduced road casualties',
    esgCategory: 'E+S',
    year: 2023,
    tags: ['汽车芯片', '功能安全', '欧洲OEM', 'ADAS普及'],
    tagsEn: ['Automotive Chips', 'Functional Safety', 'European OEM', 'ADAS'],
    color: '#7C3AED',
  },
  {
    id: '8',
    company: '智谱AI',
    companyEn: 'Zhipu AI',
    abbr: 'ZP',
    industry: '大语言模型',
    industryEn: 'Large Language Models',
    region: '全球',
    regionEn: 'Global',
    challenge:
      '如何在ChatGPT主导的全球LLM市场建立差异化优势，同时应对各国AI安全合规要求',
    challengeEn:
      'How to establish differentiated advantages in the ChatGPT-dominated global LLM market while meeting multi-jurisdictional AI safety compliance',
    solution:
      '开源GLM系列模型聚焦多语言与学术场景，与全球200+高校建立合作，发布AI安全白皮书并设立国际AI伦理委员会',
    solutionEn:
      'Open-sourced GLM models focusing on multilingual and academic use cases, partnered with 200+ global universities, published AI safety whitepaper and established international AI ethics committee',
    esgImpact:
      'GLM在GitHub获50万星标，推动AI知识民主化，成为新兴市场学术AI研究首选基础模型',
    esgImpactEn:
      'GLM reached 500K GitHub stars, democratized AI knowledge access, became preferred foundation model for academic AI research in emerging markets',
    esgCategory: 'S+G',
    year: 2024,
    tags: ['开源LLM', '学术合作', 'AI安全治理', '知识民主化'],
    tagsEn: ['Open Source LLM', 'Academic Collaboration', 'AI Safety', 'Knowledge Access'],
    color: '#059669',
  },
]
