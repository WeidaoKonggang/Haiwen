import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { createWebsiteInboxStorage } from './websiteInboxStorage';

describe('website inbox sync code storage', () => {
  it('falls back to memory when native storage is unavailable', async () => {
    const storage = createWebsiteInboxStorage({
      async getItem() {
        throw new Error('Native module is null');
      },
      async setItem() {
        throw new Error('Native module is null');
      },
      async removeItem() {
        throw new Error('Native module is null');
      },
    });

    await storage.persistSyncCode('AB123C');
    assert.equal(await storage.loadSyncCode(), 'AB123C');

    await storage.clearSyncCode();
    assert.equal(await storage.loadSyncCode(), '');
  });
});
