import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { createLinkingUrlOpener, openExternalUrlSafely } from './linkingCore';

describe('openExternalUrlSafely', () => {
  it('opens the requested URL when possible', async () => {
    const opened: string[] = [];
    const result = await openExternalUrlSafely('https://example.com/news', {
      opener: async (url) => {
        opened.push(url);
      },
      fallbackUrl: 'https://hq-haiwhen.vercel.app',
    });

    assert.equal(result, 'opened');
    assert.deepEqual(opened, ['https://example.com/news']);
  });

  it('falls back to the HQ website when an external news URL cannot open', async () => {
    const opened: string[] = [];
    const result = await openExternalUrlSafely('https://mini.eastday.com/mobile/example.html', {
      opener: async (url) => {
        opened.push(url);
        if (url.includes('mini.eastday.com')) {
          throw new Error('Unable to open URL');
        }
      },
      fallbackUrl: 'https://hq-haiwhen.vercel.app',
      onError: () => {},
    });

    assert.equal(result, 'fallback-opened');
    assert.deepEqual(opened, ['https://mini.eastday.com/mobile/example.html', 'https://hq-haiwhen.vercel.app']);
  });

  it('does not throw when both the requested URL and fallback URL fail', async () => {
    const result = await openExternalUrlSafely('https://mini.eastday.com/mobile/example.html', {
      opener: async () => {
        throw new Error('Unable to open URL');
      },
      fallbackUrl: 'https://hq-haiwhen.vercel.app',
      onError: () => {},
    });

    assert.equal(result, 'failed');
  });

  it('preserves the Linking object context when opening URLs', async () => {
    const fakeLinking = {
      opened: [] as string[],
      openURL(url: string) {
        this.opened.push(url);
        return Promise.resolve();
      },
    };

    const opener = createLinkingUrlOpener(fakeLinking);
    await opener('https://example.com/news');

    assert.deepEqual(fakeLinking.opened, ['https://example.com/news']);
  });
});
