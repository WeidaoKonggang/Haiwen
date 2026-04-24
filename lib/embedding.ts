/**
 * 多 provider 的 Embedding 封装
 *
 * 通过环境变量 EMBEDDING_PROVIDER 选择：
 *   - zhipu        （智谱 GLM，推荐：embedding-2 / 1024 维；embedding-3 / 2048 维）
 *   - openai       （text-embedding-3-small / 1536 维）
 *   - siliconflow  （国内免费，BAAI/bge-m3 / 1024 维）
 *   - deepseek     （需账号已开通 embeddings 能力）
 *
 * 不同 provider 向量维度不同，首次启用前务必让 pgvector 的 documents.embedding
 * 维度与 provider 输出维度保持一致（参见 supabase/migrations/002_set_embedding_dim.sql）。
 */

type ProviderName = 'zhipu' | 'openai' | 'siliconflow' | 'deepseek'

interface ProviderConfig {
  url: string
  apiKey: string
  model: string
  dimension: number
}

function resolveProvider(): ProviderConfig {
  const provider = (process.env.EMBEDDING_PROVIDER ?? 'zhipu').toLowerCase() as ProviderName

  if (provider === 'zhipu') {
    const apiKey = process.env.ZHIPU_API_KEY
    if (!apiKey) throw new Error('ZHIPU_API_KEY 未配置')
    // 智谱 embedding：embedding-2（固定 1024）/ embedding-3（可自定义，默认 2048）
    // 为了兼容 pgvector ivfflat 的 2000 维上限，embedding-3 强制使用 1024 维
    const model = process.env.EMBEDDING_MODEL ?? 'embedding-3'
    const dimension = 1024
    return {
      url: 'https://open.bigmodel.cn/api/paas/v4/embeddings',
      apiKey,
      model,
      dimension,
    }
  }

  if (provider === 'openai') {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) throw new Error('OPENAI_API_KEY 未配置')
    return {
      url: 'https://api.openai.com/v1/embeddings',
      apiKey,
      model: process.env.EMBEDDING_MODEL ?? 'text-embedding-3-small',
      dimension: 1536,
    }
  }

  if (provider === 'siliconflow') {
    const apiKey = process.env.SILICONFLOW_API_KEY
    if (!apiKey) throw new Error('SILICONFLOW_API_KEY 未配置')
    return {
      url: 'https://api.siliconflow.cn/v1/embeddings',
      apiKey,
      model: process.env.EMBEDDING_MODEL ?? 'BAAI/bge-m3',
      dimension: 1024,
    }
  }

  if (provider === 'deepseek') {
    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey || apiKey === 'sk-your-deepseek-api-key') {
      throw new Error('DEEPSEEK_API_KEY 未配置')
    }
    return {
      url: 'https://api.deepseek.com/v1/embeddings',
      apiKey,
      model: process.env.EMBEDDING_MODEL ?? 'deepseek-embedding',
      dimension: 1536,
    }
  }

  throw new Error(`未知的 EMBEDDING_PROVIDER: ${provider}`)
}

export function getEmbeddingDimension(): number {
  return resolveProvider().dimension
}

export async function getEmbedding(text: string): Promise<number[]> {
  const cfg = resolveProvider()

  // 智谱 embedding-3 / OpenAI text-embedding-3-* 支持通过 dimensions 自定义输出维度
  const body: Record<string, unknown> = {
    model: cfg.model,
    input: text.slice(0, 8000),
  }
  const supportsCustomDim =
    cfg.model === 'embedding-3' ||
    cfg.model.startsWith('text-embedding-3')
  if (supportsCustomDim) {
    body.dimensions = cfg.dimension
  }

  const response = await fetch(cfg.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cfg.apiKey}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(
      `Embedding 请求失败 [${cfg.url} | model=${cfg.model}] ${response.status}: ${body.slice(0, 500)}`
    )
  }

  const data = await response.json()
  const vector = data?.data?.[0]?.embedding
  if (!Array.isArray(vector)) {
    throw new Error(`Embedding 响应格式异常: ${JSON.stringify(data).slice(0, 500)}`)
  }
  return vector as number[]
}

export async function getEmbeddingsBatch(
  texts: string[],
  delayMs = 200
): Promise<number[][]> {
  const results: number[][] = []
  for (const text of texts) {
    const embedding = await getEmbedding(text)
    results.push(embedding)
    if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs))
  }
  return results
}
