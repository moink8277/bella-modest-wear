import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from './AuthContext';
import * as wishlistService from '@/services/wishlistService';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'bmw_wishlist';

/**
 * Normalizes a raw backend wishlist item (snake_case from Wishlist.model.js's
 * join) into the shape consuming pages/ProductCard expect — same camelCase
 * contract as mapProduct() in Shop.jsx/ProductDetail.jsx.
 */
function normalizeItem(item) {
    return {
        productId: item.product_id,
        slug: item.slug,
        name: item.name,
        price: Number(item.price),
        salePrice: item.sale_price ? Number(item.sale_price) : undefined,
        image: item.image,
        isNew: !!item.is_new,
        isBestseller: !!item.is_bestseller,
        inStock: item.stock_quantity > 0,
    };
}

function readLocalWishlist() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

/**
 * Unlike CartContext, wishlist does NOT require login — guests get a
 * localStorage-backed wishlist (product decision confirmed this session,
 * deliberately different from cart's Myntra-style login-gate, since
 * wishlist is lower-stakes). Once the user authenticates, the local list
 * is merged into their server-side wishlist via wishlistService.mergeWishlist,
 * then the context switches to being backend-driven.
 *
 * Same architecture constraint as CartContext: WishlistProvider sits
 * outside <RouterProvider>/<ToastProvider> in App.jsx, so this file cannot
 * call useNavigate()/useToast() — methods return { success, reason?,
 * message? } and the calling component (rendered inside the router/toast
 * tree) decides what to do with it.
 */
export function WishlistProvider({ children }) {
    const { isAuthenticated } = useAuth();

    const [items, setItems] = useState(() => readLocalWishlist().map((p) => p));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Tracks whether we've already run the merge-on-login flow for the
    // current authenticated session, so it only fires once per login
    // (not on every re-render / every items update).
    const hasMergedRef = useRef(false);

    // Guests: keep localStorage in sync with state on every change.
    useEffect(() => {
        if (!isAuthenticated) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
            } catch {
                // localStorage can fail (private browsing, quota) — non-fatal for a wishlist.
            }
        }
    }, [items, isAuthenticated]);

    const applyWishlistData = useCallback((data) => {
        setItems((data.items || []).map(normalizeItem));
    }, []);

    // On login: merge whatever was in the guest's localStorage wishlist into
    // the server, clear that local copy, then load the real server wishlist.
    // On logout: reset back to whatever's in localStorage (a fresh guest view).
    useEffect(() => {
        if (!isAuthenticated) {
            hasMergedRef.current = false;
            setItems(readLocalWishlist());
            setError(null);
            return;
        }

        if (hasMergedRef.current) return;
        hasMergedRef.current = true;

        let cancelled = false;
        setIsLoading(true);
        setError(null);

        const localItems = readLocalWishlist();
        const localProductIds = localItems.map((p) => p.productId);

        const run = localProductIds.length
            ? wishlistService.mergeWishlist(localProductIds)
            : wishlistService.getWishlist();

        run
            .then((res) => {
                if (cancelled) return;
                applyWishlistData(res.data);
                try {
                    localStorage.removeItem(STORAGE_KEY);
                } catch {
                    // non-fatal
                }
            })
            .catch((err) => {
                if (!cancelled) setError(err.message || 'Could not load your wishlist');
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [isAuthenticated, applyWishlistData]);

    const isInWishlist = useCallback(
        (productId) => items.some((i) => i.productId === productId),
        [items]
    );

    const addItem = useCallback(
        async (product) => {
            if (!isAuthenticated) {
                setItems((prev) =>
                    prev.some((i) => i.productId === product.productId) ? prev : [...prev, product]
                );
                return { success: true };
            }
            try {
                const res = await wishlistService.addToWishlist(product.productId);
                applyWishlistData(res.data);
                return { success: true };
            } catch (err) {
                return { success: false, message: err.message || 'Could not add item to wishlist' };
            }
        },
        [isAuthenticated, applyWishlistData]
    );

    const removeItem = useCallback(
        async (productId) => {
            if (!isAuthenticated) {
                setItems((prev) => prev.filter((i) => i.productId !== productId));
                return { success: true };
            }
            try {
                const res = await wishlistService.removeFromWishlist(productId);
                applyWishlistData(res.data);
                return { success: true };
            } catch (err) {
                return { success: false, message: err.message || 'Could not remove item' };
            }
        },
        [isAuthenticated, applyWishlistData]
    );

    const toggleItem = useCallback(
        async (product) => {
            return isInWishlist(product.productId) ? removeItem(product.productId) : addItem(product);
        },
        [isInWishlist, removeItem, addItem]
    );

    const clearWishlist = useCallback(() => {
        // Only meaningful for the guest/local case — there's no bulk-clear
        // server endpoint (and no product decision yet to build one).
        setItems([]);
    }, []);

    const itemCount = useMemo(() => items.length, [items]);

    const value = {
        items,
        itemCount,
        isLoading,
        error,
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