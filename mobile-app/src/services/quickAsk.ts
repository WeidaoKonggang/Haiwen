import { getMockConsultationResponse } from '../data/mockAi';
import { formatDate } from '../data/mockAi';
import type { ConsultationResult, Language } from '../types';

type EnvSource = Record<string, string | undefined>;

type DeepSeekConfig = {
  apiKey: string;
  apiUrl: string;
  model: string;
};

type DeepSeekMessage = {
  role: 'system' | 'user';
  content: string;
};

type AskQuickQuestionOptions = {
  fetcher?: typeof fetch;
  now?: Date;
};

const PLACEHOLDER_API_KEY = 'replace_with_your_deepseek_api_key';

export function resolveDeepSeekConfig(env: EnvSource = process.env): DeepSeekConfig | null {
  const apiKey = env.EXPO_PUBLIC_DEEPSEEK_API_KEY?.trim();

  if (!apiKey || apiKey === PLACEHOLDER_API_KEY) {
    return null;
  }

  return {
    apiKey,
    apiUrl: env.EXPO_PUBLIC_DEEPSEEK_API_URL?.trim() || 'https://api.deepseek.com/chat/completions',
    model: env.EXPO_PUBLIC_DEEPSEEK_MODEL?.trim() || 'deepseek-chat',
  };
}

export function buildQuickAskMessages(question: string, language: Language): DeepSeekMessage[] {
  const languageInstruction =
    language === 'zh'
      ? '请使用中文回答。所有 bullet points 和“为什么重要”都必须使用中文。'
      : 'Answer in concise business English.';
  const userPrompt =
    language === 'zh'
      ? `请用中文回答以下问题，即使问题里包含英文术语也不要切换成英文：${question}`
      : `Answer the following question in concise business English: ${question}`;

  return [
    {
      role: 'system',
      content: [
        'You are Haiwen Companion, a lightweight ESG and globalization advisor for Chinese AI enterprise managers.',
        languageInstruction,
        'Return 3 to 5 short bullet points, then a final line starting with "Why this matters:" or "为什么重要：".',
        'Keep the answer practical, executive-friendly, and suitable for a mobile commute session.',
      ].join(' '),
    },
    {
      role: 'user',
      content: userPrompt,
    },
  ];
}

export async function askQuickQuestion(
  question: string,
  language: Language,
  options: AskQuickQuestionOptions = {},
): Promise<ConsultationResult> {
  const now = options.now ?? new Date();
  const config = resolveDeepSeekConfig();

  if (!config) {
    return getMockConsultationResponse(question, now, language);
  }

  try {
    const content = await requestDeepSeekAnswer(question, language, config, options.fetcher ?? fetch);
    return mapDeepSeekResponseToConsultation(question, content, now, language);
  } catch (error) {
    console.warn('DeepSeek request failed; using mock Quick Ask response.', error);
    return getMockConsultationResponse(question, now, language);
  }
}

export async function requestDeepSeekAnswer(
  question: string,
  language: Language,
  config: DeepSeekConfig,
  fetcher: typeof fetch,
) {
  const response = await fetcher(config.apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      messages: buildQuickAskMessages(question, language),
      temperature: 0.3,
      max_tokens: 520,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek request failed with status ${response.status}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('DeepSeek response did not include message content');
  }

  return content.trim();
}

export function mapDeepSeekResponseToConsultation(
  question: string,
  content: string,
  now = new Date(),
  language: Language = 'en',
): ConsultationResult {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const whyIndex = lines.findIndex((line) =>
    /^(why this matters|why it matters|为什么重要|重要性)[:：]/i.test(line),
  );

  const bulletSource = whyIndex >= 0 ? lines.slice(0, whyIndex) : lines;
  const bullets = bulletSource
    .map((line) => line.replace(/^[-*•\d.、)\s]+/, '').trim())
    .filter(Boolean)
    .slice(0, 5);

  const whyThisMatters =
    whyIndex >= 0
      ? lines[whyIndex].replace(/^(why this matters|why it matters|为什么重要|重要性)[:：]\s*/i, '').trim()
      : lines.slice(3).join(' ') ||
        (language === 'zh'
          ? '这能帮助管理层把复杂的ESG和全球化变化转化为下一步行动。'
          : 'This helps leadership turn broad ESG and globalization change into a short next action.');

  return {
    id: `consultation-${Date.now()}`,
    language,
    title: question.trim(),
    question: question.trim(),
    bullets: bullets.length > 0 ? bullets : [content],
    whyThisMatters,
    createdAt: formatDate(now),
  };
}
