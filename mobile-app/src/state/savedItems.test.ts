import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  createSavedFromBriefing,
  createSavedFromConsultation,
  deserializeSavedItems,
  serializeSavedItems,
  upsertSavedItem,
} from './savedItems';
import { mockBriefings } from '../data/briefings';
import { getMockConsultationResponse } from '../data/mockAi';

describe('saved item helpers', () => {
  it('creates website handoff items from briefing cards', () => {
    const saved = createSavedFromBriefing(mockBriefings[0], new Date('2026-05-02T00:00:00.000Z'), 'zh');

    assert.equal(saved.type, 'Briefing');
    assert.equal(saved.date, '2026-05-02');
    assert.equal(saved.url, 'https://hq-haiwhen.vercel.app/briefings/eu-ai-act-esg-reporting');
    assert.match(saved.title, /欧盟/);
  });

  it('deduplicates saved items by source and type', () => {
    const consultation = getMockConsultationResponse('What ESG updates should AI firms watch this week?');
    const saved = createSavedFromConsultation(consultation, new Date('2026-05-02T00:00:00.000Z'));

    const once = upsertSavedItem([], saved);
    const twice = upsertSavedItem(once, saved);

    assert.equal(twice.length, 1);
    assert.equal(twice[0].title, consultation.title);
  });

  it('serializes and restores saved items for local persistence', () => {
    const saved = createSavedFromBriefing(mockBriefings[0], new Date('2026-05-02T00:00:00.000Z'));
    const serialized = serializeSavedItems([saved]);
    const restored = deserializeSavedItems(serialized);

    assert.deepEqual(restored, [saved]);
  });

  it('returns an empty list when persisted saved item data is corrupted', () => {
    assert.deepEqual(deserializeSavedItems('not-json'), []);
    assert.deepEqual(deserializeSavedItems(JSON.stringify({ id: 'wrong-shape' })), []);
  });
});
