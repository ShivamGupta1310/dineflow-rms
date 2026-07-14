import { createMMKV, } from 'react-native-mmkv';
import type { Storage } from 'redux-persist';

let storageInstance: ReturnType<typeof createMMKV> | null = null;

export const getStorage = () => {
    if (!storageInstance) {
        try {
            storageInstance = createMMKV();
        } catch (e) {
            console.log("Error initializing MMKV", e);
            // Safe fallback during testing or early bootstrap
        }
    }
    return storageInstance;
};

/**
 * Set a value in MMKV storage
 */
export const setItem = (
    key: string,
    value: string | boolean | number | object,
) => {
    const storage = getStorage();
    if (!storage) return;
    if (typeof value === 'object') {
        storage.set(key, JSON.stringify(value)); // Convert objects to JSON
    } else {
        storage.set(key, value as any);
    }
};

/**
 * Get a value from MMKV storage
 */
export const getItem = (
    key: string,
): string | boolean | number | object | null | undefined => {
    const storage = getStorage();
    if (!storage) return null;
    const value =
        storage.getString(key) || storage.getBoolean(key) || storage.getNumber(key);
    try {
        return value ? JSON.parse(value as string) : value; // Parse JSON if applicable
    } catch {
        return value;
    }
};

/**
 * Delete a specific key from MMKV storage
 */
export const removeItem = (key: string) => {
    const storage = getStorage();
    if (storage) {
        storage.remove(key);
    }
};

/**
 * Clear all data from MMKV storage
 */
export const clearStorage = () => {
    const storage = getStorage();
    if (storage) {
        storage.clearAll();
    }
};

export const mmkvReduxStorage: Storage = {
    setItem: (key, value) => {
        const storage = getStorage();
        if (storage) {
            storage.set(key, value);
        }
        return Promise.resolve(true);
    },
    getItem: key => {
        const storage = getStorage();
        const value = storage ? storage.getString(key) : null;
        return Promise.resolve(value || null);
    },
    removeItem: key => {
        const storage = getStorage();
        if (storage) {
            storage.remove(key);
        }
        return Promise.resolve();
    },
};
