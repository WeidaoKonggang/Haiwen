import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Read-only client (anon key is enough since documents has public-read RLS)
function createReadClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export interface NewsItem {
  id: string
  content: string
  tag: string
  region: string
  date: string
  createdAt: string
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tag = searchParams.get('tag')
  const region = searchParams.get('region')
  const limit = Math.min(Number(searchParams.get('limit') ?? '30'), 100)

  try {
    const supabase = createReadClient()

    let query = supabase
      .from('documents')
      .select('id, content, metadata, created_at')
      .eq('metadata->>type', 'news')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (tag) query = query.eq('metadata->>tag', tag)
    if (region) query = query.eq('metadata->>region', region)

    const { data, error } = await query
    if (error) throw error

    const items: NewsItem[] = (data ?? []).map((row) => ({
      id: row.id,
      content: row.content,
      tag: row.metadata?.tag ?? '',
      region: row.metadata?.region ?? '',
      date: row.metadata?.date ?? '',
      createdAt: row.created_at,
    }))

    // Collect unique tags & regions for client-side filter UI
    const allTags = Array.from(new Set(items.map((i) => i.tag).filter(Boolean)))
    const allRegions = Array.from(new Set(items.map((i) => i.region).filter(Boolean)))

    return NextResponse.json({
      items,
      facets: { tags: allTags, regions: allRegions },
      total: items.length,
    })
  } catch (err) {
    console.error('[news API] error:', err)
    return NextResponse.json(
      { error: 'FETCH_FAILED', message: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
