import api from './api';

/** Logged-in customer's saved addresses, for /account/addresses + checkout. */
export async function getAddresses() {
    const { data } = await api.get('/addresses');
    return data;
}

export async function createAddress(payload) {
    const { data } = await api.post('/addresses', payload);
    return data;
}

export async function updateAddress(addressId, payload) {
    const { data } = await api.put(`/addresses/${addressId}`, payload);
    return data;
}

export async function deleteAddress(addressId) {
    const { data } = await api.delete(`/addresses/${addressId}`);
    return data;
}

/** Sets one address as the default — used for shipping/billing pre-fill at checkout. */
export async function setDefaultAddress(addressId) {
    const { data } = await api.patch(`/addresses/${addressId}/default`);
    return data;
}