import api from './api';

/** Logged-in customer's own profile — separate from auth.getCurrentUser()
 *  which returns the session identity; this covers editable profile fields. */
export async function getProfile() {
    const { data } = await api.get('/users/me');
    return data;
}

export async function updateProfile({ name, phone, avatar }) {
    const { data } = await api.put('/users/me', { name, phone, avatar });
    return data;
}

/** Change password from within /account/security (requires current password). */
export async function changePassword({ currentPassword, newPassword }) {
    const { data } = await api.put('/users/me/password', { currentPassword, newPassword });
    return data;
}

/** Notification preferences (order updates, newsletter, promos) for /account/notifications. */
export async function getNotificationPreferences() {
    const { data } = await api.get('/users/me/notifications');
    return data;
}

export async function updateNotificationPreferences(preferences) {
    const { data } = await api.put('/users/me/notifications', preferences);
    return data;
}

/** Permanently deletes the customer's account (with confirmation handled in the UI). */
export async function deleteAccount(password) {
    const { data } = await api.delete('/users/me', { data: { password } });
    return data;
}