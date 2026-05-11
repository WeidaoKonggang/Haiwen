type StorageLike = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

export function createSupabaseAuthStorage(storage: StorageLike) {
  const memory = new Map<string, string>();

  return {
    async getItem(key: string) {
      try {
        const value = await storage.getItem(key);

        if (value !== null) {
          memory.set(key, value);
        }

        return value;
      } catch {
        return memory.get(key) ?? null;
      }
    },

    async setItem(key: string, value: string) {
      memory.set(key, value);

      try {
        await storage.setItem(key, value);
      } catch {
        // Memory fallback keeps the current session usable for this app launch.
      }
    },

    async removeItem(key: string) {
      memory.delete(key);

      try {
        await storage.removeItem(key);
      } catch {
        // Storage is best-effort in Expo preview environments.
      }
    },
  };
}
