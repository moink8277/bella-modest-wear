import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Generic async data-fetching hook. Wraps any service call (e.g. from
 * services/productService.js) and handles loading/error/data state,
 * plus a `refetch` you can call manually (pagination, retry buttons, etc).
 *
 * `asyncFn` should be a stable callback (wrap it in useCallback at the
 * call site if it captures changing values) that returns a promise
 * resolving to the data you want. Errors are expected in the normalized
 * shape produced by services/api.js ({ message, status, errors }).
 *
 * Usage:
 *   const fetchProducts = useCallback(() => productService.getAll(filters), [filters]);
 *   const { data, isLoading, error, refetch } = useFetch(fetchProducts);
 */
export function useFetch(asyncFn, { skip = false, initialData = null } = {}) {
    const [data, setData] = useState(initialData);
    const [isLoading, setIsLoading] = useState(!skip);
    const [error, setError] = useState(null);

    // Guards against setting state after unmount / after a newer call
    // has already started (avoids race conditions when deps change fast).
    const requestIdRef = useRef(0);

    const refetch = useCallback(() => {
        const requestId = ++requestIdRef.current;
        setIsLoading(true);
        setError(null);

        return asyncFn()
            .then((result) => {
                if (requestId === requestIdRef.current) {
                    setData(result);
                }
                return result;
            })
            .catch((err) => {
                if (requestId === requestIdRef.current) {
                    setError(err);
                }
                throw err;
            })
            .finally(() => {
                if (requestId === requestIdRef.current) {
                    setIsLoading(false);
                }
            });
    }, [asyncFn]);

    useEffect(() => {
        if (skip) return;
        refetch().catch(() => {
            // error already captured in state; swallow here so this effect
            // doesn't throw an unhandled rejection into the console.
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [asyncFn, skip]);

    return { data, isLoading, error, refetch };
}