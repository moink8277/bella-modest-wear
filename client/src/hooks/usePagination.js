import { useState, useMemo, useCallback } from 'react';

/**
 * Client-side pagination state helper. Pairs directly with
 * components/ui/Pagination.jsx ({ page, totalPages, onPageChange }).
 *
 * Works for both:
 *  - Server-paginated lists: pass `totalItems` from the API response,
 *    use `page` + `limit` as query params on your fetch call.
 *  - Client-paginated lists: pass `totalItems = allItems.length` and
 *    slice the array yourself with `startIndex` / `endIndex`.
 *
 * Usage:
 *   const { page, totalPages, setPage, nextPage, prevPage, limit } =
 *     usePagination({ totalItems: data?.total ?? 0, initialLimit: 12 });
 */
export function usePagination({ totalItems = 0, initialPage = 1, initialLimit = 12 } = {}) {
    const [page, setPageState] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);

    const totalPages = useMemo(() => Math.max(1, Math.ceil(totalItems / limit)), [totalItems, limit]);

    const setPage = useCallback(
        (nextPage) => {
            const clamped = Math.min(Math.max(1, nextPage), totalPages);
            setPageState(clamped);
        },
        [totalPages]
    );

    const nextPage = useCallback(() => setPage(page + 1), [page, setPage]);
    const prevPage = useCallback(() => setPage(page - 1), [page, setPage]);

    const changeLimit = useCallback((nextLimit) => {
        setLimit(nextLimit);
        setPageState(1);
    }, []);

    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, totalItems);

    return {
        page,
        limit,
        totalPages,
        totalItems,
        startIndex,
        endIndex,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        setPage,
        nextPage,
        prevPage,
        setLimit: changeLimit,
    };
}