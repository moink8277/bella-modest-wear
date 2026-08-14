import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'bmw_wishlist';

export function WishlistProvider({ children }) {
    const [items, setItems] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const isInWishlist = useCallback(
        (productId) => items.some((i) => i.productId === productId),
        [items]
    );

    const addItem = useCallback((product) => {
        setItems((prev) =>
            prev.some((i) => i.productId === product.productId) ? prev : [...prev, product]
        );
    }, []);

    const removeItem = useCallback((productId) => {
        setItems((prev) => prev.filter((i) => i.productId !== productId));
    }, []);

    const toggleItem = useCallback((product) => {
        setItems((prev) =>
            prev.some((i) => i.productId === product.productId)
                ? prev.filter((i) => i.productId !== product.productId)
                : [...prev, product]
        );
    }, []);

    const clearWishlist = useCallback(() => setItems([]), []);

    const itemCount = useMemo(() => items.length, [items]);

    const value = {
        items,
        itemCount,
        isInWishlist,
        addItem,
        removeItem,
        toggleItem,
        clearWishlist,
    };

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlistContext() {
    const ctx = useContext(WishlistContext);
    if (!ctx) {
        throw new Error('useWishlistContext must be used within a <WishlistProvider>');
    }
    return ctx;
}