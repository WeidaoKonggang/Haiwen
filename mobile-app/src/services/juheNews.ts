import type { BriefingItem, Category, LocalizedText, Region } from '../types';
import { resolveDeepSeekConfig } from './quickAsk';

type Env = Record<string, string | undefined>;

export type JuheNewsConfig = {
  key: string;
  baseUrl: string;
  types: string[];
  pageSize: number;
  pageCount: number;
};

export type JuheArticle = {
  uniquekey: string;
  title: string;
  date?: string;
  category?: string;
  author_name?: string;
  url?: string;
  thumbnail_pic_s?: string;
  thumbnail_pic_s02?: string;
  thumbnail_pic_s03?: string;
  is_content?: string;
};

type JuheNewsResponse = {
  reason?: string;
  error_code?: number;
  result?: {
    stat?: string;
    data?: JuheArticle[];
  };
};

type DeepSeekBriefingPayload = {
  briefings?: Array<{
    id?: string;
    title?: Partial<LocalizedText>;
    region?: Region;
    category?: Category;
    summary?: Partial<LocalizedText>;
    whyThisMatters?: Partial<LocalizedText>;
    transcript?: Partial<LocalizedText>;
  }>;
};

const DEFAULT_BASE_URL = 'https://v.juhe.cn/toutiao';
const DEFAULT_TYPES = ['guoji', 'keji', 'caijing'];
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_COUNT = 2;
const MAX_BRIEFINGS = 8;
const MAX_AI_SUMMARY_ARTICLES = 4;
const PLACEHOLDER_PATTERNS = ['replace_with_', 'your_', '填写', '你的'];

const strongRelevancePatterns = [
  /\besg\b|sustainab|climate|carbon|disclosure|governance|compliance|data|supply chain|market entry|artificial intelligence|\bai\b/i,
  /\u4eba\u5de5\u667a\u80fd|\u5927\u6a21\u578b|\u7b97\u6cd5|\u7b97\u529b|\u6a21\u578b/i,
  /\u76d1\u7ba1|\u5408\u89c4|\u6570\u636e|\u62ab\u9732|\u7eff\u8272|\u78b3|\u53ef\u6301\u7eed/i,
  /\u4f9b\u5e94\u94fe|\u51fa\u6d77|\u5168\u7403\u5316|\u8d38\u6613|\u5e02\u573a\u51c6\u5165/i,
];

const relevanceKeywords = [
  'esg',
  'sustainability',
  'sustainable',
  'climate',
  'carbon',
  'disclosure',
  'ai',
  'artificial intelligence',
  'governance',
  'compliance',
  'data',
  'supply chain',
  'global',
  'market entry',
  '人工智能',
  '大模型',
  '算法',
  '算力',
  '监管',
  '合规',
  '数据',
  '出海',
  '全球化',
  '欧盟',
  '新加坡',
  '东南亚',
  '供应链',
  '可持续',
  '碳',
  '披露',
  '绿色',
  '治理',
];

export function resolveJuheNewsConfig(env: Env = process.env): JuheNewsConfig | null {
  const key = cleanEnvValue(env.EXPO_PUBLIC_JUHE_NEWS_KEY);

  if (!key) {
    return null;
  }

  return {
    key,
    baseUrl: cleanEnvValue(env.EXPO_PUBLIC_JUHE_NEWS_BASE_URL) || DEFAULT_BASE_URL,
    types: parseJuheNewsTypes(env.EXPO_PUBLIC_JUHE_NEWS_TYPES),
    pageSize: parseBoundedNumber(env.EXPO_PUBLIC_JUHE_NEWS_PAGE_SIZE, DEFAULT_PAGE_SIZE, 1, 30),
    pageCount: parseBoundedNumber(env.EXPO_PUBLIC_JUHE_NEWS_PAGE_COUNT, DEFAULT_PAGE_COUNT, 1, 5),
  };
}

