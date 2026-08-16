import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import * as cartService from '@/services/cartService';

const CartContext = createContext(null);

/**
 * Normalizes a raw backend cart item (snake_case + computed fields from
 * cart.controller.js's withTotals) into the shape consuming pages expect.
 */
function normalizeItem(item) {
    return {
        id: item.id,
        productId: item.product_id,
        variantId: item.variant_id,
        slug: item.slug,
        name: item.name,
        image: item.image,
        price: item.price,
        salePrice: item.sale_price,
        quantity: item.quantity,
        variantLabel: [item.color, item.size].filter(Boolean).join(' / ') || null,
        stockQuantity: item.stock_quantity,
    };
}

/**
 * IMPORTANT: CartProvider sits OUTSIDE <RouterProvider> in App.jsx (and
 * outside <ToastProvider> too), so this file cannot call useNavigate() or
 * useToast() — those contexts aren't ancestors here. Instead, addItem()
 * returns a result object ({ success, reason }) and the CALLING component
 * (which does render inside the router/toast tree) decides what to do —
 * e.g. redirect to /login when reason === 'auth', like Myntra does.
 */
export function CartProvider({ children }) {
    const { isAuthenticated } = useAuth();

    const [items, setItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const applyCartData = useCallback((data) => {
        setItems((data.items || []).map(normalizeItem));
        setSubtotal(data.subtotal || 0);
    }, []);

    // Load the real cart whenever the user is authenticated. On logout,
    // there's nothing to fetch for a guest — just clear the local view.
    useEffect(() => {
        if (!isAuthenticated) {
            setItems([]);
            setSubtotal(0);
            setError(null);
            return;
        }

        let cancelled = false;
        setIsLoading(true);
        setError(null);

        cartService
            .getCart()
            .then((res) => {
                if (!cancelled) applyCartData(res.data);
            })
            .catch((err) => {
                if (!cancelled) setError(err.message || 'Could not load your cart');
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [isAuthenticated, applyCartData]);

    // Guests get prompted to log in before anything is added — the caller
    // decides how (redirect, toast, etc), this just reports the outcome.
    const addItem = useCallback(
        async (product, quantity = 1) => {
            if (!isAuthenticated) {
                return { success: false, reason: 'auth' };
            }
            try {
                const res = await cartService.addToCart({
                    productId: product.productId,
                    variantId: product.variantId ?? null,
                    quantity,
                });
                applyCartData(res.data);
                return { success: true };
            } catch (err) {
                return { success: false, reason: 'error', message: err.message || 'Could not add item to cart' };
            }
        },
        [isAuthenticated, applyCartData]
    );

    const removeItem = useCallback(
        async (itemId) => {
            try {
                const res = await cartService.removeCartItem(itemId);
                applyCartData(res.data);
                return { success: true };
            } catch (err) {
                return { success: false, message: err.message || 'Could not remove item' };
            }
        },
        [applyCartData]
    );

    const updateQuantity = useCallback(
        async (itemId, quantity) => {
            try {
                const res =
                    quantity <= 0
                        ? await cartService.removeCartItem(itemId)
                        : await cartService.updateCartItem(itemId, quantity);
                applyCartData(res.data);
                return { success: true };
            } catch (err) {
                return { success: false, message: err.message || 'Could not update quantity' };
            }
        },
        [applyCartData]
    );

    const clearCart = useCallback(async () => {
        try {
            const res = await cartService.clearCart();
            applyCartData(res.data);
            return { success: true };
        } catch (err) {
            return { success: false, message: err.message || 'Could not clear cart' };
        }
    }, [applyCartData]);

    const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

    const value = {
        items,
        itemCount,
        subtotal,
        isLoading,
        error,
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