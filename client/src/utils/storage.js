// Thin, safe wrapper around localStorage — JSON-aware, never throws, and
// namespaces every key under `bmw_` so we don't collide with anything else
// running on the same origin (browser extensions, other local dev projects).
//
// AuthContext / CartContext / WishlistContext already manage their own
// localStorage reads/writes directly (their keys are listed below for
// reference) — this module is for everything else: recent searches,
// currency/language preference (Phase 9), admin table filters, etc.

const PREFIX = 'bmw_';

// Keys already in use elsewhere in the app — kept here as the single
// source of truth so new code doesn't accidentally reuse/collide with them.
export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'bmw_access_token',
    CART: 'bmw_cart',
    WISHLIST: 'bmw_wishlist',
};

function withPrefix(key) {
    return key.startsWith(PREFIX) ? key : `${PREFIX}${key}`;
}

export const storage = {
    get(key, fallback = null) {
        try {
            const raw = window.localStorage.getItem(withPrefix(key));
            return raw !== null ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    },

    set(key, value) {
        try {
            window.localStorage.setItem(withPrefix(key), JSON.stringify(value));
            return true;
        } catch {
            // storage full / unavailable (private browsing, quota exceeded) — fail silently
            return false;
        }
    },

    remove(key) {
        try {
            window.localStorage.removeItem(withPrefix(key));
        } catch {
            // ignore
        }
    },

    has(key) {
        try {
            return window.localStorage.getItem(withPrefix(key)) !== null;
        } catch {
            return false;
        }
    },

    /** Removes only bmw_-prefixed keys — leaves unrelated localStorage entries untouched. */
    clearAll() {
        try {
            Object.keys(window.localStorage)
                .filter((k) => k.startsWith(PREFIX))
                .forEach((k) => window.localStorage.removeItem(k));
        } catch {
            // ignore
        }
    },
};

export default storage;