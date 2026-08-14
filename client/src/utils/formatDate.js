const DEFAULT_LOCALE = 'en-IN';

/**
 * Formats a date/timestamp as a readable string, e.g. "14 Aug 2026".
 * Accepts a Date, ISO string, or timestamp — invalid input returns ''.
 */
export function formatDate(input, options = {}) {
    const date = input instanceof Date ? input : new Date(input);
    if (Number.isNaN(date.getTime())) return '';

    return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        ...options,
    }).format(date);
}

/**
 * Formats a date/timestamp with time, e.g. "14 Aug 2026, 6:45 PM".
 */
export function formatDateTime(input) {
    return formatDate(input, { hour: 'numeric', minute: '2-digit', hour12: true });
}

/**
 * Relative time for recent-ish dates, e.g. "3 hours ago", "Yesterday",
 * falling back to a plain formatted date once it's more than a week old.
 * Handy for order timelines, review timestamps, admin activity feeds.
 */
export function formatRelativeTime(input) {
    const date = input instanceof Date ? input : new Date(input);
    if (Number.isNaN(date.getTime())) return '';

    const diffMs = Date.now() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`;
    if (diffDay === 1) return 'Yesterday';
    if (diffDay < 7) return `${diffDay} days ago`;

    return formatDate(date);
}