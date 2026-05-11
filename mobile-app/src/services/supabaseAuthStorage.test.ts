import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { createSupabaseAuthStorage } from './supabaseAuthStorage';

describe('supabase auth storage adapter', () => {
  it('uses memory fallback when native storage is unavailable', async () => {
    const storage = createSupabaseAuthStorage({
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

    await storage.setItem('session', 'token');
    assert.equal(await storage.getItem('session'), 'token');

    await storage.removeItem('session');
    assert.equal(await storage.getItem('session'), null);
  });
});
