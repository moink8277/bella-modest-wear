import api from './api';

/**
 * Backend-synced wishlist (Part 2/3: logged-in customers get their
 * wishlist persisted server-side, not just in localStorage). Once wired
 * into WishlistContext.jsx, the flow is: on login, merge local guest
 * wishlist into the server list, then keep both in sync from here.
 */
export async function getWishlist() {
    const { data } = await api.get('/wishlist');
    return data;
}

export async function addToWishlist(productId) {
    const { data } = await api.post('/wishlist/items', { productId });
    return data;
}

export async function removeFromWishlist(productId) {
    const { data } = await api.delete(`/wishlist/items/${productId}`);
    return data;
}

/** Bulk-merges a guest's locally-stored wishlist into their account on login. */
export async function mergeWishlist(productIds) {
    const { data } = await api.post('/wishlist/merge', { productIds });
    return data;
}