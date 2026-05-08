// 学术顾问、学术导师、业界导师
// 照片来自「ESG30 青年学者计划第二期（2025-2026）」官网（财新智库）
// https://promote.caixin.com/esg30-young-scholars-2025/

export interface MentorItem {
  name: string
  nameEn: string
  title: string
  titleEn: string
  photo: string
}

/** 学术顾问（Academic Advisors） */
export const academicAdvisors: MentorItem[] = [
  {
    name: '屠光绍',
    nameEn: 'Tu Guangshao',
    title: '上海交通大学上海高级金融学院创院理事长',
    titleEn: 'Founding Chairman, SAIF, Shanghai Jiao Tong University',
    photo: 'https://img.caixin.com/2025-07-16/175266014446725.jpg',
  },
  {
    name: '刘世锦',
    nameEn: 'Liu Shijin',
    title: '国务院发展研究中心原副主任',
    titleEn: 'Former Deputy Director, Development Research Center of the State Council',
    photo: 'https://img.caixin.com/2025-07-16/175266013603595.jpg',
  },
  {
    name: '陈文辉',
    nameEn: 'Chen Wenhui',
    title: '原中国银保监会副主席，全国社保基金理事会原副理事长',
    titleEn: 'Former Vice Chairman, CBIRC; Former Vice Chairman, National Council for Social Security Fund',
    photo: 'https://img.caixin.com/2025-07-16/175266014718888.jpg',
  },
  {
    name: '贺克斌',
    nameEn: 'He Kebin',
    title: '中国工程院院士，清华大学环境学院教授',
    titleEn: 'Academician, Chinese Academy of Engineering; Professor, School of Environment, Tsinghua University',
    photo: 'https://img.caixin.com/2025-07-16/175266013683216.jpg',
  },
]

/** 学术导师（Academic Mentors） */
export const academicMentors: MentorItem[] = [
  {
    name: '卢海',
    nameEn: 'Lu Hai',
    title: '北京大学光华管理学院教授',
    titleEn: 'Professor, Guanghua School of Management, Peking University',
    photo: 'https://img.caixin.com/2025-07-16/175266013760425.jpg',
  },
  {
    name: '陈玲',
    nameEn: 'Chen Ling',
    title: '清华大学公共管理学院教授，清华大学产业发展与环境治理研究中心主任',
    titleEn: 'Professor, School of Public Policy and Management, Tsinghua University; Director, CIDEG',
    photo: 'https://img.caixin.com/2025-07-16/175266014311627.jpg',
  },
  {
    name: '王遥',
    nameEn: 'Wang Yao',
    title: '中央财经大学绿色金融国际研究院院长',
    titleEn: 'Dean, IIGF, Central University of Finance and Economics',
    photo: 'https://img.caixin.com/2025-07-16/175266014586473.jpg',
  },
]

/** 业界导师（Industry Mentors） */
export const industryMentors: MentorItem[] = [
  {
    name: '武雅斌',
    nameEn: 'Wu Yabin',
    title: '世界经济理事会特使兼中国国别代表',
    titleEn: 'Envoy & China Country Representative, World Economic Council',
    photo: 'https://img.caixin.com/2025-07-16/175266013842418.jpg',
  },
  {
    name: '谢阳军',
    nameEn: 'Xie Yangjun',
    title: '丝路国际产能合作促进中心主任',
    titleEn: 'Director, Silk Road International Industrial Capacity Cooperation Center',
    photo: 'https://img.caixin.com/2025-07-16/175266014666624.jpg',
  },
  {
    name: '梅德文',
    nameEn: 'Mei Dewen',
    title: '北京绿色交易所总经理、北京绿色金融协会秘书长',
    titleEn: 'General Manager, Beijing Green Exchange; Secretary-General, Beijing Green Finance Association',
    photo: 'https://img.caixin.com/2026-02-03/177010611123399.jpg',
  },
  {
    name: '李瑾',
    nameEn: 'Li Jin',
    title: '上海环境能源交易所副总经理',
    titleEn: 'Vice President, Shanghai Environment and Energy Exchange',
    photo: 'https://img.caixin.com/2025-11-12/176294375387359.jpg',
  },
  {
    name: '杨冬梅',
    nameEn: 'Yang Dongmei',
    title: '易方达基金副总经理',
    titleEn: 'Vice President, E Fund Management',
    photo: 'https://img.caixin.com/2025-07-16/175266015104679.jpg',
  },
  {
    name: '王会文',
    nameEn: 'Wang Huiwen',
    title: '联想集团副总裁、全球电脑与智能设备首席质量官',
    titleEn: 'VP & CQO of Global PC and Smart Devices, Lenovo Group',
    photo: 'https://img.caixin.com/2025-07-16/175266014866554.jpg',
  },
  {
    name: '陈刚',
    nameEn: 'Chen Gang',
    title: '东方证券副总裁',
    titleEn: 'Vice President, Orient Securities',
    photo: 'https://img.caixin.com/2025-11-12/176294342560217.jpg',
  },
  {
    name: '杨娟',
    nameEn: 'Yang Juan',
    title: '香港永明金融有限公司人寿及康健业务副行政总裁',
    titleEn: 'Deputy CEO, Life and Health, Sun Life Hong Kong',
    photo: 'https://img.caixin.com/2025-11-13/176300192392573.jpg',
  },
  {
    name: '张轶鹏',
    nameEn: 'Zhang Yipeng',
    title: '伊利集团副总裁',
    titleEn: 'Vice President, Yili Group',
    photo: 'https://img.caixin.com/2025-07-16/175266015136224.jpg',
  },
  {
    name: '商容',
    nameEn: 'Shang Rong',
    title: '中关村人工智能研究院对外事务部部长，前微软亚太研发集团副总裁',
    titleEn: 'Head of External Affairs, Zhongguancun AI Institute; Former VP, Microsoft Asia-Pacific R&D Group',
    photo: 'https://img.caixin.com/2025-07-16/175266015192591.jpg',
  },
  {
    name: '孙捷',
    nameEn: 'Sun Jie',
    title: '远景科技集团首席可持续发展官',
    titleEn: 'Chief Sustainability Officer, Envision Group',
    photo: 'https://img.caixin.com/2025-07-16/175266013169336.jpg',
  },
]

