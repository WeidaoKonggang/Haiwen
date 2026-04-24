# 海问 HQ — 中国 AI 企业出海与 ESG 咨询平台

> **分支：`nzh`** — 含 RAG 知识库 + 周更 Agent

海问 HQ 是一个面向中国 AI 企业的一站式出海与 ESG 合规咨询平台，集成 AI 智能问答、政策库、案例库、ESG 管理、风险评估等核心功能。本分支在原有基础上实现了基于向量数据库的 RAG 检索增强，让 AI 回答真正基于平台知识库，并通过自动化 Agent 每周同步最新政策动态。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 15 (App Router) + TypeScript |
| 样式 | Tailwind CSS |
| 国际化 | next-intl（中文 / English） |
| 认证 | Supabase Auth |
| 数据库 | Supabase PostgreSQL + pgvector |
| AI 对话 | DeepSeek Chat API（流式 SSE） |
| RAG Embedding | DeepSeek Embedding API |
| 联网搜索 | Tavily Search API |
| 定时任务 | Vercel Cron Jobs |

---

## 功能模块

### 公开区
- **营销首页**：品牌介绍、功能展示、精选案例
- **政策库**：覆盖欧盟、美国、中国、新加坡等主要市场的 AI 监管与数据保护法规
- **案例库**：中国 AI 企业出海真实案例详情
- **专家大厅**：可对接的领域专家资源
- **资源中心**：服务商与合作机构
- **AI 问答**：基于 RAG 的专业出海咨询（未登录可体验）

### 控制台（需登录）
- **数据看板**：合规评分、风险指数、ESG 分数总览
- **合规诊断**：创建诊断任务、生成诊断报告
- **风险评估**：目标市场风险分析
- **ESG 管理**：数据采集、报告生成
- **出海决策引擎**：目的地匹配与战略建议
- **方案工具集**：出海落地工具
- **企业管理中心**：账号、文档、消息、项目管理

### RAG 智能问答（nzh 分支新增）
- 用户提问先经过 DeepSeek Embedding 向量化
- 在 Supabase pgvector 中检索 Top-5 相关文档
- 将检索结果注入 System Prompt，DeepSeek 基于真实数据回答
- 向量库未就绪时静默降级，不影响正常使用

### 周更 Agent（nzh 分支新增）
- 每周一 00:00 自动触发（Vercel Cron）
- 通过 Tavily API 搜索 10 个主题的最新政策动态
- DeepSeek 总结提炼后写入向量数据库
- 覆盖：EU AI Act、GDPR、中国数据合规、ESG 执法、出口管制等

---

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/WeidaoKonggang/Haiwen.git
cd Haiwen
git checkout nzh
npm install
```

### 2. 配置环境变量

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`，填入以下变量：

```env
# Supabase（必须）
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# DeepSeek（必须，用于对话和 Embedding）
DEEPSEEK_API_KEY=sk-your-deepseek-api-key

# Tavily（周更 Agent 需要，免费注册）
TAVILY_API_KEY=tvly-your-tavily-api-key

# Cron 安全密钥（随机字符串即可）
CRON_SECRET=your-random-secret

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. 初始化 Supabase 数据库

在 [Supabase SQL Editor](https://supabase.com/dashboard) 中运行：

```
supabase/migrations/001_pgvector_rag.sql
```

此文件会创建：
- `documents` 表（向量知识库）
- `chat_sessions` / `chat_messages` 表（对话历史）
- `match_documents` 检索函数
- 相关索引与 RLS 策略

### 4. 写入初始知识库数据

```bash
npx tsx scripts/seed-rag.ts
```

此脚本将平台内所有政策、ESG 标准、案例、风险事件、专家信息向量化后写入数据库，预计耗时 1-2 分钟，花费约 ¥0.01。

### 5. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

---

## 项目结构

```
├── app/
│   ├── [locale]/               # 多语言路由（zh / en）
│   │   ├── (app)/              # 需登录的控制台区
│   │   │   ├── dashboard/      # 数据看板
│   │   │   ├── ai-chat/        # 工作台 AI 问答
│   │   │   ├── diagnosis/      # 合规诊断
│   │   │   ├── risk-assessment/# 风险评估
│   │   │   ├── esg-manage/     # ESG 管理
│   │   │   ├── decision-engine/# 出海决策引擎
│   │   │   ├── solution-tools/ # 方案工具集
│   │   │   └── enterprise-center/ # 企业管理
│   │   ├── policy-db/          # 政策库
│   │   ├── cases/              # 案例库
│   │   ├── expert-hall/        # 专家大厅
│   │   ├── resource-center/    # 资源中心
│   │   └── login/ register/    # 认证页面
│   └── api/
│       ├── chat/               # AI 对话（含 RAG）
│       ├── agent/weekly-update/# 周更 Agent
│       └── auth/callback/      # Supabase 邮件回调
├── components/
│   ├── ChatInterface.tsx        # AI 对话 UI
│   ├── Navbar.tsx               # 顶栏导航
│   ├── SideMenu.tsx             # 控制台侧边栏
│   └── LanguageSwitcher.tsx     # 语言切换
├── lib/
│   ├── embedding.ts             # DeepSeek Embedding 封装
│   ├── rag.ts                   # 向量检索核心逻辑
│   ├── mock-data.ts             # 平台静态数据
│   ├── cases-data.ts            # 案例库数据
│   └── supabase/                # Supabase 客户端
├── scripts/
│   └── seed-rag.ts              # 知识库初始化脚本
├── supabase/
│   └── migrations/
│       └── 001_pgvector_rag.sql # 数据库 Migration
├── messages/
│   ├── zh.json                  # 中文文案
│   └── en.json                  # 英文文案
└── vercel.json                  # Cron 定时任务配置
```

---

## 环境变量说明

| 变量名 | 必须 | 说明 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | 是 | Supabase 项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 是 | Supabase 匿名公钥 |
| `SUPABASE_SERVICE_ROLE_KEY` | 是（服务端写入）| Supabase 服务端私钥，勿暴露前端 |
| `DEEPSEEK_API_KEY` | 是 | DeepSeek API 密钥，同时用于对话和 Embedding |
| `TAVILY_API_KEY` | 周更 Agent 需要 | Tavily 搜索 API，免费注册 1000次/月 |
| `CRON_SECRET` | 推荐 | 保护周更接口不被未授权调用 |
| `NEXT_PUBLIC_APP_URL` | 是 | 应用访问地址 |

---

## 部署（Vercel）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

在 Vercel 控制台配置好所有环境变量后，`vercel.json` 中的 Cron 配置会自动生效，每周一 00:00 UTC 触发周更 Agent。

---

## 分支说明

| 分支 | 说明 |
|------|------|
| `main` | 基础版本，静态 Mock 数据 |
| `nzh` | 当前分支，含 RAG 向量检索 + 周更 Agent |
