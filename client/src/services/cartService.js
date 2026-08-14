import api from './api';

export async function getCart() {
    const { data } = await api.get('/cart');
    return data;
}

export async function addToCart({ productId, variantId, quantity }) {
    const { data } = await api.post('/cart/items', { productId, variantId, quantity });
    return data;
}

export async function updateCartItem(itemId, quantity) {
    const { data } = await api.put(`/cart/items/${itemId}`, { quantity });
    return data;
}

export async function removeCartItem(itemId) {
    const { data } = await api.delete(`/cart/items/${itemId}`);
    return data;
}

export async function clearCart() {
    const { data } = await api.delete('/cart');
    return data;
}