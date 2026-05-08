-- ============================================================
-- 海问 HQ — APP↔Web 同步收件箱
-- 手机 APP 把每日推送 / 收藏写入 saved_items；
-- 电脑端通过 6 位同步码或登录账号读取。
-- 在 Supabase SQL Editor 中执行本文件即可。
-- ============================================================

create extension if not exists "pgcrypto";

drop table if exists saved_items cascade;

create table saved_items (
  id          uuid primary key default gen_random_uuid(),
  -- 二选一：登录用户（auth.users）或 6 位同步码（演示友好，无需注册）
  user_id     uuid references auth.users(id) on delete cascade,
  sync_code   varchar(12),
  -- 内容
  title       text        not null,
  summary     text,
  source_url  text,
  tag         text,                  -- 例如 'EU AI Act' / 'CSRD' / 'ESG'
  region      text,                  -- 例如 'EU' / 'US' / 'CN' / 'SG'
  -- 来源
  source_type text not null default 'push'  -- 'push' | 'manual' | 'mock'
    check (source_type in ('push', 'manual', 'mock')),
  -- 状态
  saved_at    timestamptz not null default now(),
  opened_at   timestamptz,
  -- 元数据（可放 APP 端原始 payload）
  metadata    jsonb       not null default '{}',
  -- 至少要有一种归属方式
  constraint saved_items_owner_check check (user_id is not null or sync_code is not null)
);

create index saved_items_user_id_idx     on saved_items(user_id, saved_at desc);
create index saved_items_sync_code_idx   on saved_items(sync_code, saved_at desc);
create index saved_items_tag_idx         on saved_items(tag);

-- RLS
alter table saved_items enable row level security;

-- 已登录用户只能读自己写入的
drop policy if exists "saved_items_select_own" on saved_items;
create policy "saved_items_select_own"
  on saved_items for select
  using (auth.uid() = user_id);

-- 已登录用户可写入自己的
drop policy if exists "saved_items_insert_own" on saved_items;
create policy "saved_items_insert_own"
  on saved_items for insert
  with check (auth.uid() = user_id);

-- 已登录用户可更新/删除自己的
drop policy if exists "saved_items_update_own" on saved_items;
create policy "saved_items_update_own"
  on saved_items for update
  using (auth.uid() = user_id);

drop policy if exists "saved_items_delete_own" on saved_items;
create policy "saved_items_delete_own"
  on saved_items for delete
  using (auth.uid() = user_id);

-- 同步码模式由 service-role 在后端校验（API 路由层），表层 RLS 不放开匿名读
-- 这是有意为之：anon key 不能直接 select，必须经过我们自己的 API
