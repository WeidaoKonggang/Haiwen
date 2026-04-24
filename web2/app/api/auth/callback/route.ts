import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Supabase Email 验证回调路由
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/zh/chat'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // 回调失败时跳转到登录页
  return NextResponse.redirect(`${origin}/zh/login?error=auth_callback_failed`)
}
