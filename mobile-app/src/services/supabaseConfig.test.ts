import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { resolveSupabaseConfig } from './supabaseConfig';

describe('supabase config', () => {
  it('returns null when Supabase env values are not configured', () => {
    assert.equal(resolveSupabaseConfig({}), null);
    assert.equal(
      resolveSupabaseConfig({
        EXPO_PUBLIC_SUPABASE_URL: 'replace_with_your_supabase_project_url',
        EXPO_PUBLIC_SUPABASE_ANON_KEY: 'replace_with_your_supabase_anon_key',
      }),
      null,
    );
  });

  it('resolves the public Supabase URL and anon key for Expo', () => {
    const config = resolveSupabaseConfig({
      EXPO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      EXPO_PUBLIC_SUPABASE_ANON_KEY: 'eyJ.fake-public-anon-key',
    });

    assert.deepEqual(config, {
      url: 'https://example.supabase.co',
      anonKey: 'eyJ.fake-public-anon-key',
    });
  });
});
