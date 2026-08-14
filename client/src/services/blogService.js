import api from './api';

/** Paginated blog post list for /blog, with optional category filter. */
export async function getBlogPosts(params = {}) {
    const { data } = await api.get('/blog', { params });
    return data;
}

/** Single blog post detail by slug, for /blog/:slug. */
export async function getBlogPostBySlug(slug) {
    const { data } = await api.get(`/blog/${slug}`);
    return data;
}

/** Blog categories, for the blog sidebar/filter. */
export async function getBlogCategories() {
    const { data } = await api.get('/blog/categories');
    return data;
}

/** Recent/related posts shown at the bottom of a blog detail page. */
export async function getRelatedPosts(postId, limit = 3) {
    const { data } = await api.get(`/blog/${postId}/related`, { params: { limit } });
    return data;
}