export function parseJuheNewsTypes(value: string | undefined) {
  const types = value
    ?.split(',')
    .map((type) => type.trim())
    .filter(Boolean);

  return types && types.length > 0 ? types : DEFAULT_TYPES;
}

export function buildJuheNewsUrl(config: JuheNewsConfig, type: string, page = 1) {
  const endpoint = new URL(`${config.baseUrl.replace(/\/$/, '')}/index`);
  endpoint.searchParams.set('type', type);
  endpoint.searchParams.set('page', String(page));
  endpoint.searchParams.set('page_size', String(config.pageSize));
  endpoint.searchParams.set('is_filter', '1');
  endpoint.searchParams.set('key', config.key);

  return endpoint.toString();
}

export async function fetchJuheArticles(config: JuheNewsConfig, fetcher: typeof fetch = fetch) {
  const requests = config.types.flatMap((type) =>
    Array.from({ length: config.pageCount }, (_value, index) => ({
      type,
      page: index + 1,
    })),
  );
  const responses = await Promise.all(
    requests.map(async ({ type, page }) => {
      const response = await fetcher(buildJuheNewsUrl(config, type, page));

      if (!response.ok) {
        throw new Error(`Juhe news request failed with status ${response.status}`);
      }

      const data = (await response.json()) as JuheNewsResponse;
      const errorCode = data.error_code ?? 0;

      if (errorCode !== 0) {
        throw new Error(`Juhe news error ${errorCode}: ${data.reason || 'unknown error'}`);
      }

      return data.result?.data ?? [];
    }),
  );

  return dedupeArticles(responses.flat());
}

export function filterHaiwenRelevantNews(articles: JuheArticle[]) {
  return articles.filter((article) => {
    const haystack = [
      article.title,
      article.category,
      article.author_name,
      article.url,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return strongRelevancePatterns.some((pattern) => pattern.test(haystack));
  });
}

export function selectDailyBriefingArticles(articles: JuheArticle[]) {
  const withOriginalUrls = articles.filter(hasOriginalNewsUrl);
  const relevant = filterHaiwenRelevantNews(withOriginalUrls);

  return dedupeArticles([...relevant, ...withOriginalUrls]);
}

export async function getJuheBriefings(options: { fetcher?: typeof fetch; now?: Date } = {}) {
  const config = resolveJuheNewsConfig();

  if (!config) {
    return [];
  }

  const allArticles = await fetchJuheArticles(config, options.fetcher ?? fetch);
  const articles = selectDailyBriefingArticles(allArticles).slice(0, MAX_BRIEFINGS);

  if (articles.length === 0) {
    return [];
  }

  const enriched = await summarizeArticlesWithDeepSeek(
    articles.slice(0, MAX_AI_SUMMARY_ARTICLES),
    options.fetcher ?? fetch,
  );

  if (enriched.length === 0) {
    return articles.map(mapJuheArticleToBriefing);
  }

  const enrichedIds = new Set(enriched.map((briefing) => briefing.id));
  const quickFallbacks = articles
    .map(mapJuheArticleToBriefing)
    .filter((briefing) => !enrichedIds.has(briefing.id));

  return dedupeBriefings([...enriched, ...quickFallbacks]).slice(0, MAX_BRIEFINGS);
}

export function mapJuheArticleToBriefing(article: JuheArticle): BriefingItem {
  const title = article.title.trim();
  const source = article.author_name?.trim() || article.category?.trim() || 'Juhe News';
  const region = inferRegion(title);
  const category = inferCategory(title);
  const englishTitle = buildFallbackEnglishTitle(title, region, category, article);
  const englishSource = buildFallbackEnglishSource(source);
  const summaryZh = `来自${source}的今日新闻信号，建议作为管理层快速扫描内容。`;
  const whyZh = buildWhyThisMattersZh(region, category);

  return {
    id: `juhe-${slugify(article.uniquekey || title)}`,
    source: 'api',
    url: article.url || 'https://hq-haiwhen.vercel.app',
    title: {
      en: englishTitle,
      zh: title,
    },
    region,
    category,
    summary: {
      en: `Today news signal from ${englishSource}. Review the original article for full context.`,
      zh: summaryZh,
    },
    whyThisMatters: {
      en: buildWhyThisMattersEn(region, category),
      zh: whyZh,
    },
    transcript: {
      en: `${englishTitle}. ${buildWhyThisMattersEn(region, category)}`,
      zh: `${title}。${whyZh}`,
    },
  };
}

async function summarizeArticlesWithDeepSeek(articles: JuheArticle[], fetcher: typeof fetch) {
  const config = resolveDeepSeekConfig();

  if (!config || articles.length === 0) {
    return [];
  }

  try {
    const response = await fetcher(config.apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: 'system',
            content: [
              'You create concise bilingual mobile briefings for Haiwen Companion.',
              'Audience: Chinese AI enterprise managers, ESG officers, global business leaders.',
              'Return strict JSON only. No markdown.',
              'Each briefing must fit a commute scan and avoid full legal/case-library depth.',
            ].join(' '),
          },
          {
            role: 'user',
            content: buildDeepSeekBriefingPrompt(articles),
          },
        ],
        temperature: 0.2,
        max_tokens: 1800,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek briefing request failed with status ${response.status}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (typeof content !== 'string') {
      return [];
    }

    const parsed = parseDeepSeekBriefings(content);
    return parsed.length > 0 ? mergeDeepSeekBriefings(articles, parsed) : [];
  } catch (error) {
    logBriefingSummaryFallback(error);
    return [];
  }
}

