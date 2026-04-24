import { NextRequest, NextResponse } from 'next/server'
import { retrieveContext, formatContext } from '@/lib/rag'

const BASE_PROMPT_ZH = `你是海问（HQ），一位专注于中国AI企业出海与ESG创新的专业咨询顾问。你的专长领域包括：帮助中国AI企业制定国际化出海战略（市场进入策略、本地化运营、竞争格局分析）；ESG创新策略与全球标准合规管理；跨境合规框架分析（GDPR、EU AI Act、数据本地化、行业监管等）；以及目标市场商业机会识别与风险评估。

请按照以下要求回答：使用流畅自然的语言段落表达，如同专业顾问面对面交谈，语气专业但平易近人。不要使用任何markdown格式符号，不使用井号标题、星号列表、下划线或双星号加粗等格式。如需列举多个要点，请用序号加中文顿号（如"一、二、三、"）自然融入段落中，或用"首先……其次……最后……"等连贯性词语。回答要专业、有据可查、具有可操作性，结合真实案例和数据支撑观点。字数控制在600字以内，除非用户明确要求详细分析。用中文回答中文问题，用英文回答英文问题。`

const BASE_PROMPT_EN = `You are HQ (HaiWen), a professional consultant specializing in helping Chinese AI companies expand globally and manage ESG innovation. Your expertise covers go-global strategy development (market entry, localization, competitive analysis), ESG innovation and global standards compliance, cross-border compliance frameworks (GDPR, EU AI Act, data localization, industry regulations), and target market opportunity and risk assessment.

Please respond in fluent, natural language paragraphs as a professional consultant speaking directly to a client. Do not use any markdown formatting symbols — no pound signs for headers, no asterisks for bullets or bold, no underscores. If you need to enumerate points, use natural connectors like "first... second... finally..." or numbered Chinese-style connectors integrated naturally into the prose. Your answers should be professional, evidence-based, and actionable, supported by real examples and data. Keep responses under 600 words unless the user explicitly asks for a detailed analysis. Respond in Chinese for Chinese questions, in English for English questions.`

function buildSystemPrompt(locale: string, context: string): string {
  const base = locale === 'zh' ? BASE_PROMPT_ZH : BASE_PROMPT_EN

  if (!context) return base

  const contextSection =
    locale === 'zh'
      ? `\n\n以下是海问平台知识库中与本次问题最相关的资料，请优先基于这些内容回答，并在适当时说明信息来源：\n\n---\n${context}\n---`
      : `\n\nThe following are the most relevant documents from the HQ platform knowledge base. Please prioritize this content in your response and reference it where appropriate:\n\n---\n${context}\n---`

  return base + contextSection
}

export async function POST(req: NextRequest) {
  try {
    const { messages, locale } = await req.json()

    const apiKey = process.env.DEEPSEEK_API_KEY

    if (!apiKey || apiKey === 'sk-your-deepseek-api-key') {
      return NextResponse.json(
        { error: 'API_KEY_NOT_CONFIGURED' },
        { status: 503 }
      )
    }

    // 取最后一条用户消息作为检索 query
    const lastUserMsg = [...messages].reverse().find((m: { role: string }) => m.role === 'user')
    const query = lastUserMsg?.content ?? ''

    // RAG 检索（检索失败不影响主流程，静默降级）
    let context = ''
    try {
      const docs = await retrieveContext(query, { matchCount: 5, minSimilarity: 0.35 })
      context = formatContext(docs)
    } catch {
      // 向量库未就绪时静默跳过，仍使用原始 LLM 能力
    }

    const systemPrompt = buildSystemPrompt(locale, context)

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        stream: true,
        max_tokens: 1500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('DeepSeek API error:', response.status, errorText)
      return NextResponse.json(
        { error: 'UPSTREAM_API_ERROR' },
        { status: response.status }
      )
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (err) {
    console.error('Chat API error:', err)
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}
