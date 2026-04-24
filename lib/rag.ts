// RAG 检索核心逻辑
import { createClient } from '@supabase/supabase-js'
import { getEmbedding } from './embedding'

// 用 service_role key 的 admin 客户端（服务端专用）
function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, key)
}

export interface RetrievedDoc {
  id: string
  content: string
  metadata: Record<string, string>
  similarity: number
}

// 检索相关文档
export async function retrieveContext(
  question: string,
  options: {
    matchCount?: number
    filterType?: string
    minSimilarity?: number
  } = {}
): Promise<RetrievedDoc[]> {
  const { matchCount = 5, filterType, minSimilarity = 0.3 } = options

  try {
    const embedding = await getEmbedding(question)
    const supabase = createAdminClient()

    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_count: matchCount,
      filter_type: filterType ?? null,
    })

    if (error) {
      console.error('RAG 检索错误:', error)
      return []
    }

    return (data as RetrievedDoc[]).filter((d) => d.similarity >= minSimilarity)
  } catch (err) {
    console.error('RAG 检索异常:', err)
    return []
  }
}

// 将检索结果格式化为 Prompt 上下文
export function formatContext(docs: RetrievedDoc[]): string {
  if (docs.length === 0) return ''

  const sections = docs.map((doc) => {
    const source = doc.metadata?.type
      ? `[来源：${typeLabel(doc.metadata.type)}]`
      : ''
    return `${source}\n${doc.content}`
  })

  return sections.join('\n\n---\n\n')
}

function typeLabel(type: string): string {
  const labels: Record<string, string> = {
    policy: '政策法规',
    esg: 'ESG标准',
    case: '出海案例',
    risk: '风险事件',
    expert: '专家信息',
    news: '最新动态',
  }
  return labels[type] ?? type
}

// 写入文档到向量数据库
export async function upsertDocument(doc: {
  content: string
  metadata: Record<string, string>
  embedding: number[]
}) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('documents').upsert({
    content: doc.content,
    metadata: doc.metadata,
    embedding: doc.embedding,
  })
  if (error) throw error
}