function buildDeepSeekBriefingPrompt(articles: JuheArticle[]) {
  const compactArticles = articles.map((article, index) => ({
    index,
    uniquekey: article.uniquekey,
    title: article.title,
    date: article.date,
    category: article.category,
    source: article.author_name,
    url: article.url,
  }));

  return JSON.stringify({
    instruction:
      'Select up to 8 articles most relevant to ESG, globalization, AI governance, data compliance, market entry, or sustainability. Return JSON with key "briefings".',
    allowedRegions: ['EU', 'China', 'Singapore', 'Southeast Asia', 'United States'],
    allowedCategories: ['ESG Disclosure', 'AI Governance', 'Market Entry', 'Data Compliance', 'Sustainability Reporting'],
    schema: {
      briefings: [
        {
          id: 'source uniquekey',
          title: { en: 'short English title', zh: 'short Chinese title' },
          region: 'one allowed region',
          category: 'one allowed category',
          summary: { en: 'one sentence', zh: '一句话摘要' },
          whyThisMatters: { en: 'one sentence for Chinese AI firms', zh: '一句话说明对中国AI企业的影响' },
          transcript: { en: '30-second spoken brief', zh: '30秒中文播报稿' },
        },
      ],
    },
    articles: compactArticles,
  });
}

function parseDeepSeekBriefings(content: string) {
  const jsonText = extractJson(content);

  if (!jsonText) {
    return [];
  }

  try {
    const parsed = JSON.parse(jsonText) as DeepSeekBriefingPayload;
    return Array.isArray(parsed.briefings) ? parsed.briefings : [];
  } catch {
    return [];
  }
}

function mergeDeepSeekBriefings(
  articles: JuheArticle[],
  generated: NonNullable<DeepSeekBriefingPayload['briefings']>,
): BriefingItem[] {
  const byId = new Map(articles.map((article) => [article.uniquekey, article]));

  return generated
    .map((item, index) => {
      const sourceArticle = byId.get(item.id || '') || articles[index];

      if (!sourceArticle) {
        return null;
      }

      const fallback = mapJuheArticleToBriefing(sourceArticle);

      return {
        ...fallback,
        title: mergeLocalized(fallback.title, item.title),
        region: isRegion(item.region) ? item.region : fallback.region,
        category: isCategory(item.category) ? item.category : fallback.category,
        summary: mergeLocalized(fallback.summary, item.summary),
        whyThisMatters: mergeLocalized(fallback.whyThisMatters, item.whyThisMatters),
        transcript: mergeLocalized(fallback.transcript, item.transcript),
      };
    })
    .filter((item): item is BriefingItem => Boolean(item));
}

