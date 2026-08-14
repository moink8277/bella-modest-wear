import api from './api';

/** Paginated reviews for a product's detail page, with rating breakdown. */
export async function getProductReviews(productId, params = {}) {
    const { data } = await api.get(`/products/${productId}/reviews`, { params });
    return data;
}

/**
 * Submits a review. Backend enforces "verified purchase" (Part 3) —
 * whether this is flagged as verified is decided server-side by checking
 * the customer's order history, never trusted from the client.
 */
export async function createReview(productId, { rating, title, comment, images }) {
    const { data } = await api.post(`/products/${productId}/reviews`, {
        rating,
        title,
        comment,
        images,
    });
    return data;
}

export async function updateReview(reviewId, { rating, title, comment }) {
    const { data } = await api.put(`/reviews/${reviewId}`, { rating, title, comment });
    return data;
}

export async function deleteReview(reviewId) {
    const { data } = await api.delete(`/reviews/${reviewId}`);
    return data;
}

/** Marks a review as helpful — lightweight, no auth-heavy payload. */
export async function markReviewHelpful(reviewId) {
    const { data } = await api.post(`/reviews/${reviewId}/helpful`);
    return data;
}