import AsyncStorage from '@react-native-async-storage/async-storage';

export const WEBSITE_INBOX_SYNC_CODE_KEY = 'haiwen.websiteInboxSyncCode.v1';

type StorageLike = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

export function createWebsiteInboxStorage(storage: StorageLike) {
  let memoryValue = '';

  return {
    async loadSyncCode() {
      try {
        const value = await storage.getItem(WEBSITE_INBOX_SYNC_CODE_KEY);
        memoryValue = value ?? '';
        return memoryValue;
      } catch {
        return memoryValue;
      }
    },

    async persistSyncCode(syncCode: string) {
      memoryValue = syncCode;

      try {
        await storage.setItem(WEBSITE_INBOX_SYNC_CODE_KEY, syncCode);
      } catch {
        // Memory fallback keeps the sync code usable for this app launch.
      }
    },

    async clearSyncCode() {
      memoryValue = '';

      try {
        await storage.removeItem(WEBSITE_INBOX_SYNC_CODE_KEY);
      } catch {
        // Storage is best-effort in Expo preview environments.
      }
    },
  };
}

const websiteInboxStorage = createWebsiteInboxStorage(AsyncStorage);

export const loadWebsiteInboxSyncCode = websiteInboxStorage.loadSyncCode;
export const persistWebsiteInboxSyncCode = websiteInboxStorage.persistSyncCode;
export const clearWebsiteInboxSyncCode = websiteInboxStorage.clearSyncCode;
