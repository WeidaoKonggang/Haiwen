# HQ (Haiwen) — AI Compliance & ESG Advisory Platform for Chinese Outbound Businesses

> **Branch: `nzh`** — RAG knowledge base + weekly agent + Latest Trends page
>
> 中文版说明请看 [`README.md`](./README.md)。

HQ (海问) is an all-in-one compliance and ESG advisory platform for Chinese AI companies going global. It integrates AI-powered Q&A, a regulation library, a case library, ESG management, and risk assessment. On top of the base product, this branch adds:

- **Vector-based RAG retrieval** that grounds AI answers in the platform's own knowledge base, with inline source citations
- **A weekly news agent** that pulls the latest regulatory developments, deduplicates them automatically, and writes them into the vector store
- **A "Latest Trends" public page** that surfaces the agent-collected news directly to end users

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| i18n | next-intl (Chinese / English) |
| Auth | Supabase Auth |
| Database | Supabase PostgreSQL + pgvector |
| AI Chat | DeepSeek Chat API (streaming SSE) |
| RAG Embedding | Zhipu GLM `embedding-3` @ 1024d (switchable to OpenAI / SiliconFlow / DeepSeek) |
| Web Search | Tavily Search API |
| Scheduler | Vercel Cron Jobs |

---

## Features

### Public area
- **Marketing home**: brand story, feature highlights, curated cases
- **Regulation library**: AI and data protection rules across EU, US, China, Singapore, and more
- **Case library**: real overseas expansion cases from Chinese AI companies
- **Expert hall**: directory of domain experts available for consulting
- **Resource center**: service providers and partner institutions
- **Latest Trends** ⭐ *(new on nzh)*: auto-curated regulatory news from the weekly agent, filterable by region and tag, with a manual "Refresh now" button
- **AI Q&A**: RAG-backed overseas-expansion advisor (no login required to try)

### Console (logged-in)
- **Dashboard**: compliance score, risk index, ESG score overview
- **Compliance diagnosis**: create diagnosis tasks, generate reports
- **Risk assessment**: target-market risk analysis
- **ESG management**: data collection and report generation
- **Decision engine**: destination matching and strategy recommendations
- **Solution toolkit**: practical overseas-expansion tools
- **Enterprise center**: accounts, documents, messages, project management

### RAG chat (new on nzh)
- User question is vectorized via Zhipu Embedding (1024d)
- **Diverse retrieval** against Supabase pgvector: top-5 main hits + 2 forced cases + 1 forced expert, so the prompt always carries policy / case / expert variety
- The retrieved context is injected into the system prompt with strict rules that force the LLM to add inline parenthetical citations (e.g. `(source: EU AI Act policy entry)`) and close with a "Further reading" line
- Silent degradation when the vector store isn't ready — the chat still works
- The dev server terminal prints `[RAG] matched N docs …` for every request so you can verify retrieval is actually firing

### Weekly update agent (new on nzh)
- Triggered automatically every Monday at 00:00 UTC via Vercel Cron
- Uses the Tavily API to search 10 topics: EU AI Act, GDPR, CSRD, China AI regulation, China data compliance, Singapore PDPA, ESG enforcement, Chinese AI overseas expansion, ISSB, US export controls
- DeepSeek summarizes the search results and the agent writes them into the vector store, immediately consumed by both RAG and the `/trends` page
- **Three-layer deduplication** ⭐:
  1. Same `tag` already written today → skip the topic entirely (idempotent)
  2. Keep only the most recent 4 rows per `tag`; older rows are pruned automatically (bounded capacity)
  3. The response exposes `success / skipped / failed / pruned` counters

---

## Quick Start

### 1. Clone

