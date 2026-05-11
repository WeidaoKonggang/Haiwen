import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { mockBriefings } from '../data/briefings';
import { buildBriefingSpeechText, getSpeechLanguageCode, getSpeechRate } from './briefingSpeech';

describe('briefingSpeech', () => {
  it('builds a concise localized speech script for a briefing', () => {
    const script = buildBriefingSpeechText(mockBriefings[0], 'en');

    assert.match(script, /EU buyers merge AI governance and ESG checks/);
    assert.match(script, /Prepare oversight, energy, and supplier evidence/);
  });

  it('does not repeat the title when the transcript already starts with it', () => {
    const script = buildBriefingSpeechText(
      {
        ...mockBriefings[0],
        title: {
          en: 'EU buyers merge AI governance and ESG checks',
          zh: '欧盟买家正在合并AI治理与ESG审查',
        },
        transcript: {
          en: 'EU buyers merge AI governance and ESG checks. Prepare the evidence pack before diligence starts.',
          zh: '欧盟买家正在合并AI治理与ESG审查。请在尽调前准备证据包。',
        },
      },
      'en',
    );

    assert.equal(
      script,
      'EU buyers merge AI governance and ESG checks. Prepare the evidence pack before diligence starts.',
    );
  });

  it('keeps the title when the transcript starts with different context', () => {
    const script = buildBriefingSpeechText(
      {
        ...mockBriefings[0],
        title: {
          en: 'US buyers tighten AI vendor risk reviews',
          zh: '美国企业买家收紧AI供应商风险审查',
        },
        transcript: {
          en: 'Procurement teams are asking sharper questions on data handling and auditability.',
          zh: '采购团队更关注数据处理和可审计性。',
        },
      },
      'en',
    );

    assert.equal(
      script,
      'US buyers tighten AI vendor risk reviews. Procurement teams are asking sharper questions on data handling and auditability.',
    );
  });

  it('uses a Mandarin locale and Chinese content for Chinese briefings', () => {
    const script = buildBriefingSpeechText(mockBriefings[0], 'zh');

    assert.equal(getSpeechLanguageCode('zh'), 'zh-CN');
    assert.equal(getSpeechRate('zh'), 0.9);
    assert.match(script, /欧盟买家正在合并AI治理与ESG审查/);
  });

  it('uses a US English locale for English briefings', () => {
    assert.equal(getSpeechLanguageCode('en'), 'en-US');
    assert.equal(getSpeechRate('en'), 0.92);
  });
});
