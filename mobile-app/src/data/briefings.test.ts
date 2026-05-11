import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getBriefings, mockBriefings } from './briefings';

describe('getBriefings', () => {
  it('returns API-ready briefing records with stable website URLs', async () => {
    const briefings = await getBriefings({
      loadLiveBriefings: async () => [],
    });

    assert.equal(briefings.length, 8);
    assert.equal(briefings[0].source, 'mock');
    assert.equal(briefings[0].url, 'https://hq-haiwhen.vercel.app/briefings/eu-ai-act-esg-reporting');
  });

  it('prefers live Juhe briefings when available', async () => {
    const briefings = await getBriefings({
      loadLiveBriefings: async () => [
        {
          ...mockBriefings[0],
          id: 'juhe-live-story',
          source: 'api',
          url: 'https://example.com/live',
        },
      ],
    });

    assert.equal(briefings.length, 8);
    assert.equal(briefings[0].source, 'api');
    assert.equal(briefings[0].id, 'juhe-live-story');
    assert.equal(briefings[1].source, 'mock');
  });

  it('falls back to mock briefings when live loading fails', async () => {
    const originalWarn = console.warn;
    console.warn = () => {};

    try {
      const briefings = await getBriefings({
        loadLiveBriefings: async () => {
          throw new Error('network down');
        },
      });

      assert.equal(briefings.length, 8);
      assert.deepEqual(briefings, mockBriefings.slice(0, 8));
    } finally {
      console.warn = originalWarn;
    }
  });
});
