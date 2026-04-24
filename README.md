# 海问 HQ — 中国 AI 企业出海与 ESG 咨询平台

> **分支：`nzh`** — 含 RAG 知识库 + 周更 Agent + 最新动态页
>
> For English documentation see [`README.en.md`](./README.en.md).

海问 HQ 是一个面向中国 AI 企业的一站式出海与 ESG 合规咨询平台，集成 AI 智能问答、政策库、案例库、ESG 管理、风险评估等核心功能。本分支在原有基础上：

- **基于向量数据库的 RAG 检索增强**，让 AI 回答真正基于平台知识库，并自带引用来源
- **每周自动更新的新闻 Agent**，定时抓取监管动态、自动去重、写入向量库
- **「最新动态」前台页**，让自动采集的资讯被用户直接看到

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
| RAG Embedding | Zhipu GLM `embedding-3` @ 1024 维（可切换 OpenAI / SiliconFlow / DeepSeek） |
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
- **最新动态** ⭐ *（nzh 新增）*：周更 Agent 自动采集的全球监管动态，支持按地区 / 标签过滤、"立即刷新"按钮
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
- 用户提问先经过 Zhipu Embedding 向量化（1024 维）
- 在 Supabase pgvector 中做**多样化检索**：主检索 Top-5 + 强制补 2 条案例 + 1 条专家，保证 policy / case / expert 三类都能出现
- 将检索结果注入 System Prompt，强制 LLM 在正文中用小括号标注来源（如 `（参考：EU AI Act政策条目）`），并在结尾给出"推荐进一步了解"
- 向量库未就绪时静默降级，不影响正常使用
- Dev server 终端会实时打印命中条目与相似度，便于观察 RAG 是否真的生效

### 周更 Agent（nzh 分支新增）
- 每周一 00:00 自动触发（Vercel Cron）
- 通过 Tavily API 搜索 10 个主题的最新政策动态，覆盖：EU AI Act、GDPR、CSRD、中国 AI 监管、中国数据合规、新加坡 PDPA、ESG 执法、AI 出海动态、ISSB、美国出口管制
- DeepSeek 总结提炼后写入向量数据库，自动被 RAG 和 `/trends` 页面消费
- **三层去重机制** ⭐：
  1. 同一 `tag` + 同一天已有记录 → 直接跳过（幂等）
  2. 每个 `tag` 只保留最近 4 条，更老的自动删除（容量控制）
  3. 接口返回 `success / skipped / failed / pruned` 四个计数

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

编辑 `.env.local`，填入：

