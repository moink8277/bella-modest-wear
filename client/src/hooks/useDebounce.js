import { useState, useEffect } from 'react';

/**
 * Returns a debounced copy of `value` that only updates after `delay` ms
 * of no changes. Useful for search inputs / filter fields so we don't
 * fire an API call on every keystroke.
 *
 * Usage: const debouncedQuery = useDebounce(query, 400);
 */
export function useDebounce(value, delay = 400) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}