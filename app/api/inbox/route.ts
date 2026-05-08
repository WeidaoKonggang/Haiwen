import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { normalizeSyncCode } from '@/lib/sync-code'

/**
 * GET /api/inbox?code=XXXXXX&limit=50&unread=1
 * 返回当前用户（登录态）或 sync_code（演示）下保存的全部条目。
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sync_code = normalizeSyncCode(searchParams.get('code'))
  const limit = Math.min(Math.max(Number(searchParams.get('limit') ?? '50'), 1), 200)
  const unreadOnly = searchParams.get('unread') === '1'

  let userId: string | null = null
  try {
    const { createClient: createServerSupabase } = await import('@/lib/supabase/server')
    const supabase = await createServerSupabase()
    const { data } = await supabase.auth.getUser()
    userId = data.user?.id ?? null
  } catch {
    // ignore
  }

  if (!userId && !sync_code) {
    return NextResponse.json(
      { items: [], error: 'Login or sync code required' },
      { status: 200 }
    )
  }

  const serviceUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceUrl || !serviceKey) {
    return NextResponse.json({ items: [], error: 'Service role not configured' }, { status: 200 })
  }
  const admin = createServiceClient(serviceUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  let query = admin
    .from('saved_items')
    .select('id, title, summary, source_url, tag, region, source_type, saved_at, opened_at, metadata')
    .order('saved_at', { ascending: false })
    .limit(limit)

  if (userId) {
    query = query.eq('user_id', userId)
  } else if (sync_code) {
    query = query.eq('sync_code', sync_code).is('user_id', null)
  }

  if (unreadOnly) {
    query = query.is('opened_at', null)
  }

  const { data, error } = await query
  if (error) {
    return NextResponse.json({ items: [], error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    items: data ?? [],
    mode: userId ? 'authenticated' : 'sync_code',
    sync_code: userId ? null : sync_code,
  })
}

/**
 * PATCH /api/inbox
 * Body: { id: string, opened?: boolean }
 * 标记某条已读/未读。
 */
export async function PATCH(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const id = String(body.id || '')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const opened = body.opened !== false // default true
  const sync_code = normalizeSyncCode(body.sync_code as string | undefined)

  let userId: string | null = null
  try {
    const { createClient: createServerSupabase } = await import('@/lib/supabase/server')
    const supabase = await createServerSupabase()
    const { data } = await supabase.auth.getUser()
    userId = data.user?.id ?? null
  } catch {
    // ignore
  }

  const serviceUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceUrl || !serviceKey) {
    return NextResponse.json({ error: 'Service role not configured' }, { status: 503 })
  }
  const admin = createServiceClient(serviceUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  // 必须校验所有权
  let query = admin.from('saved_items').update({
    opened_at: opened ? new Date().toISOString() : null,
  }).eq('id', id)
  if (userId) {
    query = query.eq('user_id', userId)
  } else if (sync_code) {
    query = query.eq('sync_code', sync_code).is('user_id', null)
  } else {
    return NextResponse.json({ error: 'auth or sync_code required' }, { status: 400 })
  }

  const { error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}

/**
 * DELETE /api/inbox?id=xxx[&code=YYYY]
 */
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const sync_code = normalizeSyncCode(searchParams.get('code'))

  let userId: string | null = null
  try {
    const { createClient: createServerSupabase } = await import('@/lib/supabase/server')
    const supabase = await createServerSupabase()
    const { data } = await supabase.auth.getUser()
    userId = data.user?.id ?? null
  } catch {
    // ignore
  }

  const serviceUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceUrl || !serviceKey) {
    return NextResponse.json({ error: 'Service role not configured' }, { status: 503 })
  }
  const admin = createServiceClient(serviceUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  let query = admin.from('saved_items').delete().eq('id', id)
  if (userId) {
    query = query.eq('user_id', userId)
  } else if (sync_code) {
    query = query.eq('sync_code', sync_code).is('user_id', null)
  } else {
    return NextResponse.json({ error: 'auth or sync_code required' }, { status: 400 })
  }

  const { error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
