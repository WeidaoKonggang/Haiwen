import { NextRequest, NextResponse } from 'next/server'
import { retrieveDiverseContext, formatContext } from '@/lib/rag'

const BASE_PROMPT_ZH = `你是海问（HQ），一位专注于中国AI企业出海与ESG创新的专业咨询顾问。你的专长领域包括：帮助中国AI企业制定国际化出海战略（市场进入策略、本地化运营、竞争格局分析）；ESG创新策略与全球标准合规管理；跨境合规框架分析（GDPR、EU AI Act、数据本地化、行业监管等）；以及目标市场商业机会识别与风险评估。

请按照以下要求回答：使用流畅自然的语言段落表达，如同专业顾问面对面交谈，语气专业但平易近人。不要使用任何markdown格式符号，不使用井号标题、星号列表、下划线或双星号加粗等格式。如需列举多个要点，请用序号加中文顿号（如"一、二、三、"）自然融入段落中，或用"首先……其次……最后……"等连贯性词语。回答要专业、有据可查、具有可操作性，结合真实案例和数据支撑观点。字数控制在600字以内，除非用户明确要求详细分析。用中文回答中文问题，用英文回答英文问题。`

const BASE_PROMPT_EN = `You are HQ (HaiWen), a professional consultant specializing in helping Chinese AI companies expand globally and manage ESG innovation. Your expertise covers go-global strategy development (market entry, localization, competitive analysis), ESG innovation and global standards compliance, cross-border compliance frameworks (GDPR, EU AI Act, data localization, industry regulations), and target market opportunity and risk assessment.

Please respond in fluent, natural language paragraphs as a professional consultant speaking directly to a client. Do not use any markdown formatting symbols — no pound signs for headers, no asterisks for bullets or bold, no underscores. If you need to enumerate points, use natural connectors like "first... second... finally..." or numbered Chinese-style connectors integrated naturally into the prose. Your answers should be professional, evidence-based, and actionable, supported by real examples and data. Keep responses under 600 words unless the user explicitly asks for a detailed analysis. Respond in Chinese for Chinese questions, in English for English questions.`

function buildSystemPrompt(locale: string, context: string): string {
  const base = locale === 'zh' ? BASE_PROMPT_ZH : BASE_PROMPT_EN

  if (!context) return base

  const contextSection =
    locale === 'zh'
      ? `\n\n以下是海问平台知识库中与本次问题最相关的资料（请严格遵守以下规则）：

规则一：回答必须优先基于下方【知识库资料】，不要只用你自己的通用知识。
规则二：凡是引用了知识库内容的地方，请在正文中用小括号自然标注，例如"（参考：EU AI Act政策条目）"、"（参考：旷视科技出海欧盟案例）"、"（参考：张明博士）"等；引用格式要简短、融入语句，不要干扰阅读。
规则三：如果知识库中有相关专家、真实案例或具体政策条目，请在回答末尾用一段简短的"推荐进一步了解"引出，例如："如需深入了解，可参考 [某案例] 或联系 [某专家]"。
规则四：如果知识库内容与用户问题不直接相关，请如实说明"知识库中暂无直接相关条目"，再基于通用知识回答。

【知识库资料】
---
${context}
---`
      : `\n\nThe following are the most relevant documents from the HQ platform knowledge base. You MUST follow these rules:

Rule 1: Prioritize the knowledge base below over your general knowledge.
Rule 2: Whenever you cite the knowledge base, add an inline parenthetical note, e.g. "(source: EU AI Act policy entry)" / "(source: Megvii EU case)" / "(source: Dr. Zhang Ming)". Keep citations short and natural.
Rule 3: If relevant experts / cases / policies exist in the knowledge base, end your reply with a short "Further reading" line referring to them by name.
Rule 4: If the knowledge base has nothing directly relevant, say so explicitly, then fall back to general knowledge.

[Knowledge Base]
---
${context}
---`

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
      const docs = await retrieveDiverseContext(query, { mainCount: 5, minSimilarity: 0.25 })
      context = formatContext(docs)

      // 调试日志：直接在 dev server 终端查看
      console.log('\n========== [RAG] ==========')
      console.log(`[RAG] Query: ${query.slice(0, 80)}${query.length > 80 ? '...' : ''}`)
      console.log(`[RAG] 命中 ${docs.length} 条文档（主检索 + 案例 + 专家）`)
      docs.forEach((d, i) => {
        const type = d.metadata?.type ?? '?'
        const snippet = d.content.split('\n').slice(0, 2).join(' | ').slice(0, 70)
        console.log(`  ${i + 1}. [${(d.similarity * 100).toFixed(1)}%] <${type}> ${snippet}`)
      })
      console.log('===========================\n')
    } catch (err) {
      console.error('[RAG] 检索失败：', err)
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
