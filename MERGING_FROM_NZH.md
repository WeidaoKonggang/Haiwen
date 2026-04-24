# 原作者合并 `nzh` 分支更新指南

> 面向对象：**项目原作者**（`WeidaoKonggang/Haiwen` 仓库维护者）
> 目的：把 `nzh` 分支上新增的 **RAG + 周更 Agent + Citation** 功能合并到主仓库，并顺利上线。

---

## 0. 一句话概括

`nzh` 分支在不破坏任何原有功能的前提下，新增了一套 **RAG 检索增强** 能力：AI 问答会先从 Supabase 向量库中检索政策 / 案例 / 专家条目，再用这些真实资料作答，回答里带有 `(参考：xxx)` 引用。额外还提供了一个 **每周一自动联网搜索最新政策并写入向量库** 的 Agent。

**合并后，你需要做 3 件事**：
1. 合并代码（Git）
2. 在 Supabase 执行一段 SQL 建表
3. 加 3 ~ 5 个新的环境变量

其他老功能、老数据、老 UI 完全不受影响——如果向量库没建好，RAG 链路会**静默降级**成普通 AI 问答。

---

## 1. 本次更新包含哪些改动

### 新增文件

| 文件 | 作用 |
|------|------|
| `lib/embedding.ts` | 统一的 Embedding 封装，支持 Zhipu / OpenAI / SiliconFlow / DeepSeek 四家 Provider |
| `lib/rag.ts` | 向量检索核心：基础检索 + 多样化检索（保证政策+案例+专家共存）+ 写库函数 |
| `app/api/agent/weekly-update/route.ts` | 周更 Agent：Tavily 搜索 → DeepSeek 总结 → 向量化 → 写库 |
| `scripts/seed-rag.ts` | 首次初始化：把 mock-data 里的政策 / ESG / 案例 / 风险 / 专家数据全部向量化写入 |
| `scripts/test-embedding.ts` | 连通性测试脚本（不碰数据库，仅验证 Embedding API 是否通） |
| `supabase/migrations/000_setup_all.sql` | **一键建库脚本**（推荐执行这个） |
| `supabase/migrations/001_pgvector_rag.sql` | 初版分步 migration（已被 000 合并，保留作记录） |
| `supabase/migrations/002_set_embedding_dim.sql` | 过渡版（1024 维调整） |
| `supabase/migrations/003_resize_to_2048.sql` | 过渡版（2048 维尝试，已废弃） |
| `vercel.json` | Vercel Cron 配置：每周一 00:00 UTC 触发周更 |
| `MERGING_FROM_NZH.md` | 本文件 |

### 修改文件

| 文件 | 修改点 |
|------|--------|
| `app/api/chat/route.ts` | 在发送给 DeepSeek 前插入 RAG 检索；Prompt 追加 4 条「引用规则」；添加结构化调试日志 |
| `components/ChatInterface.tsx` | 修复了流式输出时「整页被往上拽」的 UX bug（改用容器内 `scrollTop`，并支持「用户上滑时暂停自动跟随」） |
| `.env.local.example` | 新增 Zhipu / Service-Role / Tavily / Cron 相关变量 |
| `package.json` | 新增开发依赖 `dotenv`、`tsx`（仅脚本使用，运行时不引入） |

---

## 2. 合并代码（Git）

### 方式 A：直接合并分支（推荐）

```bash
# 拉取最新 nzh 分支
git fetch origin nzh

# 切到主干
git checkout main

# 合并 nzh（建议用 --no-ff 保留合并记录）
git merge --no-ff origin/nzh -m "merge: integrate RAG + weekly-update agent from nzh"
```

如有冲突：`package.json`、`.env.local.example`、`app/api/chat/route.ts` 最容易冲突，按 `nzh` 版本为准合并即可（它们的旧逻辑都兼容保留）。

### 方式 B：通过 Pull Request 走 Code Review（更规范）

```bash
# 在 GitHub 仓库页面点 Compare & Pull Request
# base: main  ←  compare: nzh
# 审阅后 Squash merge 或 Merge commit 到 main
```

### 方式 C：只挑需要的提交（不推荐，容易漏）

```bash
git log origin/nzh --oneline   # 列出 nzh 的提交
git cherry-pick <commit-hash>  # 挑选要的
```

---

## 3. Supabase 数据库初始化（必做一次）

### 3.1 打开 SQL Editor

Supabase 控制台 → 你的项目 → **SQL Editor** → **+ New query**

### 3.2 复制并执行 `supabase/migrations/000_setup_all.sql`

把整个文件的内容粘进去，点 **Run**。看到 `Success. No rows returned` 即完成。

