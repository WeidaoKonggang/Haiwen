# Changelog — `nzh` 分支

这份文件按时间倒序记录 `nzh` 分支在 main 之上追加的所有迭代。
只记录**用户可感知 / 可合并**的改动；内部重构或纯格式调整略过。

> 合并到上游的完整指南仍看 [`MERGING_FROM_NZH.md`](./MERGING_FROM_NZH.md)。
> 分支总体介绍和环境变量清单看 [`README.md`](./README.md)。

---

## 2026-04-24 — Trends 页面 + 新闻去重机制

### 动机

周更 Agent 已能自动把 10 个主题的最新资讯写入 Supabase `documents` 表（`metadata.type='news'`）。
在这次迭代之前：

1. 这些新闻**只有 RAG 管线能看见**，没有任何前台 UI 展示，用户感觉不到"最新动态"这件事真的发生了。
2. 手动重跑 Agent（或 Cron 在同一天多次触发）会**重复写入**，库里会堆一堆近似条目，拉低检索多样性。

本次迭代解决这两个问题。

---

### 1. 新增 `/trends` "最新动态" 页面

**入口**：顶栏导航新增 `最新动态 / Trends`。

**数据来源**：新 API `GET /api/news`，读取 `documents` 表中 `metadata.type='news'` 的记录，按 `created_at` 倒序返回，支持 `?tag=…&region=…` 过滤。读取走 anon client + 现有 RLS 读策略，不需要额外配置。

**页面功能**：

| 功能 | 说明 |
|---|---|
| 地区筛选 tab | `全部` / `欧盟` / `中国` / `新加坡` / `美国` / …（从 API facets 动态生成）|
| 标签筛选 chip | `EU AI Act` / `GDPR` / `ESG` / `出海动态` …（动态）|
| "立即刷新"按钮 | 调用 `POST /api/agent/weekly-update`，按钮会 loading 并显示本次 `success / skipped / pruned` 统计 |
| 卡片展开 | 点击"展开全文"切换摘要截断 / 完整正文 |
| 来源链接 | 自动从 content 中抽出 URL，渲染为可点击外链 |
| 空 / 错 / 加载态 | 全部覆盖 |

**文件清单**：

- `app/[locale]/trends/page.tsx`（新）
- `app/api/news/route.ts`（新）
- `components/Navbar.tsx`（加导航项）
- `messages/zh.json` / `messages/en.json`（加 `nav.trends` 翻译）

**对原作者**：这页是纯追加，不影响任何已有路由、Supabase schema、RAG 行为；直接合过来就能用。

---

### 2. 周更 Agent 新增"去重机制"

采用**三层保护**，一套逻辑同时解决幂等和容量：

| 层 | 作用 | 触发时机 | 新函数 |
|---|---|---|---|
| L1 当日幂等 | 同 `tag` + 同 `date` 已有 → 跳过整个主题 | 每个主题开始前 | `newsExistsForDate(tag, date)` |
| L2 容量上限 | 同 `tag` 只保留最近 **4 条**，更老的删除 | 每条成功写入后 | `pruneOldNewsByTag(tag, keep=4)` |
| L3 透明统计 | 返回 `success / skipped / failed / pruned` 四个计数 | route 出参 | — |

**效果推演**：

- 周一 00:00 Cron 第一次跑 → `success=10, skipped=0, pruned=0`
- 同一天再调一次（手动刷新或 Cron 抖动）→ `success=0, skipped=10`，秒回
- 连续跑 5 个周一后 → 每个 `tag` 稳定保持在 4 条（近一个月）
- 半年后 → 库里 news 总量始终 ≈ `KEEP_PER_TAG × 主题数 = 40 条`，不会无限膨胀

**本地实测**（首次 vs 第二次）：

```
[周更 Agent] 完成：成功 10，跳过 0，失败 0，清理旧数据 0 条    ← 首次, 170s
[周更 Agent] 完成：成功 0，跳过 10，失败 0，清理旧数据 0 条    ← 第二次, 5s
```

**文件清单**：

- `lib/rag.ts`（新增两个工具函数）
- `app/api/agent/weekly-update/route.ts`（写入前查当日 / 写入后 prune / 扩展返回字段）

**对原作者**：

- 无需修改 Supabase schema，复用已有的 `metadata jsonb` 字段
- 复用已有的 `SUPABASE_SERVICE_ROLE_KEY`（prune 走 admin client）
- 如果不希望 Agent 自动删除旧数据，只需把 route 中的 `KEEP_PER_TAG` 改得非常大（比如 9999）即可退化成"只做幂等不做容量控制"

---

### 3. 兼容性 & 回滚

- **向后兼容**：对既有 `documents` 表中已存在的、没有 `metadata.date` 字段的老 news 记录，新的 `newsExistsForDate` 会把它们视为"不存在今天的记录"，不会影响新写入；`pruneOldNewsByTag` 按 `created_at` 排序，老记录若数量超过 `KEEP_PER_TAG` 会被清理（这是期望行为）。
- **回滚**：本次两个 commit（`feat(trends)` + `feat(agent)`）可独立 revert，互不依赖。

---

### 4. 未来可扩展的点（下一轮想做可以接着来）

- [ ] `/trends` 页面加分页（目前一次拉 50 条）
- [ ] Agent 支持"失败重试"（目前失败即跳过，无重试）
- [ ] 新闻 URL 去重（同一条 URL 即使不同 tag 也算重复）—— 目前只做 tag+date 维度
- [ ] `/trends` 显示每条 news 被 RAG 命中次数，量化"这条资讯有没有人问到"
- [ ] Agent 触发 webhook → 发飞书 / Slack 通知

---

## 2026-04-21 ~ 2026-04-24 — RAG 基础搭建（见此前 commits）

简要索引，详情见 `MERGING_FROM_NZH.md`：

- `feat: add RAG system and weekly update agent` — pgvector schema、embedding provider 抽象、主检索接口、周更 Agent
- `docs: add comprehensive README for nzh branch` — 分支说明 + env 清单
- `feat(rag): wire citations, diverse retrieval, and multi-provider embeddings` — Prompt 强化引用、多样化检索（policy + case + expert）、Zhipu `embedding-3` 固定 1024 维
- `fix(chat): stop page jump during streaming, pause follow on user scroll up` — 聊天滚动 UX 修复
- `docs: add upstream merge guide (MERGING_FROM_NZH.md)` — 给原作者的合并指引

---
