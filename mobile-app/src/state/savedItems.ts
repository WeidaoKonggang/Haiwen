import type { BriefingItem, ConsultationResult, Language, SavedItem } from '../types';
import { WEBSITE_URL } from '../data/website';
import { formatDate } from '../data/mockAi';
import { getLocalizedText } from '../i18n';

export function createSavedFromBriefing(
  briefing: BriefingItem,
  now = new Date(),
  language: Language = 'en',
): SavedItem {
  return {
    id: `saved-briefing-${briefing.id}`,
    sourceId: briefing.id,
    title: getLocalizedText(briefing.title, language),
    type: 'Briefing',
    date: formatDate(now),
    url: briefing.url,
  };
}

export function createSavedFromConsultation(
  consultation: ConsultationResult,
  now = new Date(),
): SavedItem {
  return {
    id: `saved-consultation-${consultation.id}`,
    sourceId: consultation.id,
    title: consultation.title,
    type: 'Consultation',
    date: formatDate(now),
    url: WEBSITE_URL,
  };
}

export function upsertSavedItem(items: SavedItem[], item: SavedItem) {
  const exists = items.some(
    (existingItem) => existingItem.sourceId === item.sourceId && existingItem.type === item.type,
  );

  if (exists) {
    return items;
  }

  return [item, ...items];
}

export function serializeSavedItems(items: SavedItem[]) {
  return JSON.stringify(items);
}

export function deserializeSavedItems(value: string | null): SavedItem[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isSavedItem);
  } catch {
    return [];
  }
}

function isSavedItem(value: unknown): value is SavedItem {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const item = value as Partial<SavedItem>;

  return (
    typeof item.id === 'string' &&
    typeof item.sourceId === 'string' &&
    typeof item.title === 'string' &&
    (item.type === 'Briefing' || item.type === 'Consultation') &&
    typeof item.date === 'string' &&
    typeof item.url === 'string'
  );
}