function mergeLocalized(fallback: LocalizedText, value: Partial<LocalizedText> | undefined): LocalizedText {
  return {
    en: value?.en?.trim() || fallback.en,
    zh: value?.zh?.trim() || fallback.zh,
  };
}

function inferRegion(text: string): Region {
  const lower = text.toLowerCase();

  if (/欧盟|欧洲|eu|europe/.test(lower)) {
    return 'EU';
  }

  if (/新加坡|singapore/.test(lower)) {
    return 'Singapore';
  }

  if (/东南亚|越南|泰国|马来西亚|印尼|sea|southeast asia|vietnam|thailand|malaysia|indonesia/.test(lower)) {
    return 'Southeast Asia';
  }

  if (/美国|us|u\.s\.|united states/.test(lower)) {
    return 'United States';
  }

  return 'China';
}

function inferCategory(text: string): Category {
  const lower = text.toLowerCase();

  if (/披露|报告|esg|气候|碳|可持续|sustainability|disclosure|climate|carbon/.test(lower)) {
    return 'ESG Disclosure';
  }

  if (/数据|隐私|安全|合规|data|privacy|security|compliance/.test(lower)) {
    return 'Data Compliance';
  }

  if (/出海|市场|投资|贸易|供应链|market|entry|trade|supply chain/.test(lower)) {
    return 'Market Entry';
  }

  if (/绿色|能耗|算力|节能|green|energy/.test(lower)) {
    return 'Sustainability Reporting';
  }

  return 'AI Governance';
}

function buildWhyThisMattersZh(region: Region, category: Category) {
  const regionLabel = region === 'EU' ? '欧盟' : region === 'Southeast Asia' ? '东南亚' : region === 'United States' ? '美国' : region;
  const categoryLabel =
    category === 'AI Governance'
      ? 'AI治理'
      : category === 'Data Compliance'
        ? '数据合规'
        : category === 'Market Entry'
          ? '市场进入'
          : category === 'Sustainability Reporting'
            ? '可持续报告'
            : 'ESG披露';

  return `这可能影响中国AI企业在${regionLabel}相关业务中的${categoryLabel}准备。`;
}

function buildWhyThisMattersEn(region: Region, category: Category) {
  return `This may affect how Chinese AI firms prepare for ${category} work tied to ${region}.`;
}

function buildFallbackEnglishTitle(
  title: string,
  region: Region,
  category: Category,
  article: JuheArticle,
) {
  if (!containsCjk(title)) {
    return title;
  }

  const dateLabel = formatNewsDate(article.date);
  const shortId = slugify(article.uniquekey || article.url || title).slice(0, 6).toUpperCase();
  const suffix = dateLabel ? `${dateLabel} ${shortId}` : shortId;

  return `${region} ${category} update ${suffix}`;
}

function buildFallbackEnglishSource(source: string) {
  if (!containsCjk(source)) {
    return source;
  }

  return 'a Chinese news source';
}

function containsCjk(value: string) {
  return /[\u3400-\u9fff]/.test(value);
}