该脚本会创建：
- `documents` 表（带 `vector(1024)` 嵌入列）
- `chat_sessions` / `chat_messages` 表（为将来持久化对话历史预留）
- `match_documents()` RPC 函数（向量相似度查询）
- `ivfflat` 索引 + `updated_at` 触发器
- RLS 策略（`documents` 对所有人可读，仅 `service_role` 可写）

> **为什么选 1024 维？** pgvector 的 `ivfflat` 索引硬上限是 2000 维。Zhipu `embedding-3` 默认 2048 维会超限，代码里已通过 `dimensions: 1024` 参数显式压到 1024，既能建索引、效果又比 `embedding-2` 好。

### 3.3 ⚠️ 重要：如果是**既有 Supabase 项目**

`000_setup_all.sql` 开头会 `drop table if exists documents cascade`，会清空任何已有同名表。如果你本来就有 `documents` 表且里面有别的数据，请改用以下两种方式之一：

1. **只跑单独 migration**：手动执行 `supabase/migrations/001_pgvector_rag.sql` 里**未创建过的部分**（`match_documents` 函数、`chat_sessions`、`chat_messages`、RLS 等）
2. **备份后重建**：先 `pg_dump` 备份，再跑 `000`，最后 restore

---

## 4. 环境变量更新

编辑 Vercel / 本地 `.env.local` 两边的变量。

### 4.1 必填新增变量

```env
# ─── Supabase 服务端写入（必须新增）───
# 从 Supabase → Settings → API → service_role → Reveal 获取
# ⚠️ 绝对不能暴露在前端代码/公开仓库
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ─── Embedding Provider（必须新增）───
EMBEDDING_PROVIDER=zhipu
EMBEDDING_MODEL=embedding-3
ZHIPU_API_KEY=your-zhipu-api-key
# 申请地址：https://open.bigmodel.cn/usercenter/apikeys
# 按量计费，100 万 tokens 约 ¥0.5，新用户一般送代金券
```

### 4.2 周更 Agent 需要（选填，想要每周自动更新再加）

```env
# Tavily 搜索 API（免费 1000 次/月，够用 100 周）
# 申请地址：https://tavily.com
TAVILY_API_KEY=tvly-xxxxxxxxxxxx

# 保护周更接口不被乱调用，随便生成一段长字符串即可
# 生成：openssl rand -hex 32
CRON_SECRET=your-random-long-string
```

### 4.3 Vercel 线上同步

Vercel 控制台 → 项目 → **Settings** → **Environment Variables** → 把上面几个全部加上，**记得选中 Production + Preview + Development 三个环境**。

加完后，下一次部署会自动带上这些变量。如果不想重新 deploy，可以在 Deployments 页找最新一次部署 → **Redeploy**。

---

## 5. 初始化知识库（首次必做）

在**合并代码 + 跑完 SQL + 配好环境变量**之后，在本地执行：

```bash
npm install             # 安装新增依赖 dotenv / tsx
npx tsx scripts/test-embedding.ts   # 先测 Embedding 连通性
npx tsx scripts/seed-rag.ts         # 把 mock 数据全部向量化写入
```

`seed-rag.ts` 会写入约 36 条数据（10 政策 + 5 ESG + 8 案例 + 5 风险 + 8 专家），耗时 1~2 分钟，Zhipu Embedding 大概消耗不到 ¥0.01。

期望输出：

```
Provider: zhipu | 期望向量维度: 1024
[1/5] 写入政策库 (10 条)
  向量化: 政策名称：欧盟人工智能法案（EU AI Act）...
...
=== 全部写入完成 ===
```

> **脚本只需要跑一次**。后续如果 `lib/mock-data.ts` 更新了，或者想清库重灌，再跑一次即可（`upsertDocument` 是 upsert，重复跑不会重复写）。

---

## 6. 验证合并后是否工作

### 6.1 本地启动

```bash
npm run dev
```

### 6.2 打开 AI 问答页面，输入

> 欧盟 AI 法案对中国 AI 企业有哪些合规要求？

### 6.3 看 dev server 终端应该有类似日志

```
========== [RAG] ==========
[RAG] Query: 欧盟AI法案对中国AI企业有哪些合规要求？
[RAG] 命中 8 条文档（主检索 + 案例 + 专家）
  1. [79.4%] <policy>  EU AI Act 政策条目
  2. [74.4%] <risk>    EU AI Act 合规截止期风险事件
  ...
  6. [72.4%] <case>    旷视科技出海欧盟案例
  7. [69.5%] <expert>  张明博士
===========================
```

### 6.4 看 AI 回答里应该含**内联引用**

> 欧盟AI法案采用基于风险的分级管理框架**（参考：EU AI Act政策条目）**……
> 如需深入了解，可参考**旷视科技**出海欧盟的实践经验……

