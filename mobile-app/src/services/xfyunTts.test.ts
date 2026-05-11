import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  buildXfyunTtsAuthUrl,
  buildXfyunTtsRequest,
  combineBase64AudioChunks,
  resolveXfyunTtsConfig,
} from './xfyunTts';

describe('xfyunTts helpers', () => {
  const env = {
    EXPO_PUBLIC_XFYUN_TTS_APP_ID: 'appid123',
    EXPO_PUBLIC_XFYUN_TTS_API_KEY: 'key123',
    EXPO_PUBLIC_XFYUN_TTS_API_SECRET: 'secret123',
    EXPO_PUBLIC_XFYUN_TTS_URL: 'wss://cbm01.cn-huabei-1.xf-yun.com/v1/private/demo',
    EXPO_PUBLIC_XFYUN_TTS_VOICE: 'x5_lingxiaoxuan_flow',
  };

  it('returns null until all required values are filled', () => {
    assert.equal(
      resolveXfyunTtsConfig({
        ...env,
        EXPO_PUBLIC_XFYUN_TTS_API_SECRET: 'replace_with_your_xfyun_api_secret',
      }),
      null,
    );
  });

  it('resolves optional voice settings with stable defaults', () => {
    const config = resolveXfyunTtsConfig(env);

    assert.equal(config?.appId, 'appid123');
    assert.equal(config?.voice, 'x5_lingxiaoxuan_flow');
    assert.equal(config?.speed, 45);
    assert.equal(config?.volume, 70);
    assert.equal(config?.pitch, 50);
  });

  it('builds a websocket auth URL with host, date, and authorization params', () => {
    const config = resolveXfyunTtsConfig(env);
    assert.ok(config);

    const url = buildXfyunTtsAuthUrl(config, 'Sat, 02 May 2026 08:00:00 GMT');
    const parsed = new URL(url);

    assert.match(url, /^wss:\/\/cbm01\.cn-huabei-1\.xf-yun\.com\/v1\/private\/demo\?/);
    assert.ok(parsed.searchParams.get('authorization'));
    assert.equal(parsed.searchParams.get('date'), 'Sat, 02 May 2026 08:00:00 GMT');
    assert.equal(parsed.searchParams.get('host'), 'cbm01.cn-huabei-1.xf-yun.com');
  });

  it('builds a super-human TTS request body with base64 text payload', () => {
    const config = resolveXfyunTtsConfig(env);
    assert.ok(config);

    const request = buildXfyunTtsRequest(config, '今日简报测试');

    assert.equal(request.header.app_id, 'appid123');
    assert.equal(request.header.status, 2);
    assert.equal(request.parameter.tts.vcn, 'x5_lingxiaoxuan_flow');
    assert.equal(request.parameter.tts.audio.encoding, 'lame');
    assert.equal(Buffer.from(request.payload.text.text, 'base64').toString('utf8'), '今日简报测试');
  });

  it('combines websocket base64 audio chunks safely', () => {
    const first = Buffer.from('hello ', 'utf8').toString('base64');
    const second = Buffer.from('audio', 'utf8').toString('base64');

    assert.equal(Buffer.from(combineBase64AudioChunks([first, second]), 'base64').toString('utf8'), 'hello audio');
  });
});
