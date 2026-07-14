let storage: any = null;

const getStorage = () => {
  if (storage) return storage;
  try {
    const { MMKV } = require('react-native-mmkv');
    if (MMKV) {
      storage = new MMKV();
    }
  } catch (e) {
    console.log("Error initializing MMKV", e);
    // Safe fallback if native JSI bindings are not loaded/built yet
  }
  return storage;
};

// In-memory fallback map
const memoryStorage = new Map<string, string>();

export const setItem = (key: string, value: string): void => {
  const instance = getStorage();
  if (instance) {
    try {
      instance.set(key, value);
      return;
    } catch (e) {
      console.log("Error setting item in MMKV", e);
      // Fallback
    }
  }
  memoryStorage.set(key, value);
};

export const getItem = (key: string): string | null => {
  const instance = getStorage();
  if (instance) {
    try {
      return instance.getString(key) || null;
    } catch (e) {
      console.log("Error getting item from MMKV", e);
      // Fallback
    }
  }
  return memoryStorage.get(key) || null;
};

export const removeItem = (key: string): void => {
  const instance = getStorage();
  if (instance) {
    try {
      instance.delete(key);
      return;
    } catch (e) {
      console.log("Error removing item from MMKV", e);
      // Fallback
    }
  }
  memoryStorage.delete(key);
};