function formatNewsDate(value: string | undefined) {
  if (!value) {
    return '';
  }

  const normalized = value.replace(' ', 'T');
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function dedupeArticles(articles: JuheArticle[]) {
  const seen = new Set<string>();
  const seenTitles: string[] = [];

  return articles.filter((article) => {
    const normalizedTitle = normalizeArticleTitle(article.title);
    const keys = [
      article.uniquekey && `id:${article.uniquekey}`,
      normalizeArticleUrl(article.url) && `url:${normalizeArticleUrl(article.url)}`,
      normalizedTitle && `title:${normalizedTitle}`,
    ].filter((key): key is string => Boolean(key));

    if (
      keys.length === 0 ||
      keys.some((key) => seen.has(key)) ||
      (normalizedTitle && seenTitles.some((title) => areSimilarTitles(title, normalizedTitle)))
    ) {
      return false;
    }

    keys.forEach((key) => seen.add(key));
    if (normalizedTitle) {
      seenTitles.push(normalizedTitle);
    }
    return true;
  });
}

function dedupeBriefings(briefings: BriefingItem[]) {
  const seen = new Set<string>();

  return briefings.filter((briefing) => {
    const keys = [
      `id:${briefing.id}`,
      `url:${briefing.url}`,
      `title-en:${briefing.title.en.trim().toLowerCase()}`,
      `title-zh:${briefing.title.zh.trim()}`,
    ];

    if (keys.some((key) => seen.has(key))) {
      return false;
    }

    keys.forEach((key) => seen.add(key));
    return true;
  });
}

function hasOriginalNewsUrl(article: JuheArticle) {
  const url = article.url?.trim();
  return Boolean(url && /^https?:\/\//i.test(url) && !url.includes('hq-haiwhen.vercel.app'));
}

function normalizeArticleUrl(value: string | undefined) {
  return value?.trim().replace(/#.*$/, '').replace(/\?.*$/, '').toLowerCase() || '';
}

function normalizeArticleTitle(value: string | undefined) {
  return value?.replace(/\s+/g, '').trim().toLowerCase() || '';
}

function areSimilarTitles(a: string, b: string) {
  if (a === b) {
    return true;
  }

  const shorter = a.length < b.length ? a : b;
  const longer = a.length < b.length ? b : a;

  if (shorter.length >= 10 && longer.includes(shorter)) {
    return true;
  }

  return diceCoefficient(shorter, longer) >= 0.72;
}

function diceCoefficient(a: string, b: string) {
  const aBigrams = bigrams(a);
  const bBigrams = bigrams(b);

  if (aBigrams.length === 0 || bBigrams.length === 0) {
    return 0;
  }

  const counts = new Map<string, number>();
  aBigrams.forEach((bigram) => counts.set(bigram, (counts.get(bigram) ?? 0) + 1));

  let overlap = 0;
  bBigrams.forEach((bigram) => {
    const count = counts.get(bigram) ?? 0;
    if (count > 0) {
      overlap += 1;
      counts.set(bigram, count - 1);
    }
  });

  return (2 * overlap) / (aBigrams.length + bBigrams.length);
}

function bigrams(value: string) {
  if (value.length < 2) {
    return [];
  }

  return Array.from({ length: value.length - 1 }, (_value, index) => value.slice(index, index + 2));
}

function extractJson(content: string) {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);

  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return '';
}

function isRegion(value: unknown): value is Region {
  return ['EU', 'China', 'Singapore', 'Southeast Asia', 'United States'].includes(String(value));
}

function isCategory(value: unknown): value is Category {
  return ['ESG Disclosure', 'AI Governance', 'Market Entry', 'Data Compliance', 'Sustainability Reporting'].includes(String(value));
}

function cleanEnvValue(value: string | undefined) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return '';
  }

  const normalized = trimmed.toLowerCase();
  if (PLACEHOLDER_PATTERNS.some((pattern) => normalized.includes(pattern))) {
    return '';
  }

  return trimmed;
}

function logBriefingSummaryFallback(error: unknown) {
  if (process.env.EXPO_PUBLIC_DEBUG_BRIEFINGS !== '1') {
    return;
  }

  console.warn('DeepSeek briefing summary failed; using fast Juhe fallback cards.', error);
}

function parseBoundedNumber(value: string | undefined, fallback: number, min: number, max: number) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(Math.max(parsed, min), max);
}

function slugify(value: string) {
  const ascii = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 72);

  if (ascii) {
    return ascii;
  }

  let hash = 0;
  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }

  return hash.toString(16);
}
