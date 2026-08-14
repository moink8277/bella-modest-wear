import api from './api';

/** List of published lookbooks/editorials for /lookbook. */
export async function getLookbooks(params = {}) {
    const { data } = await api.get('/lookbooks', { params });
    return data;
}

/** Single lookbook detail (images, styled products) by slug. */
export async function getLookbookBySlug(slug) {
    const { data } = await api.get(`/lookbooks/${slug}`);
    return data;
}