import { WEBSITE_URL } from '../data/website';
import { getLocalizedText } from '../i18n';
import type { BriefingItem, ConsultationResult, Language, SavedItem } from '../types';

export type WebsiteInboxPayload = {
  title: string;
  summary: string;
  tag: string;
  region: string;
  source_url: string;
  source_type: string;
};

type SaveToWebsiteInboxOptions = {
  baseUrl?: string;
  fetcher?: typeof fetch;
};

type SyncSavedItemsResult = {
  successCount: number;
  errorCount: number;
  websiteItemCount?: number;
};

type WebsiteInboxListResponse = {
  items?: unknown[];
};

export function normalizeSyncCode(value: string) {
  return value.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 6);
}

export function isValidSyncCode(value: string) {
  return /^[A-Z0-9]{6}$/.test(normalizeSyncCode(value));
}

export function createWebsiteInboxPayloadFromBriefing(
  briefing: BriefingItem,
  language: Language,
): WebsiteInboxPayload {
  return {
    title: getLocalizedText(briefing.title, language),
    summary: getLocalizedText(briefing.summary, language),
    tag: briefing.category,
    region: briefing.region,
    source_url: briefing.url,
    source_type: 'push',
  };
}

export function createWebsiteInboxPayloadFromConsultation(
  consultation: ConsultationResult,
): WebsiteInboxPayload {
  return {
    title: consultation.title,
    summary: [
      consultation.question,
      ...consultation.bullets.slice(0, 3),
      consultation.whyThisMatters,
    ].join(' '),
    tag: 'Quick Ask',
    region: 'Global',
    source_url: WEBSITE_URL,
    source_type: 'push',
  };
}

export function createWebsiteInboxPayloadFromSavedItem(savedItem: SavedItem): WebsiteInboxPayload {
  return {
    title: savedItem.title,
    summary: `Saved from Haiwen Companion on ${savedItem.date}.`,
    tag: savedItem.type,
    region: 'Global',
    source_url: savedItem.url,
    source_type: 'push',
  };
}

export async function saveToWebsiteInbox(
  payload: WebsiteInboxPayload,
  syncCode: string,
  options: SaveToWebsiteInboxOptions = {},
) {
  const normalizedCode = normalizeSyncCode(syncCode);

  if (!isValidSyncCode(normalizedCode)) {
    throw new Error('Invalid website inbox sync code.');
  }

  const baseUrl = (options.baseUrl ?? WEBSITE_URL).replace(/\/$/, '');
  const fetcher = options.fetcher ?? fetch;
  const response = await fetcher(`${baseUrl}/api/inbox/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sync_code: normalizedCode,
      ...payload,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(detail || `Website inbox sync failed with status ${response.status}`);
  }
}

export async function getWebsiteInboxItemCount(
  syncCode: string,
  options: SaveToWebsiteInboxOptions = {},
) {
  const normalizedCode = normalizeSyncCode(syncCode);

  if (!isValidSyncCode(normalizedCode)) {
    throw new Error('Invalid website inbox sync code.');
  }

  const baseUrl = (options.baseUrl ?? WEBSITE_URL).replace(/\/$/, '');
  const fetcher = options.fetcher ?? fetch;
  const response = await fetcher(`${baseUrl}/api/inbox?code=${normalizedCode}`);

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(detail || `Website inbox check failed with status ${response.status}`);
  }

  const data = (await response.json()) as WebsiteInboxListResponse;
  return Array.isArray(data.items) ? data.items.length : 0;
}

export async function syncSavedItemsToWebsiteInbox(
  savedItems: SavedItem[],
  syncCode: string,
  options: SaveToWebsiteInboxOptions = {},
): Promise<SyncSavedItemsResult> {
  const results = await Promise.allSettled(
    savedItems.map((savedItem) =>
      saveToWebsiteInbox(createWebsiteInboxPayloadFromSavedItem(savedItem), syncCode, options),
    ),
  );

  const counts = results.reduce<SyncSavedItemsResult>(
    (counts, result) => {
      if (result.status === 'fulfilled') {
        counts.successCount += 1;
      } else {
        counts.errorCount += 1;
      }

      return counts;
    },
    { successCount: 0, errorCount: 0 },
  );

  if (counts.successCount > 0) {
    try {
      counts.websiteItemCount = await getWebsiteInboxItemCount(syncCode, options);
    } catch {
      // The write already succeeded; the UI can still show a softer local status.
    }
  }

  return counts;
}
