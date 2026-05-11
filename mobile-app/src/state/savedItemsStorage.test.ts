import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { createSavedItemsStorage } from './savedItemsStorage';
import { createSavedFromConsultation } from './savedItems';
import { getMockConsultationResponse } from '../data/mockAi';

describe('saved items storage adapter', () => {
  it('falls back to memory when native storage throws', async () => {
    const originalWarn = console.warn;
    console.warn = () => {};

    const storage = createSavedItemsStorage({
      async getItem() {
        throw new Error('Native module is null');
      },
      async setItem() {
        throw new Error('Native module is null');
      },
    });
    const saved = createSavedFromConsultation(getMockConsultationResponse('Question?'));

    try {
      await storage.persistSavedItems([saved]);
      const restored = await storage.loadSavedItems();

      assert.deepEqual(restored, [saved]);
    } finally {
      console.warn = originalWarn;
    }
  });
});
