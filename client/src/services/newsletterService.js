import api from './api';

/** Subscribes an email to the newsletter — used by sections/Newsletter.jsx. */
export async function subscribeNewsletter(email) {
    const { data } = await api.post('/newsletter/subscribe', { email });
    return data;
}

/** Unsubscribe via a tokenized link (from newsletter emails), no login required. */
export async function unsubscribeNewsletter(token) {
    const { data } = await api.post('/newsletter/unsubscribe', { token });
    return data;
}