/** 支持的企业与机构（通过 ESG30 青年学者计划、财新智库、中国 ESG30 人论坛网络建立） */
export const supportingEnterprises: { zh: string; en: string }[] = [
  { zh: '字节跳动', en: 'ByteDance' },
  { zh: '腾讯', en: 'Tencent' },
  { zh: '联想集团', en: 'Lenovo Group' },
  { zh: '蚂蚁集团', en: 'Ant Group' },
  { zh: '平安集团', en: 'Ping An Group' },
  { zh: '蔚来', en: 'NIO' },
  { zh: '中国建设银行', en: 'China Construction Bank' },
  { zh: '浦发银行', en: 'SPD Bank' },
  { zh: '易方达基金', en: 'E Fund Management' },
  { zh: '银华基金', en: 'Yinhua Fund' },
  { zh: '东方证券', en: 'Orient Securities' },
  { zh: '永明金融', en: 'Sun Life Financial' },
  { zh: '标普全球', en: 'S&P Global' },
  { zh: '南方基金', en: 'China Southern Asset Management' },
  { zh: '远景科技', en: 'Envision Group' },
]

export const supportingInstitutions: { zh: string; en: string }[] = [
  { zh: '北京大学光华管理学院', en: 'Guanghua School of Management, Peking University' },
  { zh: '清华大学产业发展与环境治理研究中心', en: 'CIDEG, Tsinghua University' },
  {
    zh: '中国标准化协会可持续商业与品牌工作委员会',
    en: 'Sustainable Business & Brand Committee, China Association for Standardization',
  },
  {
    zh: '上海交通大学国际与公共事务学院',
    en: 'School of International and Public Affairs, SJTU',
  },
  {
    zh: '新加坡国立大学李光耀公共政策学院',
    en: 'Lee Kuan Yew School of Public Policy, NUS',
  },
  {
    zh: '香港中文大学（深圳）人文社科学院',
    en: 'School of Humanities and Social Science, CUHK-Shenzhen',
  },
  {
    zh: '新加坡管理大学综合研究学院',
    en: 'College of Integrative Studies, SMU',
  },
]

/** 核心团队（Session 2, Group 13） */
export interface TeamMember {
  id: string
  name: string
  nameEn: string
  role: string
  roleEn: string
  responsibility: string
  responsibilityEn: string
  department: 'leadership' | 'product' | 'mobile' | 'content' | 'frontend' | 'backend'
  initial: string
  color: string
}

