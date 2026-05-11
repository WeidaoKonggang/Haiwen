import HmacSHA256 from 'crypto-js/hmac-sha256';
import Base64 from 'crypto-js/enc-base64';
import { Buffer } from 'buffer';

type Env = Record<string, string | undefined>;

export type XfyunTtsConfig = {
  appId: string;
  apiKey: string;
  apiSecret: string;
  url: string;
  voice: string;
  speed: number;
  volume: number;
  pitch: number;
};

export type XfyunTtsRequest = {
  header: {
    app_id: string;
    status: 2;
  };
  parameter: {
    oral: {
      oral_level: string;
      spark_assist: 1;
      stop_split: 0;
      remain: 0;
    };
    tts: {
      vcn: string;
      speed: number;
      volume: number;
      pitch: number;
      bgs: 0;
      reg: 0;
      rdn: 0;
      rhy: 0;
      audio: {
        encoding: 'lame';
        sample_rate: 24000;
        channels: 1;
        bit_depth: 16;
        frame_size: 0;
      };
    };
  };
  payload: {
    text: {
      encoding: 'utf8';
      compress: 'raw';
      format: 'plain';
      status: 2;
      seq: 0;
      text: string;
    };
  };
};

type XfyunWebSocketResponse = {
  header?: {
    code?: number;
    message?: string;
    sid?: string;
    status?: number;
  };
  payload?: {
    audio?: {
      audio?: string;
      status?: number;
    };
  };
};

type WebSocketFactory = (url: string) => WebSocket;

const DEFAULT_XFYUN_TTS_URL = 'wss://cbm01.cn-huabei-1.xf-yun.com/v1/private/mcd9m97e6';
const DEFAULT_XFYUN_VOICE = 'x5_lingxiaoxuan_flow';

const PLACEHOLDER_PATTERNS = ['replace_with_', 'your_', '填写', '你的'];

export function resolveXfyunTtsConfig(env: Env = process.env): XfyunTtsConfig | null {
  const appId = cleanEnvValue(env.EXPO_PUBLIC_XFYUN_TTS_APP_ID);
  const apiKey = cleanEnvValue(env.EXPO_PUBLIC_XFYUN_TTS_API_KEY);
  const apiSecret = cleanEnvValue(env.EXPO_PUBLIC_XFYUN_TTS_API_SECRET);
  const url = cleanEnvValue(env.EXPO_PUBLIC_XFYUN_TTS_URL) || DEFAULT_XFYUN_TTS_URL;
  const voice = cleanEnvValue(env.EXPO_PUBLIC_XFYUN_TTS_VOICE) || DEFAULT_XFYUN_VOICE;

  if (!appId || !apiKey || !apiSecret || !url || !voice) {
    return null;
  }

  return {
    appId,
    apiKey,
    apiSecret,
    url,
    voice,
    speed: parseBoundedNumber(env.EXPO_PUBLIC_XFYUN_TTS_SPEED, 45, 0, 100),
    volume: parseBoundedNumber(env.EXPO_PUBLIC_XFYUN_TTS_VOLUME, 70, 0, 100),
    pitch: parseBoundedNumber(env.EXPO_PUBLIC_XFYUN_TTS_PITCH, 50, 0, 100),
  };
}

export function buildXfyunTtsAuthUrl(config: XfyunTtsConfig, date = new Date().toUTCString()) {
  const endpoint = new URL(config.url);
  const requestPath = `${endpoint.pathname}${endpoint.search}`;
  const signatureOrigin = [
    `host: ${endpoint.host}`,
    `date: ${date}`,
    `GET ${requestPath} HTTP/1.1`,
  ].join('\n');
  const signature = HmacSHA256(signatureOrigin, config.apiSecret).toString(Base64);
  const authorizationOrigin = [
    `api_key="${config.apiKey}"`,
    'algorithm="hmac-sha256"',
    'headers="host date request-line"',
    `signature="${signature}"`,
  ].join(', ');
  const authorization = Buffer.from(authorizationOrigin, 'utf8').toString('base64');

  endpoint.searchParams.set('authorization', authorization);
  endpoint.searchParams.set('date', date);
  endpoint.searchParams.set('host', endpoint.host);

  return endpoint.toString();
}

export function buildXfyunTtsRequest(config: XfyunTtsConfig, text: string): XfyunTtsRequest {
  return {
    header: {
      app_id: config.appId,
      status: 2,
    },
    parameter: {
      oral: {
        oral_level: 'mid',
        spark_assist: 1,
        stop_split: 0,
        remain: 0,
      },
      tts: {
        vcn: config.voice,
        speed: config.speed,
        volume: config.volume,
        pitch: config.pitch,
        bgs: 0,
        reg: 0,
        rdn: 0,
        rhy: 0,
        audio: {
          encoding: 'lame',
          sample_rate: 24000,
          channels: 1,
          bit_depth: 16,
          frame_size: 0,
        },
      },
    },
    payload: {
      text: {
        encoding: 'utf8',
        compress: 'raw',
        format: 'plain',
        status: 2,
        seq: 0,
        text: Buffer.from(text.trim(), 'utf8').toString('base64'),
      },
    },
  };
}

export function combineBase64AudioChunks(chunks: string[]) {
  return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk, 'base64'))).toString('base64');
}

export async function synthesizeXfyunSpeech(
  text: string,
  config = resolveXfyunTtsConfig(),
  createWebSocket: WebSocketFactory = (url) => new WebSocket(url),
) {
  if (!config) {
    throw new Error('XFYUN_TTS_CONFIG_MISSING');
  }

  const cleanedText = text.trim();
  if (!cleanedText) {
    throw new Error('XFYUN_TTS_TEXT_EMPTY');
  }

  return new Promise<string>((resolve, reject) => {
    const chunks: string[] = [];
    const socket = createWebSocket(buildXfyunTtsAuthUrl(config));
    let settled = false;

    const settle = (callback: () => void) => {
      if (settled) {
        return;
      }

      settled = true;
      callback();
      try {
        socket.close();
      } catch {
        // Ignore close errors after the promise is settled.
      }
    };

    socket.onopen = () => {
      socket.send(JSON.stringify(buildXfyunTtsRequest(config, cleanedText)));
    };

    socket.onerror = () => {
      settle(() => reject(new Error('XFYUN_TTS_SOCKET_ERROR')));
    };

    socket.onmessage = (event) => {
      try {
        const response = JSON.parse(String(event.data)) as XfyunWebSocketResponse;
        const code = response.header?.code ?? 0;

        if (code !== 0) {
          settle(() => reject(new Error(response.header?.message || `XFYUN_TTS_ERROR_${code}`)));
          return;
        }

        const audioChunk = response.payload?.audio?.audio;
        if (audioChunk) {
          chunks.push(audioChunk);
        }

        const status = response.header?.status ?? response.payload?.audio?.status;
        if (status === 2) {
          settle(() => resolve(combineBase64AudioChunks(chunks)));
        }
      } catch (error) {
        settle(() => reject(error instanceof Error ? error : new Error('XFYUN_TTS_PARSE_ERROR')));
      }
    };
  });
}

function cleanEnvValue(value: string | undefined) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return '';
  }

  const normalized = trimmed.toLowerCase();
  if (PLACEHOLDER_PATTERNS.some((pattern) => normalized.includes(pattern))) {
    return '';
  }

  return trimmed;
}

function parseBoundedNumber(value: string | undefined, fallback: number, min: number, max: number) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(Math.max(parsed, min), max);
}
