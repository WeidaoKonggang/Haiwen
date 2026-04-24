-- ============================================================
-- 海问 HQ — Embedding 维度与 RLS 修正
-- 若使用 GLM embedding-2（1024 维），请整份执行本 migration
-- 若已有数据且改了维度，会清空 documents 表（向量列类型变化需重建）
-- ============================================================

-- 1. 清空旧数据（旧的 1536 维向量无法转为 1024 维）
truncate table documents;

-- 2. 修改 embedding 列维度为 1024（智谱 embedding-2）
--    如需改为其他维度，把下面的 1024 替换成对应维度并执行
alter table documents drop column if exists embedding;
alter table documents add column embedding vector(1024);

-- 3. 重建向量索引
drop index if exists documents_embedding_idx;
create index documents_embedding_idx
  on documents using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- 4. 重建检索函数（签名里的维度也要改）
drop function if exists match_documents(vector, int, text);

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

-- 5. 允许 service_role 写入 documents（seed-rag.ts 依赖此权限）
drop policy if exists "服务端写入 documents" on documents;
create policy "服务端写入 documents"
  on documents for insert
  to service_role
  with check (true);

drop policy if exists "服务端更新 documents" on documents;
create policy "服务端更新 documents"
  on documents for update
  to service_role
  using (true)
  with check (true);
