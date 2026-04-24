-- ============================================================
-- 海问 HQ — 切换到智谱 embedding-3（2048 维）
-- 在 Supabase SQL Editor 中整份执行本文件
-- ============================================================

-- 1. 清空旧数据（维度改变后旧向量失效）
truncate table documents;

-- 2. 把 embedding 列维度改为 2048
alter table documents drop column if exists embedding;
alter table documents add column embedding vector(2048);

-- 3. 重建向量索引
drop index if exists documents_embedding_idx;
create index documents_embedding_idx
  on documents using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- 4. 重建检索函数（签名维度同步改为 2048）
drop function if exists match_documents(vector, int, text);

create or replace function match_documents(
  query_embedding vector(2048),
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
