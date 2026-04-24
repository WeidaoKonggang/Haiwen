import { NextRequest, NextResponse } from 'next/server'
import { getEmbedding } from '@/lib/embedding'
import { upsertDocument } from '@/lib/rag'

// 每周搜索的主题列表
const SEARCH_TOPICS = [
  { query: 'EU AI Act compliance enforcement 2026', region: '欧盟', tag: 'EU AI Act' },
  { query: 'GDPR enforcement fine penalty latest', region: '欧盟', tag: 'GDPR' },
  { query: 'CSRD ESG reporting requirement update', region: '欧盟', tag: 'ESG' },
  { query: 'China AI regulation policy update 2026', region: '中国', tag: 'AI监管' },
  { query: '中国数据安全法个人信息保护法最新动态', region: '中国', tag: '数据合规' },
  { query: 'Singapore PDPA AI governance update', region: '新加坡', tag: 'PDPA' },
  { query: 'ESG greenwashing enforcement action 2026', region: '全球', tag: 'ESG执法' },
  { query: 'Chinese AI company overseas expansion news', region: '全球', tag: '出海动态' },
  { query: 'ISSB IFRS sustainability standards update', region: '全球', tag: 'ISSB' },
  { query: 'US AI export control China restriction', region: '美国', tag: '出口管制' },
]

// 调用 Tavily 搜索 API
async function searchWeb(query: string): Promise<{ title: string; content: string; url: string }[]> {
  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey) throw new Error('TAVILY_API_KEY 未配置')

  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: 'advanced',
      max_results: 5,
      include_answer: true,
    }),
  })

  if (!res.ok) throw new Error(`Tavily 搜索失败: ${res.status}`)
  const data = await res.json()
  return data.results ?? []
}

// 用 DeepSeek 总结搜索结果
async function summarizeResults(
  topic: string,
  results: { title: string; content: string }[]
): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY!
  const rawText = results.map((r) => `标题：${r.title}\n内容：${r.content}`).join('\n\n')

  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content:
            '你是一位专业的政策分析师，负责整理最新的AI监管、数据合规和ESG相关资讯，供中国出海企业参考。请用中文总结，语言简洁专业，重点提炼关键信息和对企业的影响。',
        },
        {
          role: 'user',
          content: `请总结以下关于"${topic}"的最新资讯，提炼3-5个关键要点，说明对中国出海企业的影响和建议措施。\n\n${rawText}`,
        },
      ],
      max_tokens: 800,
      temperature: 0.3,
    }),
  })

  if (!res.ok) throw new Error(`DeepSeek 总结失败: ${res.status}`)
  const data = await res.json()
  return data.choices[0].message.content
}

export async function POST(req: NextRequest) {
  // 验证内部调用密钥（防止未授权触发）
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[],
  }

  console.log(`[周更 Agent] 开始执行，共 ${SEARCH_TOPICS.length} 个主题`)

  for (const topic of SEARCH_TOPICS) {
    try {
      console.log(`  搜索：${topic.query}`)

      // 1. 联网搜索
      const searchResults = await searchWeb(topic.query)
      if (searchResults.length === 0) {
        console.log(`  跳过（无结果）：${topic.query}`)
        continue
      }

      // 2. DeepSeek 总结
      const summary = await summarizeResults(topic.tag, searchResults)

      // 3. 组合最终内容
      const content = [
        `最新动态：${topic.tag}`,
        `地区：${topic.region}`,
        `更新日期：${new Date().toISOString().split('T')[0]}`,
        `内容摘要：\n${summary}`,
        `参考来源：${searchResults.map((r) => r.url).filter(Boolean).slice(0, 3).join('、')}`,
      ].join('\n')

      // 4. 向量化并写入数据库
      const embedding = await getEmbedding(content)
      await upsertDocument({
        content,
        metadata: {
          type: 'news',
          region: topic.region,
          tag: topic.tag,
          date: new Date().toISOString().split('T')[0],
        },
        embedding,
      })

      results.success++
      // 避免限流
      await new Promise((r) => setTimeout(r, 500))
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      results.failed++
      results.errors.push(`${topic.tag}: ${msg}`)
      console.error(`  失败：${topic.tag}`, err)
    }
  }

  console.log(`[周更 Agent] 完成：成功 ${results.success}，失败 ${results.failed}`)

  return NextResponse.json({
    message: '周更完成',
    ...results,
    timestamp: new Date().toISOString(),
  })
}

// Vercel Cron 触发（GET 请求）
export async function GET(req: NextRequest) {
  return POST(req)
}
