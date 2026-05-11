import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getLocalizedText, translateCategory, translateRegion, uiText } from './i18n';

describe('i18n helpers', () => {
  it('returns localized text and falls back to English', () => {
    assert.equal(getLocalizedText({ en: 'Briefing', zh: '简报' }, 'zh'), '简报');
    assert.equal(getLocalizedText({ en: 'Briefing', zh: '' }, 'zh'), 'Briefing');
  });

  it('translates regions and categories for Chinese mode', () => {
    assert.equal(translateRegion('Southeast Asia', 'zh'), '东南亚');
    assert.equal(translateCategory('AI Governance', 'zh'), 'AI治理');
  });

  it('exposes compact tab labels in both languages', () => {
    assert.equal(uiText.en.tabs.briefing, 'Brief');
    assert.equal(uiText.zh.tabs.briefing, '简报');
  });
});
