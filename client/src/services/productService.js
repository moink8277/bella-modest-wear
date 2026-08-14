import api from './api';

/**
 * Fetch a paginated, filtered list of products for /shop.
 * `params` mirrors the server-side filtering contract (Part 3/4):
 * category, subcategory, size, color, minPrice, maxPrice, tag, sort,
 * search, page, limit. Backend always recalculates prices/discounts —
 * this is display data only, never used for cart/order totals.
 */
export async function getProducts(params = {}) {
    const { data } = await api.get('/products', { params });
    return data;
}

/** Full product detail (variants, images, sizes, colors) by slug. */
export async function getProductBySlug(slug) {
    const { data } = await api.get(`/products/${slug}`);
    return data;
}

/** Products related to a given product (same category / tags), for the detail page. */
export async function getRelatedProducts(productId, limit = 8) {
    const { data } = await api.get(`/products/${productId}/related`, { params: { limit } });
    return data;
}

/** Featured / new-arrival / best-seller collections for the homepage sections. */
export async function getFeaturedProducts(type = 'featured', limit = 8) {
    const { data } = await api.get('/products/featured', { params: { type, limit } });
    return data;
}

/** Autocomplete suggestions as the user types in the search bar. */
export async function searchProducts(query, limit = 6) {
    const { data } = await api.get('/products/search', { params: { q: query, limit } });
    return data;
}