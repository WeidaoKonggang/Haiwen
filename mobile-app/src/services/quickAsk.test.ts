import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { buildQuickAskMessages, mapDeepSeekResponseToConsultation, resolveDeepSeekConfig } from './quickAsk';

describe('quickAsk service helpers', () => {
  it('resolves DeepSeek config from Expo public env values', () => {
    const config = resolveDeepSeekConfig({
      EXPO_PUBLIC_DEEPSEEK_API_KEY: 'demo-key',
      EXPO_PUBLIC_DEEPSEEK_API_URL: 'https://api.deepseek.com/chat/completions',
      EXPO_PUBLIC_DEEPSEEK_MODEL: 'deepseek-chat',
    });

    assert.deepEqual(config, {
      apiKey: 'demo-key',
      apiUrl: 'https://api.deepseek.com/chat/completions',
      model: 'deepseek-chat',
    });
  });

  it('returns null config when the API key is not filled', () => {
    assert.equal(
      resolveDeepSeekConfig({
        EXPO_PUBLIC_DEEPSEEK_API_KEY: 'replace_with_your_deepseek_api_key',
      }),
      null,
    );
  });

  it('builds language-aware DeepSeek messages', () => {
    const messages = buildQuickAskMessages('What should we watch?', 'zh');

    assert.equal(messages[0].role, 'system');
    assert.match(messages[0].content, /请使用中文回答/);
    assert.match(messages[1].content, /请用中文回答/);
    assert.match(messages[1].content, /What should we watch/);
    assert.doesNotMatch(messages[0].content, /Answer in concise business English/);
  });

  it('maps DeepSeek text into the app consultation format', () => {
    const result = mapDeepSeekResponseToConsultation(
      'Question?',
      `- First point\n- Second point\n- Third point\n\nWhy this matters: It changes the next decision.`,
      new Date('2026-05-02T00:00:00.000Z'),
    );

    assert.equal(result.bullets.length, 3);
    assert.equal(result.whyThisMatters, 'It changes the next decision.');
    assert.equal(result.createdAt, '2026-05-02');
  });

  it('maps Chinese DeepSeek text and remembers the answer language', () => {
    const result = mapDeepSeekResponseToConsultation(
      '本周AI企业应关注哪些ESG更新？',
      `- 关注欧盟AI治理与ESG披露的交叉要求\n- 检查供应链数据合规准备\n- 为管理层准备一页式风险摘要\n\n为什么重要：这能帮助管理层把政策变化转化为下一步行动。`,
      new Date('2026-05-02T00:00:00.000Z'),
      'zh',
    );

    assert.equal(result.language, 'zh');
    assert.equal(result.bullets.length, 3);
    assert.equal(result.whyThisMatters, '这能帮助管理层把政策变化转化为下一步行动。');
  });
});
