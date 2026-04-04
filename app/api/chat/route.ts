import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT_ZH = `你是海问（HQ），一位专注于以下领域的专业AI顾问：

1. 帮助中国AI企业制定国际化出海战略（市场进入策略、本地化、竞争格局分析）
2. ESG（环境Environment、社会Social、治理Governance）创新策略与全球标准合规
3. 跨境合规框架分析（GDPR、EU AI Act、数据本地化、行业监管等）
4. 目标市场商业机会识别与风险评估

你的回答应当：
- 专业、有据可查、具有可操作性
- 结构清晰，使用要点或分段落
- 结合真实案例和数据支撑观点
- 用中文回答中文问题，用英文回答英文问题
- 不超过600字，除非用户明确要求详细分析`

const SYSTEM_PROMPT_EN = `You are HQ (HaiWen), a professional AI consultant specializing in:

1. Helping Chinese AI companies develop international go-global strategies (market entry, localization, competitive analysis)
2. ESG (Environmental, Social, Governance) innovation strategies and global standards compliance
3. Cross-border compliance frameworks (GDPR, EU AI Act, data localization, industry regulations)
4. Target market opportunity identification and risk assessment

Your responses should be:
- Professional, evidence-based, and actionable
- Well-structured with bullet points or paragraphs
- Supported by real examples and data
- In Chinese for Chinese questions, in English for English questions
- Concise (under 600 words unless the user explicitly asks for detailed analysis)`

export async function POST(req: NextRequest) {
  try {
    const { messages, locale } = await req.json()

    const apiKey = process.env.DEEPSEEK_API_KEY

    // API Key 未配置时返回提示（不暴露内部错误）
    if (!apiKey || apiKey === 'sk-your-deepseek-api-key') {
      return NextResponse.json(
        { error: 'API_KEY_NOT_CONFIGURED' },
        { status: 503 }
      )
    }

    const systemPrompt = locale === 'zh' ? SYSTEM_PROMPT_ZH : SYSTEM_PROMPT_EN

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

    // 透传流式响应
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
