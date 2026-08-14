import api from './api';

/**
 * Full category tree (categories + nested subcategories) — dynamic,
 * backend-owned data (Part 3: Abayas, Hijabs, Khimars, Jilbabs, Modest
 * Dresses, Kurtis, Kaftans, Prayer Wear, Accessories, etc. — never
 * hardcoded once this is wired in). Replaces constants/categories.js
 * bootstrap list once the backend endpoint exists.
 */
export async function getCategories() {
    const { data } = await api.get('/categories');
    return data;
}

/** Single category by slug, with its subcategories. */
export async function getCategoryBySlug(slug) {
    const { data } = await api.get(`/categories/${slug}`);
    return data;
}

/** Subcategories for a given parent category, used for /shop filter dropdowns. */
export async function getSubcategories(categorySlug) {
    const { data } = await api.get(`/categories/${categorySlug}/subcategories`);
    return data;
}