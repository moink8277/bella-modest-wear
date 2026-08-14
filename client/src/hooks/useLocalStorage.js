import { useState, useCallback } from 'react';

/**
 * Generic localStorage-backed state hook. Behaves like useState, but
 * persists the value (JSON-serialized) under `key` and rehydrates from
 * it on mount. Safe to use with SSR/no-window environments (falls back
 * to `initialValue`) and never throws on read/write errors.
 *
 * Usage: const [recentSearches, setRecentSearches] = useLocalStorage('bmw_recent_searches', []);
 */
export function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        if (typeof window === 'undefined') return initialValue;
        try {
            const stored = window.localStorage.getItem(key);
            return stored !== null ? JSON.parse(stored) : initialValue;
        } catch {
            return initialValue;
        }
    });

    const setStoredValue = useCallback(
        (newValue) => {
            setValue((prev) => {
                const resolved = newValue instanceof Function ? newValue(prev) : newValue;
                try {
                    window.localStorage.setItem(key, JSON.stringify(resolved));
                } catch {
                    // storage full / unavailable (private mode etc.) — ignore, state still updates
                }
                return resolved;
            });
        },
        [key]
    );

    const removeStoredValue = useCallback(() => {
        try {
            window.localStorage.removeItem(key);
        } catch {
            // ignore
        }
        setValue(initialValue);
    }, [key, initialValue]);

    return [value, setStoredValue, removeStoredValue];
}