import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { getWebsiteInboxItemCount, normalizeSyncCode, saveToWebsiteInbox, type WebsiteInboxPayload } from '../services/websiteInbox';
import {
  clearWebsiteInboxSyncCode,
  loadWebsiteInboxSyncCode,
  persistWebsiteInboxSyncCode,
} from './websiteInboxStorage';

type WebsiteInboxSyncResult = 'skipped' | 'success' | 'error';

type WebsiteInboxStatus = {
  result: WebsiteInboxSyncResult;
  message?: string;
};

type WebsiteInboxContextValue = {
  syncCode: string;
  isRestoring: boolean;
  lastSyncStatus: WebsiteInboxStatus | null;
  clearSyncCode: () => void;
  saveSyncCode: (value: string) => void;
  syncToInbox: (payload: WebsiteInboxPayload) => Promise<WebsiteInboxSyncResult>;
};

const WebsiteInboxContext = createContext<WebsiteInboxContextValue | null>(null);

export function WebsiteInboxProvider({ children }: PropsWithChildren) {
  const [syncCode, setSyncCode] = useState('');
  const [isRestoring, setIsRestoring] = useState(true);
  const [lastSyncStatus, setLastSyncStatus] = useState<WebsiteInboxStatus | null>(null);

  useEffect(() => {
    let mounted = true;

    loadWebsiteInboxSyncCode()
      .then((value) => {
        if (mounted) {
          setSyncCode(normalizeSyncCode(value));
        }
      })
      .finally(() => {
        if (mounted) {
          setIsRestoring(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const saveSyncCode = useCallback((value: string) => {
    const normalizedCode = normalizeSyncCode(value);
    setSyncCode(normalizedCode);
    setLastSyncStatus(null);
    void persistWebsiteInboxSyncCode(normalizedCode);
  }, []);

  const clearSyncCode = useCallback(() => {
    setSyncCode('');
    setLastSyncStatus(null);
    void clearWebsiteInboxSyncCode();
  }, []);

  const syncToInbox = useCallback(
    async (payload: WebsiteInboxPayload): Promise<WebsiteInboxSyncResult> => {
      if (!syncCode) {
        setLastSyncStatus({ result: 'skipped' });
        return 'skipped';
      }

      try {
        await saveToWebsiteInbox(payload, syncCode);
        const websiteItemCount = await getWebsiteInboxItemCount(syncCode);
        if (websiteItemCount === 0) {
          throw new Error('Website inbox accepted the item but returned an empty list for this code.');
        }

        setLastSyncStatus({ result: 'success' });
        return 'success';
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Website inbox sync failed.';
        console.warn('Website inbox sync failed.', error);
        setLastSyncStatus({ result: 'error', message });
        return 'error';
      }
    },
    [syncCode],
  );

  const value = useMemo(
    () => ({
      clearSyncCode,
      isRestoring,
      lastSyncStatus,
      saveSyncCode,
      syncCode,
      syncToInbox,
    }),
    [clearSyncCode, isRestoring, lastSyncStatus, saveSyncCode, syncCode, syncToInbox],
  );

  return <WebsiteInboxContext.Provider value={value}>{children}</WebsiteInboxContext.Provider>;
}

export function useWebsiteInbox() {
  const context = useContext(WebsiteInboxContext);

  if (!context) {
    throw new Error('useWebsiteInbox must be used within WebsiteInboxProvider');
  }

  return context;
}
