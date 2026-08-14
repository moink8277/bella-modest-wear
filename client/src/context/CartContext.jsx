import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'bmw_cart';

export function CartProvider({ children }) {
    const [items, setItems] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addItem = useCallback((product, quantity = 1) => {
        setItems((prev) => {
            const existing = prev.find(
                (i) => i.productId === product.productId && i.variantId === product.variantId
            );
            if (existing) {
                return prev.map((i) =>
                    i.id === existing.id ? { ...i, quantity: i.quantity + quantity } : i
                );
            }
            return [...prev, { ...product, id: `${product.productId}-${product.variantId || 'default'}`, quantity }];
        });
    }, []);

    const removeItem = useCallback((itemId) => {
        setItems((prev) => prev.filter((i) => i.id !== itemId));
    }, []);

    const updateQuantity = useCallback((itemId, quantity) => {
        setItems((prev) =>
            quantity <= 0
                ? prev.filter((i) => i.id !== itemId)
                : prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
        );
    }, []);

    const clearCart = useCallback(() => setItems([]), []);

    const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
    const subtotal = useMemo(
        () => items.reduce((sum, i) => sum + (i.salePrice ?? i.price) * i.quantity, 0),
        [items]
    );

    const value = {
        items,
        itemCount,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error('useCart must be used within a <CartProvider>');
    }
    return ctx;
}