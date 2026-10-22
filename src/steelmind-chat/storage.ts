const memoryStore = new Map<string, string>();

function isLocalStorageAvailable(): boolean {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }
  try {
    const testKey = "__sm_storage_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const canUseLocalStorage = isLocalStorageAvailable();

export const safeStorage = {
  get(key: string): string | null {
    if (canUseLocalStorage) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        // Fall back to memoryStore
      }
    }
    return memoryStore.get(key) ?? null;
  },

  set(key: string, value: string): void {
    if (canUseLocalStorage) {
      try {
        window.localStorage.setItem(key, value);
        return;
      } catch {
        // Fall back to memoryStore
      }
    }
    memoryStore.set(key, value);
  },

  remove(key: string): void {
    if (canUseLocalStorage) {
      try {
        window.localStorage.removeItem(key);
        return;
      } catch {
        // Fall back to memoryStore
      }
    }
    memoryStore.delete(key);
  },
};

export default safeStorage;
