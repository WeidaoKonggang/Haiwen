import { getLocalizedText } from '../i18n';
import type { BriefingItem, Language } from '../types';

export function buildBriefingSpeechText(briefing: BriefingItem, language: Language) {
  const title = getLocalizedText(briefing.title, language).trim();
  const transcript = getLocalizedText(briefing.transcript, language).trim();

  if (!title || transcriptStartsWithTitle(transcript, title)) {
    return transcript;
  }

  if (!transcript) {
    return title;
  }

  return [title, transcript].filter(Boolean).join('. ');
}

function transcriptStartsWithTitle(transcript: string, title: string) {
  if (!transcript || !title) {
    return false;
  }

  return normalizeForSpeechComparison(transcript).startsWith(normalizeForSpeechComparison(title));
}

function normalizeForSpeechComparison(value: string) {
  return value
    .toLowerCase()
    .replace(/[.,!?;:，。！？；：'"“”‘’()[\]{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getSpeechLanguageCode(language: Language) {
  return language === 'zh' ? 'zh-CN' : 'en-US';
}

export function getSpeechRate(language: Language) {
  return language === 'zh' ? 0.9 : 0.92;
}
