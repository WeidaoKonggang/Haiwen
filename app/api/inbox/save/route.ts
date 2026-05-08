import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { normalizeSyncCode } from '@/lib/sync-code'

/**
 * POST /api/inbox/save
 * Body:
 *   {
 *     title: string             // 必填
 *     summary?: string
 *     source_url?: string
 *     tag?: string              // EU AI Act / CSRD / ESG ...
 *     region?: string           // EU / US / CN / SG ...
 *     source_type?: 'push' | 'manual' | 'mock'   default 'push'
 *     sync_code?: string        // 6 位同步码（演示模式）；登录用户可省略
 *     metadata?: Record<string, any>
 *   }
 *
 * 用法：
 *   - APP 端调用：携带 sync_code
 *   - Web 端手动收藏：使用 cookie 自动注入登录态（user_id）；
 *                    或显式传 sync_code 模拟"演示扫码"。
 */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const title = String(body.title || '').trim()
  if (!title) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 })
  }

  const summary = body.summary ? String(body.summary) : null
  const source_url = body.source_url ? String(body.source_url) : null
  const tag = body.tag ? String(body.tag) : null
  const region = body.region ? String(body.region) : null
  const source_type =
    body.source_type === 'manual' || body.source_type === 'mock' || body.source_type === 'push'
      ? body.source_type
      : 'push'
  const metadata = (body.metadata && typeof body.metadata === 'object') ? body.metadata : {}
  const sync_code = normalizeSyncCode(body.sync_code as string | undefined)

  // 优先尝试登录用户身份
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
      { error: 'Either authenticated user or sync_code is required' },
      { status: 400 }
    )
  }

  // 必须用 service role 写入（绕过 RLS 的同步码模式）
  const serviceUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceUrl || !serviceKey) {
    return NextResponse.json(
      { error: 'Supabase service role not configured' },
      { status: 503 }
    )
  }
  const admin = createClient(serviceUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data, error } = await admin
    .from('saved_items')
    .insert({
      user_id: userId,
      sync_code: userId ? null : sync_code,
      title,
      summary,
      source_url,
      tag,
      region,
      source_type,
      metadata,
    })
    .select('id, title, saved_at, source_type')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(
    {
      ok: true,
      item: data,
      mode: userId ? 'authenticated' : 'sync_code',
    },
    { status: 201 }
  )
}

// 允许 APP 跨域调用
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
