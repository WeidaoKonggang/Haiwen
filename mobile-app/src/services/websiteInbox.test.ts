import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { WEBSITE_URL } from '../data/website';
import { mockBriefings } from '../data/briefings';
import { getMockConsultationResponse } from '../data/mockAi';
import {
  createWebsiteInboxPayloadFromBriefing,
  createWebsiteInboxPayloadFromConsultation,
  createWebsiteInboxPayloadFromSavedItem,
  getWebsiteInboxItemCount,
  isValidSyncCode,
  normalizeSyncCode,
  saveToWebsiteInbox,
  syncSavedItemsToWebsiteInbox,
} from './websiteInbox';
import { createSavedFromBriefing } from '../state/savedItems';

describe('website inbox sync', () => {
  it('normalizes and validates six-character sync codes', () => {
    assert.equal(normalizeSyncCode(' ab-12 3c '), 'AB123C');
    assert.equal(isValidSyncCode('AB123C'), true);
    assert.equal(isValidSyncCode('12345'), false);
  });

  it('maps a briefing into the HQ inbox API payload', () => {
    const payload = createWebsiteInboxPayloadFromBriefing(mockBriefings[0], 'en');

    assert.equal(payload.title, mockBriefings[0].title.en);
    assert.equal(payload.summary, mockBriefings[0].summary.en);
    assert.equal(payload.tag, mockBriefings[0].category);
    assert.equal(payload.region, mockBriefings[0].region);
    assert.equal(payload.source_url, mockBriefings[0].url);
    assert.equal(payload.source_type, 'push');
  });

  it('maps a consultation result into the HQ inbox API payload', () => {
    const consultation = getMockConsultationResponse('What should we watch?');
    const payload = createWebsiteInboxPayloadFromConsultation(consultation);

    assert.equal(payload.title, consultation.title);
    assert.equal(payload.tag, 'Quick Ask');
    assert.equal(payload.region, 'Global');
    assert.equal(payload.source_url, WEBSITE_URL);
    assert.equal(payload.source_type, 'push');
    assert.ok(payload.summary.includes(consultation.question));
  });

  it('maps an existing saved item into the HQ inbox API payload', () => {
    const savedItem = createSavedFromBriefing(mockBriefings[0], new Date('2026-05-04T00:00:00.000Z'), 'en');
    const payload = createWebsiteInboxPayloadFromSavedItem(savedItem);

    assert.equal(payload.title, savedItem.title);
    assert.equal(payload.summary, 'Saved from Haiwen Companion on 2026-05-04.');
    assert.equal(payload.tag, 'Briefing');
    assert.equal(payload.region, 'Global');
    assert.equal(payload.source_url, savedItem.url);
    assert.equal(payload.source_type, 'push');
  });

  it('posts saved items to the website inbox endpoint with sync code', async () => {
    const calls: Array<{ url: string; body: unknown }> = [];
    const payload = createWebsiteInboxPayloadFromBriefing(mockBriefings[0], 'en');

    await saveToWebsiteInbox(payload, 'AB123C', {
      fetcher: async (url, init) => {
        calls.push({
          url: String(url),
          body: JSON.parse(String(init?.body)),
        });

        return {
          ok: true,
          text: async () => '',
        } as Response;
      },
    });

    assert.equal(calls[0].url, `${WEBSITE_URL}/api/inbox/save`);
    assert.deepEqual(calls[0].body, {
      sync_code: 'AB123C',
      ...payload,
    });
  });

  it('checks website inbox items with the read-side code parameter', async () => {
    const count = await getWebsiteInboxItemCount('AB123C', {
      fetcher: async (url) => {
        assert.equal(String(url), `${WEBSITE_URL}/api/inbox?code=AB123C`);

        return {
          ok: true,
          json: async () => ({
            items: [{ id: 'one' }, { id: 'two' }],
          }),
          text: async () => '',
        } as Response;
      },
    });

    assert.equal(count, 2);
  });

  it('posts existing local saved items after a sync code is linked', async () => {
    const savedItems = [
      createSavedFromBriefing(mockBriefings[0], new Date('2026-05-04T00:00:00.000Z'), 'en'),
      createSavedFromBriefing(mockBriefings[1], new Date('2026-05-04T00:00:00.000Z'), 'en'),
    ];
    const bodies: unknown[] = [];

    const result = await syncSavedItemsToWebsiteInbox(savedItems, 'AB123C', {
      fetcher: async (_url, init) => {
        bodies.push(JSON.parse(String(init?.body)));

        return {
          ok: true,
          text: async () => '',
        } as Response;
      },
    });

    assert.equal(result.successCount, 2);
    assert.equal(result.errorCount, 0);
    assert.equal(bodies.length, 2);
  });
});