如果看到括号引用、具体日期（如 `2025-08-01 合规截止`）、具体金额（`3500 万欧元罚款`）、具体人名（张明博士等）——说明 RAG 完全打通。

---

## 7. 周更 Agent 部署验证（可选）

### 7.1 自动调度

部署到 Vercel 后，`vercel.json` 中的 Cron 会自动生效：**每周一 00:00 UTC（北京时间 08:00）** 触发 `/api/agent/weekly-update`。

### 7.2 手动触发（测试）

```bash
curl -X POST https://your-domain.vercel.app/api/agent/weekly-update \
  -H "Authorization: Bearer $CRON_SECRET"
```

或者本地：

```bash
curl -X POST http://localhost:3000/api/agent/weekly-update \
  -H "Authorization: Bearer your-local-CRON_SECRET"
```

返回：

```json
{
  "message": "周更完成",
  "success": 10,
  "failed": 0,
  "errors": [],
  "timestamp": "2026-04-24T..."
}
```

执行完后，Supabase 的 `documents` 表会新增 10 条 `metadata.type = 'news'` 的最新动态。

---

## 8. 常见问题

### Q1: 合并后 AI 问答回答变慢？
A: RAG 会先做一次 Embedding + 向量查询，约多耗 300~600ms。可接受；若嫌慢，可把 `app/api/chat/route.ts` 里 `mainCount` 从 5 调为 3。

### Q2: 向量库还没建好就已经部署了怎么办？
A: 没事。`lib/rag.ts` 中 `retrieveContext` 遇到任何错误会静默 `return []`，`chat` API 就等价于纯 LLM 问答，老功能不受影响。

### Q3: 我不想用 Zhipu，能换 OpenAI 吗？
A: 能。改 `.env.local`：
```env
EMBEDDING_PROVIDER=openai
EMBEDDING_MODEL=text-embedding-3-small
OPENAI_API_KEY=sk-xxx
```
`text-embedding-3-small` 是 1536 维，需要同步把 SQL 里的 `vector(1024)` 改成 `vector(1536)` 并重建索引。

### Q4: Tavily 免费额度用完了怎么办？
A: 免费 1000 次/月，当前周更配置 10 主题 × 4 周 = 40 次/月，远远不到上限。如果想扩主题，可以减少到每两周跑一次，改 `vercel.json` 中的 cron 表达式为 `0 0 */14 * *`。

### Q5: `seed-rag.ts` 报 `supabaseUrl is required`？
A: 脚本默认只读 `.env.local`。确保你在项目根目录执行，且 `.env.local` 里 `NEXT_PUBLIC_SUPABASE_URL` 存在（注意不要在 URL 尾部加 `/rest/v1/`）。

### Q6: `ivfflat index` 报 `column cannot have more than 2000 dimensions`？
A: 用了超过 2000 维的模型（如 OpenAI `text-embedding-3-large` 3072 维）。要么用 `dimensions` 参数压到 2000 以下，要么换 pgvector 的 `hnsw` 索引（也是 2000 上限，只是更快）。本项目默认的 Zhipu `embedding-3 @ 1024 维` 不会遇到这个问题。

---

## 9. 回滚方案

如果上线后发现问题，回滚非常简单：

```bash
# 1. Git 层面
git revert <merge-commit-hash>
git push

# 2. Vercel 会自动重新部署
# 3. Supabase 数据库不必回滚（老代码不会查新表，新表在那也没关系）
# 4. 如果想彻底清理 Supabase：
#    在 SQL Editor 执行
drop table if exists documents cascade;
drop table if exists chat_messages cascade;
drop table if exists chat_sessions cascade;
drop function if exists match_documents(vector, int, text);
```

---

## 10. 后续可优化方向（留给原作者参考）

- [ ] 前端展示引用来源（把 `(参考：xxx)` 渲染成可点击链接，跳转到政策库/案例库对应条目）
- [ ] 把 `lib/mock-data.ts` 的政策/案例做成 CMS 可编辑，编辑后自动触发 re-embedding
- [ ] 加入 `chat_sessions` / `chat_messages` 表的持久化，实现「登录后跨设备查看历史对话」
- [ ] 周更 Agent 去重：同主题一周内只保留最新的一条（通过 `metadata.tag` + `date` 做 unique 索引）
- [ ] 加一个 `/admin/rag` 管理页，可视化查看向量库条数、按类型分布、手动触发重建

---

## 11. 联系方式

本次 RAG + Agent 集成由 **nzh 分支贡献者** 实现。如有合并问题、技术细节或想追加功能，欢迎通过 GitHub Issue 或 Pull Request 沟通。

Happy shipping 🚀
