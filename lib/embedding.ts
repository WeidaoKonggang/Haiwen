// DeepSeek Embedding API 工具函数

export async function getEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey || apiKey === 'sk-your-deepseek-api-key') {
    throw new Error('DEEPSEEK_API_KEY 未配置')
  }

  const response = await fetch('https://api.deepseek.com/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-embedding',
      input: text.slice(0, 8000), // DeepSeek embedding 最大 8k tokens
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Embedding API 错误: ${response.status} ${err}`)
  }

  const data = await response.json()
  return data.data[0].embedding as number[]
}

// 批量获取 embedding（带延迟避免限流）
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
