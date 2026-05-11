import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  buildJuheNewsUrl,
  fetchJuheArticles,
  filterHaiwenRelevantNews,
  mapJuheArticleToBriefing,
  parseJuheNewsTypes,
  resolveJuheNewsConfig,
  selectDailyBriefingArticles,
} from './juheNews';

describe('juheNews helpers', () => {
  const env = {
    EXPO_PUBLIC_JUHE_NEWS_KEY: 'juhe-key',
    EXPO_PUBLIC_JUHE_NEWS_BASE_URL: 'https://v.juhe.cn/toutiao',
    EXPO_PUBLIC_JUHE_NEWS_TYPES: 'guoji, keji, caijing',
    EXPO_PUBLIC_JUHE_NEWS_PAGE_SIZE: '8',
    EXPO_PUBLIC_JUHE_NEWS_PAGE_COUNT: '4',
  };

  it('returns null when the API key is still a placeholder', () => {
    assert.equal(
      resolveJuheNewsConfig({
        ...env,
        EXPO_PUBLIC_JUHE_NEWS_KEY: 'replace_with_your_juhe_news_key',
      }),
      null,
    );
  });

  it('resolves config and news categories from env', () => {
    const config = resolveJuheNewsConfig(env);

    assert.deepEqual(config?.types, ['guoji', 'keji', 'caijing']);
    assert.equal(config?.pageSize, 8);
    assert.equal(config?.pageCount, 4);
  });

  it('builds Juhe list request URLs without exposing keys in code', () => {
    const config = resolveJuheNewsConfig(env);
    assert.ok(config);

    const url = buildJuheNewsUrl(config, 'keji', 3);
    const parsed = new URL(url);

    assert.equal(parsed.origin + parsed.pathname, 'https://v.juhe.cn/toutiao/index');
    assert.equal(parsed.searchParams.get('type'), 'keji');
    assert.equal(parsed.searchParams.get('page'), '3');
    assert.equal(parsed.searchParams.get('page_size'), '8');
    assert.equal(parsed.searchParams.get('is_filter'), '1');
    assert.equal(parsed.searchParams.get('key'), 'juhe-key');
  });

  it('loads multiple pages for each configured category', async () => {
    const config = resolveJuheNewsConfig({
      ...env,
      EXPO_PUBLIC_JUHE_NEWS_TYPES: 'guoji,keji',
      EXPO_PUBLIC_JUHE_NEWS_PAGE_COUNT: '2',
    });
    assert.ok(config);

    const requestedUrls: string[] = [];
    const articles = await fetchJuheArticles(config, async (url) => {
      requestedUrls.push(String(url));
      const articleId = requestedUrls.length;
      const titles = [
        'EU AI Act procurement signal',
        'Singapore data compliance update',
        'Southeast Asia market entry note',
        'United States AI risk review',
      ];

      return {
        ok: true,
        json: async () => ({
          error_code: 0,
          result: {
            data: [
              {
                uniquekey: `article-${articleId}`,
                title: titles[articleId - 1] ?? `Distinct news item ${articleId}`,
                url: `https://example.com/news/${articleId}`,
              },
            ],
          },
        }),
      } as Response;
    });

    assert.equal(requestedUrls.length, 4);
    assert.equal(articles.length, 4);
    assert.deepEqual(
      requestedUrls.map((url) => new URL(url).searchParams.get('page')),
      ['1', '2', '1', '2'],
    );
  });

  it('filters for ESG, AI, compliance, and globalization signals', () => {
    const articles = [
      {
        uniquekey: '1',
        title: '欧盟人工智能监管推动企业合规升级',
        date: '2026-05-02 09:00:00',
        category: '科技',
        author_name: 'News',
        url: 'https://example.com/ai',
        is_content: '1',
      },
      {
        uniquekey: '2',
        title: '本地文化活动周末开幕',
        date: '2026-05-02 09:00:00',
        category: '头条',
        author_name: 'News',
        url: 'https://example.com/life',
        is_content: '0',
      },
    ];

    assert.deepEqual(filterHaiwenRelevantNews(articles).map((article) => article.uniquekey), ['1']);
  });

  it('selects distinct original-link articles and fills beyond ESG matches', () => {
    const articles = [
      {
        uniquekey: '1',
        title: 'Inspur Software releases AI model health check solution',
        url: 'https://example.com/a?utm=1',
      },
      {
        uniquekey: '2',
        title: 'Inspur Software launches AI model health-check solution',
        url: 'https://example.com/b',
      },
      {
        uniquekey: '3',
        title: 'General market news',
        url: 'https://example.com/c',
      },
      {
        uniquekey: '4',
        title: 'No original link',
        url: '',
      },
      {
        uniquekey: '5',
        title: 'HQ fallback link',
        url: 'https://hq-haiwhen.vercel.app/briefings/mock',
      },
    ];

    const selected = selectDailyBriefingArticles(articles);

    assert.deepEqual(
      selected.map((article) => article.uniquekey),
      ['1', '3'],
    );
  });

  it('maps a Juhe article into a bilingual briefing fallback', () => {
    const briefing = mapJuheArticleToBriefing({
      uniquekey: 'abc123',
      title: '新加坡加强AI企业数据合规要求',
      date: '2026-05-02 12:00:00',
      category: '科技',
      author_name: '中国网',
      url: 'https://example.com/news',
      is_content: '1',
    });

    assert.equal(briefing.id, 'juhe-abc123');
    assert.equal(briefing.source, 'api');
    assert.equal(briefing.region, 'Singapore');
    assert.equal(briefing.category, 'Data Compliance');
    assert.match(briefing.summary.zh, /中国网/);
    assert.match(briefing.transcript.zh, /新加坡加强AI企业数据合规要求/);
  });

  it('uses an English fallback title when live Juhe titles are Chinese', () => {
    const chineseTitle = '\u65b0\u52a0\u5761\u52a0\u5f3aAI\u4f01\u4e1a\u6570\u636e\u5408\u89c4\u8981\u6c42';
    const briefing = mapJuheArticleToBriefing({
      uniquekey: 'translated-fallback',
      title: chineseTitle,
      date: '2026-05-02 12:00:00',
      category: '\u79d1\u6280',
      author_name: '\u4e2d\u56fd\u7f51',
      url: 'https://example.com/news',
      is_content: '1',
    });

    assert.equal(briefing.title.zh, chineseTitle);
    assert.match(briefing.title.en, /Singapore Data Compliance/);
    assert.doesNotMatch(briefing.title.en, /[\u3400-\u9fff]/);
    assert.doesNotMatch(briefing.summary.en, /[\u3400-\u9fff]/);
  });

  it('parses categories with a conservative default', () => {
    assert.deepEqual(parseJuheNewsTypes(''), ['guoji', 'keji', 'caijing']);
    assert.deepEqual(parseJuheNewsTypes('top,keji'), ['top', 'keji']);
  });
});
