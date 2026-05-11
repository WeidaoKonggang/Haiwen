import AsyncStorage from '@react-native-async-storage/async-storage';

import type { SavedItem } from '../types';
import { deserializeSavedItems, serializeSavedItems } from './savedItems';

export const SAVED_ITEMS_STORAGE_KEY = 'haiwen.savedItems.v1';

type StorageLike = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
};

export function createSavedItemsStorage(storage: StorageLike) {
  let memoryValue: string | null = null;

  return {
    async loadSavedItems() {
      try {
        const value = await storage.getItem(SAVED_ITEMS_STORAGE_KEY);
        memoryValue = value;
        return deserializeSavedItems(value);
      } catch (error) {
        console.warn('Saved items native storage unavailable; using memory fallback.', error);
        return deserializeSavedItems(memoryValue);
      }
    },

    async persistSavedItems(items: SavedItem[]) {
      const serialized = serializeSavedItems(items);
      memoryValue = serialized;

      try {
        await storage.setItem(SAVED_ITEMS_STORAGE_KEY, serialized);
      } catch (error) {
        console.warn('Saved items native storage unavailable; using memory fallback.', error);
      }
    },
  };
}

const savedItemsStorage = createSavedItemsStorage(AsyncStorage);

export const loadSavedItems = savedItemsStorage.loadSavedItems;
export const persistSavedItems = savedItemsStorage.persistSavedItems;
