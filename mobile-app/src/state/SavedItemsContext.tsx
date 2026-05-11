import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import type { SavedItem } from '../types';
import { upsertSavedItem } from './savedItems';
import { loadSavedItems, persistSavedItems } from './savedItemsStorage';

type SavedItemsContextValue = {
  savedItems: SavedItem[];
  isRestoring: boolean;
  saveItem: (item: SavedItem) => void;
  isSaved: (sourceId: string, type: SavedItem['type']) => boolean;
};

const SavedItemsContext = createContext<SavedItemsContextValue | null>(null);

export function SavedItemsProvider({ children }: PropsWithChildren) {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    let mounted = true;

    loadSavedItems()
      .then((items) => {
        if (mounted) {
          setSavedItems(items);
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

  const saveItem = useCallback((item: SavedItem) => {
    setSavedItems((currentItems) => {
      const nextItems = upsertSavedItem(currentItems, item);
      void persistSavedItems(nextItems);
      return nextItems;
    });
  }, []);

  const isSaved = useCallback(
    (sourceId: string, type: SavedItem['type']) =>
      savedItems.some((item) => item.sourceId === sourceId && item.type === type),
    [savedItems],
  );

  const value = useMemo(
    () => ({
      savedItems,
      isRestoring,
      saveItem,
      isSaved,
    }),
    [isRestoring, isSaved, saveItem, savedItems],
  );

  return <SavedItemsContext.Provider value={value}>{children}</SavedItemsContext.Provider>;
}

export function useSavedItems() {
  const context = useContext(SavedItemsContext);

  if (!context) {
    throw new Error('useSavedItems must be used within SavedItemsProvider');
  }

  return context;
}
