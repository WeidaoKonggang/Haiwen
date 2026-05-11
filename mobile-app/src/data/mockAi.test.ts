import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getMockConsultationResponse } from './mockAi';

describe('getMockConsultationResponse', () => {
  it('returns a Southeast Asia market-entry answer with bullets and business relevance', () => {
    const result = getMockConsultationResponse(
      'Summarize key risks for entering Southeast Asia.',
      new Date('2026-05-02T00:00:00.000Z'),
    );

    assert.equal(result.id, 'consultation-summarize-key-risks-for-entering-southeast-asia');
    assert.equal(result.createdAt, '2026-05-02');
    assert.equal(result.bullets.length, 4);
    assert.match(result.bullets.join(' '), /data residency/i);
    assert.match(result.whyThisMatters, /market entry/i);
  });

  it('falls back to a general ESG and globalization answer for broad questions', () => {
    const result = getMockConsultationResponse('What should leadership review today?');

    assert.equal(result.bullets.length, 4);
    assert.match(result.whyThisMatters, /executive/i);
  });

  it('returns Chinese mock response copy when requested', () => {
    const result = getMockConsultationResponse('本周AI企业应关注哪些ESG更新？', new Date('2026-05-02T00:00:00.000Z'), 'zh');

    assert.equal(result.bullets.length, 4);
    assert.notEqual(result.id, 'consultation-');
    assert.match(result.id, /^consultation-/);
    assert.match(result.bullets[0], /AI治理/);
    assert.match(result.whyThisMatters, /管理层/);
  });
});
