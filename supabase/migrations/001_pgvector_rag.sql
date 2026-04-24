-- ============================================================
-- 海问 HQ — RAG 向量数据库 Migration
-- 在 Supabase SQL Editor 中运行此文件
-- ============================================================

-- 1. 开启 pgvector 扩展
create extension if not exists vector;

-- 2. 创建 documents 表（RAG 知识库）
create table if not exists documents (
  id          uuid primary key default gen_random_uuid(),
  content     text        not null,          -- 原始文本内容
  metadata    jsonb       not null default '{}', -- 来源信息
  embedding   vector(1536),                  -- DeepSeek Embedding 维度
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 3. 创建向量索引（IVFFlat，加速检索）
create index if not exists documents_embedding_idx
  on documents using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- 4. 创建 GIN 索引加速 metadata 查询
create index if not exists documents_metadata_idx
  on documents using gin (metadata);

-- 5. 余弦相似度检索函数
create or replace function match_documents(
  query_embedding vector(1536),
  match_count     int     default 5,
  filter_type     text    default null  -- 可按 metadata.type 过滤
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

-- 6. 自动更新 updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger documents_updated_at
  before update on documents
  for each row execute function update_updated_at();

-- 7. 创建 chat_sessions 表（存储对话历史）
create table if not exists chat_sessions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade,
  title      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 8. 创建 chat_messages 表
create table if not exists chat_messages (
  id         uuid primary key default gen_random_uuid(),
  session_id uuid references chat_sessions(id) on delete cascade,
  role       text not null check (role in ('user', 'assistant')),
  content    text not null,
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_session_idx
  on chat_messages(session_id);

create trigger chat_sessions_updated_at
  before update on chat_sessions
  for each row execute function update_updated_at();

-- 9. RLS 策略（用户只能访问自己的对话）
alter table chat_sessions enable row level security;
alter table chat_messages enable row level security;

create policy "用户查看自己的会话"
  on chat_sessions for select
  using (auth.uid() = user_id);

create policy "用户创建会话"
  on chat_sessions for insert
  with check (auth.uid() = user_id);

create policy "用户查看自己会话的消息"
  on chat_messages for select
  using (
    exists (
      select 1 from chat_sessions
      where chat_sessions.id = chat_messages.session_id
        and chat_sessions.user_id = auth.uid()
    )
  );

create policy "用户写入自己会话的消息"
  on chat_messages for insert
  with check (
    exists (
      select 1 from chat_sessions
      where chat_sessions.id = chat_messages.session_id
        and chat_sessions.user_id = auth.uid()
    )
  );

-- documents 表允许服务端读取（service_role 写入）
alter table documents enable row level security;

create policy "所有人可读 documents"
  on documents for select
  using (true);
