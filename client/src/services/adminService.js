import api from './api';

// Admin panel API (Part 5). Most admin resources follow the same CRUD
// shape, so a small factory avoids repeating the same 4 functions ~10
// times. Anything with non-standard behavior (dashboard stats, order
// status transitions, review moderation, etc.) gets its own named export
// below the factory-generated groups.

function resourceApi(basePath) {
    return {
        list: async (params = {}) => (await api.get(basePath, { params })).data,
        get: async (id) => (await api.get(`${basePath}/${id}`)).data,
        create: async (payload) => (await api.post(basePath, payload)).data,
        update: async (id, payload) => (await api.put(`${basePath}/${id}`, payload)).data,
        remove: async (id) => (await api.delete(`${basePath}/${id}`)).data,
    };
}

// ── Dashboard / analytics ────────────────────────────────────
export async function getDashboardStats(params = {}) {
    const { data } = await api.get('/admin/dashboard/stats', { params });
    return data;
}

export async function getTopProducts(params = {}) {
    const { data } = await api.get('/admin/dashboard/top-products', { params });
    return data;
}

// ── Catalog management ───────────────────────────────────────
export const adminProducts = resourceApi('/admin/products');
export const adminCategories = resourceApi('/admin/categories');
export const adminBanners = resourceApi('/admin/banners');
export const adminLookbooks = resourceApi('/admin/lookbooks');
export const adminBlog = resourceApi('/admin/blog');

// ── Inventory ─────────────────────────────────────────────────
export async function getInventory(params = {}) {
    const { data } = await api.get('/admin/inventory', { params });
    return data;
}

export async function adjustStock(variantId, { quantity, reason }) {
    const { data } = await api.patch(`/admin/inventory/${variantId}`, { quantity, reason });
    return data;
}

// ── Orders ────────────────────────────────────────────────────
export async function getAdminOrders(params = {}) {
    const { data } = await api.get('/admin/orders', { params });
    return data;
}

export async function getAdminOrderById(orderId) {
    const { data } = await api.get(`/admin/orders/${orderId}`);
    return data;
}

export async function updateOrderStatus(orderId, { status, note }) {
    const { data } = await api.patch(`/admin/orders/${orderId}/status`, { status, note });
    return data;
}

// ── Customers ─────────────────────────────────────────────────
// Read-only by design — plaintext passwords never returned by the backend.
export async function getAdminCustomers(params = {}) {
    const { data } = await api.get('/admin/customers', { params });
    return data;
}

export async function getAdminCustomerById(customerId) {
    const { data } = await api.get(`/admin/customers/${customerId}`);
    return data;
}

// ── Reviews (moderation) ─────────────────────────────────────
export async function getAdminReviews(params = {}) {
    const { data } = await api.get('/admin/reviews', { params });
    return data;
}

export async function moderateReview(reviewId, { status }) {
    const { data } = await api.patch(`/admin/reviews/${reviewId}/moderate`, { status });
    return data;
}

// ── Coupons ───────────────────────────────────────────────────
export const adminCoupons = resourceApi('/admin/coupons');

// ── Messages / Quotations / Newsletter ──────────────────────
export async function getAdminMessages(params = {}) {
    const { data } = await api.get('/admin/messages', { params });
    return data;
}

export async function markMessageRead(messageId) {
    const { data } = await api.patch(`/admin/messages/${messageId}/read`);
    return data;
}

export async function getAdminQuotations(params = {}) {
    const { data } = await api.get('/admin/quotations', { params });
    return data;
}

export async function updateQuotationStatus(quotationId, { status, quotedPrice, note }) {
    const { data } = await api.patch(`/admin/quotations/${quotationId}`, { status, quotedPrice, note });
    return data;
}

export async function getNewsletterSubscribers(params = {}) {
    const { data } = await api.get('/admin/newsletter/subscribers', { params });
    return data;
}

// ── Settings ──────────────────────────────────────────────────
export async function getAdminSettings() {
    const { data } = await api.get('/admin/settings');
    return data;
}

export async function updateAdminSettings(payload) {
    const { data } = await api.put('/admin/settings', payload);
    return data;
}

// ── Audit logs ────────────────────────────────────────────────
export async function getAuditLogs(params = {}) {
    const { data } = await api.get('/admin/audit-logs', { params });
    return data;
}