```env
# Supabase（必须）
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # 服务端写入用，勿暴露前端

# DeepSeek（必须，用于对话）
DEEPSEEK_API_KEY=sk-your-deepseek-api-key

# Embedding Provider（默认智谱 GLM，国内稳定、中文友好）
EMBEDDING_PROVIDER=zhipu
EMBEDDING_MODEL=embedding-3
ZHIPU_API_KEY=your-zhipu-api-key

# Tavily Search API（周更 Agent 需要，免费 1000 次/月）
TAVILY_API_KEY=tvly-your-tavily-api-key

# Cron 内部调用密钥（随机字符串即可）
CRON_SECRET=your-random-secret

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> 想用别的 embedding 模型？把 `EMBEDDING_PROVIDER` 改成 `openai` / `siliconflow` / `deepseek`，再填对应 API key 即可。代码内部会强制把向量维度对齐到 1024（pgvector ivfflat 索引上限）。

### 3. 初始化 Supabase 数据库

在 [Supabase SQL Editor](https://supabase.com/dashboard) 中一次性执行：

```
supabase/migrations/000_setup_all.sql
```

此文件会创建 / 重建：
- `documents` 表（向量知识库，`vector(1024)`）
- `chat_sessions` / `chat_messages` 表（对话历史）
- `match_documents` 检索函数
- ivfflat 向量索引、RLS 策略、更新触发器

> 老库升级、不想 drop 的话，看 `MERGING_FROM_NZH.md` 里的增量迁移方案（`002_set_embedding_dim.sql` / `003_resize_to_2048.sql`）。

### 4. 写入初始知识库

```bash
npx tsx scripts/seed-rag.ts
```

把平台内所有政策、ESG 标准、案例、风险事件、专家信息向量化后写入数据库。预计 1–2 分钟，花费 < ¥0.01。

### 5. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)。可以：

- 打开 **AI 问答**，提个合规问题 → 终端应打印 `[RAG] 命中 X 条文档…` 日志
- 打开 **/trends**，点"立即刷新"触发一次周更 Agent（首次约 3 分钟，之后同一天再点会秒跳过）

---

## 项目结构

```
├── app/
│   ├── [locale]/                    # 多语言路由（zh / en）
│   │   ├── (app)/                   # 需登录的控制台区
│   │   │   ├── dashboard/
│   │   │   ├── ai-chat/
│   │   │   ├── diagnosis/
│   │   │   ├── risk-assessment/
│   │   │   ├── esg-manage/
│   │   │   ├── decision-engine/
│   │   │   ├── solution-tools/
│   │   │   └── enterprise-center/
│   │   ├── policy-db/               # 政策库
│   │   ├── cases/                   # 案例库
│   │   ├── expert-hall/             # 专家大厅
│   │   ├── resource-center/         # 资源中心
│   │   ├── trends/                  # ⭐ 最新动态（nzh 新增）
│   │   └── login/ register/
│   └── api/
│       ├── chat/                    # AI 对话（含 RAG 多样化检索）
│       ├── news/                    # ⭐ /trends 用的新闻列表接口
│       ├── agent/weekly-update/     # 周更 Agent（含三层去重）
│       └── auth/callback/
├── components/
│   ├── ChatInterface.tsx            # AI 对话 UI（含滚动体验修复）
│   ├── Navbar.tsx
│   ├── SideMenu.tsx
│   └── LanguageSwitcher.tsx
├── lib/
│   ├── embedding.ts                 # 多 provider Embedding 封装
│   ├── rag.ts                       # 向量检索 + 多样化策略 + 去重工具
│   ├── mock-data.ts
│   ├── cases-data.ts
│   └── supabase/                    # Supabase 客户端
├── scripts/
│   └── seed-rag.ts                  # 知识库初始化脚本
├── supabase/
│   └── migrations/
│       ├── 000_setup_all.sql        # ⭐ 总装脚本，新库一次跑完
│       ├── 001_pgvector_rag.sql     # 老的基础迁移（保留备查）
│       ├── 002_set_embedding_dim.sql
│       └── 003_resize_to_2048.sql
├── messages/
│   ├── zh.json
│   └── en.json
├── vercel.json                      # Cron 定时任务
├── README.md                        # 本文件（中文）
├── README.en.md                     # English README
├── CHANGELOG.md                     # ⭐ nzh 分支迭代日志
└── MERGING_FROM_NZH.md              # ⭐ 给原作者的合并手册
```

---

## 环境变量说明

| 变量名 | 必须 | 说明 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | 是 | Supabase 项目 URL（**不要**带 `/rest/v1` 后缀） |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 是 | Supabase 匿名公钥 |
| `SUPABASE_SERVICE_ROLE_KEY` | 是（服务端写入） | Supabase 服务端私钥，勿暴露前端 |
| `DEEPSEEK_API_KEY` | 是 | DeepSeek API 密钥（对话 + 新闻总结） |
| `EMBEDDING_PROVIDER` | 是 | `zhipu`（默认） / `openai` / `siliconflow` / `deepseek` |
| `EMBEDDING_MODEL` | 是 | 对应 provider 的模型名，如 Zhipu 的 `embedding-3` |
| `ZHIPU_API_KEY` | provider=zhipu 时必须 | 智谱 GLM API 密钥 |
| `OPENAI_API_KEY` | provider=openai 时必须 | OpenAI API 密钥 |
| `SILICONFLOW_API_KEY` | provider=siliconflow 时必须 | SiliconFlow API 密钥 |
| `TAVILY_API_KEY` | 周更 Agent 需要 | Tavily 搜索 API，免费 1000 次/月 |
| `CRON_SECRET` | 推荐 | 保护周更接口不被未授权调用 |
| `NEXT_PUBLIC_APP_URL` | 是 | 应用访问地址（用于邮件回调等） |

---

## 部署（Vercel）

```bash
npm i -g vercel
vercel --prod
```

在 Vercel 控制台把上面所有环境变量配置好后，`vercel.json` 中的 Cron 配置会自动生效：

- 每周一 00:00 UTC 自动触发 `POST /api/agent/weekly-update`
- Agent 内部会自动去重：首次写入 10 条，之后每周最多增补 10 条并清理超过 4 条的旧新闻
- 跑完后 `/trends` 页面立即可见新内容

---

## 常用操作

| 我想… | 怎么做 |
|---|---|
| 查看 RAG 是否生效 | 问 AI 后看 dev server 终端的 `[RAG] 命中 X 条文档` 日志 |
| 手动触发一次周更 | 访问 `/trends` 点"立即刷新"，或者 `curl -X POST /api/agent/weekly-update -H "Authorization: Bearer $CRON_SECRET"` |
| 加一条自定义知识库条目 | 改 `lib/mock-data.ts` / `lib/cases-data.ts` 后重跑 `npx tsx scripts/seed-rag.ts` |
| 切换 embedding 模型 | 改 `.env.local` 的 `EMBEDDING_PROVIDER` + 对应 key，重跑 seed 脚本（向量不兼容，必须重灌） |
| 调整"每个 tag 保留几条" | 改 `app/api/agent/weekly-update/route.ts` 顶部的 `KEEP_PER_TAG` |
| 调 RAG 相似度阈值 / 条数 | 改 `app/api/chat/route.ts` 里的 `retrieveDiverseContext` 调用参数 |

---

## 文档索引

| 文件 | 给谁看 | 作用 |
|---|---|---|
| `README.md` | 中文同事 / 合作者 | 项目整体介绍（你正在看） |
| `README.en.md` | English speakers | English version of this README |
| `CHANGELOG.md` | 所有协作者 | `nzh` 分支每轮迭代日志，倒序记录 |
| `MERGING_FROM_NZH.md` | 原作者 / 上游 | 把 `nzh` 合回 `main` 的详细操作手册（SQL、env、验证、回滚） |

---

## 分支说明

| 分支 | 说明 |
|------|------|
| `main` | 基础版本，静态 Mock 数据 |
| `nzh` | **当前分支**，含 RAG 向量检索 + 周更 Agent + 最新动态页 + 新闻去重 |