export const teamMembers: TeamMember[] = [
  {
    id: '2362310',
    name: '刘凡沛',
    nameEn: 'Liu Fanpei',
    role: '创始人 & 团队领导',
    roleEn: 'Founder & Team Lead',
    responsibility: '产品战略、项目管理、用户调研、对外合作',
    responsibilityEn: 'Product strategy · Project management · User research · External partnerships',
    department: 'leadership',
    initial: '凡',
    color: '#2563EB',
  },
  {
    id: '2362956',
    name: '胡时',
    nameEn: 'Hu Shi',
    role: '产品设计负责人',
    roleEn: 'Head of Product Design',
    responsibility: '交互设计、视觉体系、用户体验、界面原型',
    responsibilityEn: 'UX/UI design · Visual system · Interaction flow · Prototyping',
    department: 'product',
    initial: '时',
    color: '#7C3AED',
  },
  {
    id: '2361750',
    name: '周嘉禾',
    nameEn: 'Zhou Jiahe',
    role: '移动端开发负责人',
    roleEn: 'Mobile App Lead',
    responsibility: '移动应用架构、跨平台开发、设备适配',
    responsibilityEn: 'Mobile architecture · Cross-platform delivery · Device adaptation',
    department: 'mobile',
    initial: '禾',
    color: '#0891B2',
  },
  {
    id: '2360758',
    name: '锁川岳',
    nameEn: 'Suo Chuanyue',
    role: '内容与运营负责人',
    roleEn: 'Content & Operations Lead',
    responsibility: '品牌文案、市场传播、用户教育、案例库撰稿',
    responsibilityEn: 'Brand copy · Marketing · User education · Case library editorial',
    department: 'content',
    initial: '岳',
    color: '#DB2777',
  },
  {
    id: '2363146',
    name: '刘恒显',
    nameEn: 'Liu Hengxian',
    role: '前端开发负责人',
    roleEn: 'Frontend Engineering Lead',
    responsibility: 'Web 前端架构、多语言国际化、RAG 交互界面、性能优化',
    responsibilityEn: 'Web frontend · i18n · RAG chat interface · Performance',
    department: 'frontend',
    initial: '显',
    color: '#059669',
  },
  {
    id: '2362964',
    name: '聂子皓',
    nameEn: 'Nie Zihao',
    role: '后端开发负责人',
    roleEn: 'Backend Engineering Lead',
    responsibility: '向量数据库、周更 Agent、Supabase 架构、API 设计',
    responsibilityEn: 'Vector DB · Weekly agent · Supabase backend · API design',
    department: 'backend',
    initial: '皓',
    color: '#EA580C',
  },
]

/** 迭代时间线（2026 年 2 月 ~ 5 月） */
export interface TimelineItem {
  month: string
  monthEn: string
  title: string
  titleEn: string
  desc: string
  descEn: string
}

export const iterationTimeline: TimelineItem[] = [
  {
    month: '2026 年 2 月',
    monthEn: 'February 2026',
    title: '立项与问题定义',
    titleEn: 'Project Kickoff & Problem Framing',
    desc:
      '锁定「中国 AI 企业出海与 ESG 合规」这一真实痛点，完成首轮桌面研究并提交 Project Brief。',
    descEn:
      'Scoped the real pain point of Chinese AI enterprises going global under ESG compliance pressure; completed initial desk research and submitted the Project Brief.',
  },
  {
    month: '2026 年 3 月',
    monthEn: 'March 2026',
    title: '原型与信息架构',
    titleEn: 'Prototyping & Information Architecture',
    desc:
      '搭建 Next.js + Supabase 基础工程，完成八大模块线框图与双语文案；构建初版政策库、案例库与专家大厅。',
    descEn:
      'Built the Next.js + Supabase skeleton; produced wireframes and bilingual copy for eight modules; shipped v1 of policy DB, case library and expert hall.',
  },
  {
    month: '2026 年 4 月上旬',
    monthEn: 'Early April 2026',
    title: '用户调研与问题验证',
    titleEn: 'User Research & Problem Validation',
    desc:
      '发放《用户调研问卷》，覆盖企业管理者、AI 创业者、ESG 负责人、学生与学者群体；回收数据驱动后续产品迭代。',
    descEn:
      'Distributed the User Research Survey covering enterprise managers, AI founders, ESG officers, students and academics; findings drove subsequent iterations.',
  },
  {
    month: '2026 年 4 月中下旬',
    monthEn: 'Mid-to-late April 2026',
    title: 'RAG 知识库与引用机制',
    titleEn: 'RAG Knowledge Base with Citations',
    desc:
      '基于 pgvector 搭建 1024 维向量库；接入智谱 GLM Embedding；多样化检索（策略/案例/专家）并强制 LLM 引用来源。',
    descEn:
      'Built a 1024-dim pgvector store with Zhipu GLM embeddings; implemented diversified retrieval (policy/case/expert) and enforced citation in LLM answers.',
  },
  {
    month: '2026 年 4 月末',
    monthEn: 'Late April 2026',
    title: '周更 Agent 与最新动态',
    titleEn: 'Weekly Agent & Trends Feed',
    desc:
      '上线每周一自动运行的 Agent（Tavily + DeepSeek 总结），覆盖 10 类全球 AI 监管与 ESG 主题，三层去重保证知识库稳定。',
    descEn:
      'Shipped a Monday-00:00-UTC cron agent (Tavily + DeepSeek summarization) covering 10 global AI-regulation and ESG topics, with 3-layer deduplication.',
  },
  {
    month: '2026 年 5 月',
    monthEn: 'May 2026',
    title: '走向 Demo Day',
    titleEn: 'Road to Demo Day',
    desc:
      '根据用户反馈打磨首页叙事、游客 60 秒体验路径、引用可视化；整合真实团队身份与外部导师支持网络。',
    descEn:
      'Polished the homepage narrative, the 60-second guest trial journey, and citation visualisation based on user feedback; surfaced the real team identity and external mentor network.',
  },
]
