-- ============================================================
-- 海问 HQ — 一次性完整初始化（智谱 embedding-3 / 1024 维）
-- 在 Supabase SQL Editor 中完整执行本文件即可
--
-- 说明：pgvector 的 ivfflat 索引最多支持 2000 维，
-- embedding-3 默认 2048 维会超限，代码里已通过 dimensions 参数压到 1024。
-- ============================================================

-- 1. 开启 pgvector 扩展
create extension if not exists vector;

-- 2. documents 表（RAG 知识库，1024 维）
drop table if exists documents cascade;

create table documents (
  id          uuid primary key default gen_random_uuid(),
  content     text        not null,
  metadata    jsonb       not null default '{}',
  embedding   vector(1024),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 3. 向量索引（IVFFlat 余弦相似度）
create index documents_embedding_idx
  on documents using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create index documents_metadata_idx
  on documents using gin (metadata);

-- 4. 检索函数（查询 Top-K 相似文档）
create or replace function match_documents(
  query_embedding vector(1024),
  match_count     int     default 5,
  filter_type     text    default null
)
returns table (
  id          uuid,
  content     text,
  metadata    jsonb,
  similarity  float
)
language plpgsql
as $$
begin
  return query
  select
    d.id,
    d.content,
    d.metadata,
    1 - (d.embedding <=> query_embedding) as similarity
  from documents d
  where
    (filter_type is null or d.metadata->>'type' = filter_type)
    and d.embedding is not null
  order by d.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- 5. 自动维护 updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists documents_updated_at on documents;
create trigger documents_updated_at
  before update on documents
  for each row execute function update_updated_at();

-- 6. chat_sessions / chat_messages（对话历史）
drop table if exists chat_messages cascade;
drop table if exists chat_sessions cascade;

create table chat_sessions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade,
  title      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table chat_messages (
  id         uuid primary key default gen_random_uuid(),
  session_id uuid references chat_sessions(id) on delete cascade,
  role       text not null check (role in ('user', 'assistant')),
  content    text not null,
  created_at timestamptz not null default now()
);

create index chat_messages_session_idx on chat_messages(session_id);

drop trigger if exists chat_sessions_updated_at on chat_sessions;
create trigger chat_sessions_updated_at
  before update on chat_sessions
  for each row execute function update_updated_at();

-- 7. RLS 策略
alter table documents      enable row level security;
alter table chat_sessions  enable row level security;
alter table chat_messages  enable row level security;

-- documents：所有人可读，service_role 可写
create policy "所有人可读 documents"
  on documents for select using (true);

create policy "service_role 写入 documents"
  on documents for insert to service_role with check (true);

create policy "service_role 更新 documents"
  on documents for update to service_role using (true) with check (true);

-- chat_sessions / chat_messages：用户只能访问自己的
create policy "用户查看自己的会话"
  on chat_sessions for select using (auth.uid() = user_id);

create policy "用户创建会话"
  on chat_sessions for insert with check (auth.uid() = user_id);

create policy "用户查看自己会话的消息"
  on chat_messages for select using (
    exists (
      select 1 from chat_sessions
      where chat_sessions.id = chat_messages.session_id
        and chat_sessions.user_id = auth.uid()
    )
  );

create policy "用户写入自己会话的消息"
  on chat_messages for insert with check (
    exists (
      select 1 from chat_sessions
      where chat_sessions.id = chat_messages.session_id
        and chat_sessions.user_id = auth.uid()
    )
  );

-- ✅ 完成。执行后应该能看到：Success. No rows returned