```bash
git clone https://github.com/WeidaoKonggang/Haiwen.git
cd Haiwen
git checkout nzh
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # server-side only, never ship to client

# DeepSeek (required, used for chat)
DEEPSEEK_API_KEY=sk-your-deepseek-api-key

# Embedding provider (Zhipu GLM is the default — stable in mainland China, good on Chinese text)
EMBEDDING_PROVIDER=zhipu
EMBEDDING_MODEL=embedding-3
ZHIPU_API_KEY=your-zhipu-api-key

# Tavily Search API (needed by the weekly agent, free tier: 1000 calls/month)
TAVILY_API_KEY=tvly-your-tavily-api-key

# Internal secret used to guard the cron endpoint (any random string)
CRON_SECRET=your-random-secret

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> Want to use a different embedding model? Flip `EMBEDDING_PROVIDER` to `openai` / `siliconflow` / `deepseek` and fill in the matching API key. The code normalizes the output to 1024 dimensions regardless (pgvector's ivfflat index caps at 2000d).

### 3. Initialize the Supabase database

In the [Supabase SQL Editor](https://supabase.com/dashboard), run the consolidated setup once:

```
supabase/migrations/000_setup_all.sql
```

It creates / recreates:
- `documents` table (vector knowledge base, `vector(1024)`)
- `chat_sessions` / `chat_messages` tables (chat history)
- `match_documents` function
- ivfflat vector index, RLS policies, and update triggers

> Upgrading an existing database and don't want the `drop`? Look at the incremental migrations (`002_set_embedding_dim.sql` / `003_resize_to_2048.sql`) described in `MERGING_FROM_NZH.md`.

### 4. Seed the initial knowledge base

```bash
npx tsx scripts/seed-rag.ts
```

Vectorizes every policy, ESG standard, case, risk event, and expert bundled with the platform and writes them into the database. Takes ~1–2 minutes and costs well under ¥0.01.

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Things to try:

- Open **AI Chat**, ask a compliance question → the dev server terminal should print `[RAG] matched N docs …`
- Open **/trends**, click "Refresh now" to trigger the weekly agent on demand (first run ≈ 3 minutes; a second click the same day returns instantly thanks to dedup)

---

## Project Layout

```
├── app/
│   ├── [locale]/                    # i18n routes (zh / en)
│   │   ├── (app)/                   # Logged-in console
│   │   │   ├── dashboard/
│   │   │   ├── ai-chat/
│   │   │   ├── diagnosis/
│   │   │   ├── risk-assessment/
│   │   │   ├── esg-manage/
│   │   │   ├── decision-engine/
│   │   │   ├── solution-tools/
│   │   │   └── enterprise-center/
│   │   ├── policy-db/               # Regulation library
│   │   ├── cases/                   # Case library
│   │   ├── expert-hall/             # Expert directory
│   │   ├── resource-center/         # Resource hub
│   │   ├── trends/                  # ⭐ Latest Trends (new on nzh)
│   │   └── login/ register/
│   └── api/
│       ├── chat/                    # AI chat with RAG diverse retrieval
│       ├── news/                    # ⭐ Feeds the /trends page
│       ├── agent/weekly-update/     # Weekly agent with three-layer dedup
│       └── auth/callback/
├── components/
│   ├── ChatInterface.tsx            # Chat UI (incl. scroll UX fix)
│   ├── Navbar.tsx
│   ├── SideMenu.tsx
│   └── LanguageSwitcher.tsx
├── lib/
│   ├── embedding.ts                 # Multi-provider embedding wrapper
│   ├── rag.ts                       # Retrieval + diverse strategy + dedup utils
│   ├── mock-data.ts
│   ├── cases-data.ts
│   └── supabase/                    # Supabase clients
├── scripts/
│   └── seed-rag.ts                  # Knowledge base seeder
├── supabase/
│   └── migrations/
│       ├── 000_setup_all.sql        # ⭐ One-shot setup for fresh databases
│       ├── 001_pgvector_rag.sql     # Legacy base migration (kept for reference)
│       ├── 002_set_embedding_dim.sql
│       └── 003_resize_to_2048.sql
├── messages/
│   ├── zh.json
│   └── en.json
├── vercel.json                      # Cron job config
├── README.md                        # Chinese version
├── README.en.md                     # This file
├── CHANGELOG.md                     # ⭐ nzh branch iteration log
└── MERGING_FROM_NZH.md              # ⭐ Upstream merge playbook
```

---

## Environment Variables

| Name | Required | Notes |
|------|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL (**do not** append `/rest/v1`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key (safe to expose) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (server writes) | Supabase service role key — keep server-only |
| `DEEPSEEK_API_KEY` | Yes | DeepSeek API key (chat + news summarization) |
| `EMBEDDING_PROVIDER` | Yes | `zhipu` (default) / `openai` / `siliconflow` / `deepseek` |
| `EMBEDDING_MODEL` | Yes | Model id for the chosen provider, e.g. Zhipu's `embedding-3` |
| `ZHIPU_API_KEY` | If provider=zhipu | Zhipu GLM API key |
| `OPENAI_API_KEY` | If provider=openai | OpenAI API key |
| `SILICONFLOW_API_KEY` | If provider=siliconflow | SiliconFlow API key |
| `TAVILY_API_KEY` | Needed by weekly agent | Tavily Search API (1000 free calls/month) |
| `CRON_SECRET` | Recommended | Guards the weekly-update endpoint from unauthorized calls |
| `NEXT_PUBLIC_APP_URL` | Yes | Public app URL (used for email callbacks, etc.) |

---

## Deploy (Vercel)

```bash
npm i -g vercel
vercel --prod
```

Once all environment variables are set in the Vercel dashboard, the cron schedule in `vercel.json` kicks in automatically:

- Every Monday at 00:00 UTC → `POST /api/agent/weekly-update` is invoked
- The agent self-deduplicates: first run writes ~10 rows, subsequent weekly runs add up to 10 more and prune anything older than the top-4 per tag
- The freshly written news is immediately visible on `/trends`

---

## Common Operations

| I want to… | Do this |
|---|---|
| Verify RAG is actually being used | Ask a question in the AI chat and watch the `[RAG] matched N docs …` log line in the dev server terminal |
| Trigger the weekly agent manually | Open `/trends` and hit "Refresh now", or `curl -X POST /api/agent/weekly-update -H "Authorization: Bearer $CRON_SECRET"` |
| Add a custom knowledge entry | Edit `lib/mock-data.ts` / `lib/cases-data.ts`, then re-run `npx tsx scripts/seed-rag.ts` |
| Switch embedding provider | Update `EMBEDDING_PROVIDER` + its API key in `.env.local`, then re-seed (embeddings from different models are not interchangeable) |
| Change "how many rows to keep per tag" | Edit `KEEP_PER_TAG` at the top of `app/api/agent/weekly-update/route.ts` |
| Tune RAG similarity threshold / top-K | Adjust the `retrieveDiverseContext` call parameters inside `app/api/chat/route.ts` |

---

## Documentation Index

| File | Audience | Purpose |
|------|----------|---------|
| `README.md` | Newcomers / collaborators (Chinese) | Overall project introduction (Chinese) |
| `README.en.md` | Newcomers / collaborators (English) | This file |
| `CHANGELOG.md` | All contributors | Reverse-chronological log of `nzh` branch iterations |
| `MERGING_FROM_NZH.md` | Upstream maintainer | Step-by-step playbook to merge `nzh` into `main` (SQL, env, validation, rollback) |

---

## Branches

| Branch | Description |
|--------|-------------|
| `main` | Base version, static mock data |
| `nzh` | **This branch** — RAG vector retrieval + weekly agent + Latest Trends page + news dedup |
