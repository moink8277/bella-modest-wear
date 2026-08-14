import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

function getPageNumbers(current, total) {
    const delta = 1;
    const pages = [];
    const range = [];

    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
        range.push(i);
    }

    if (current - delta > 2) range.unshift('...');
    if (current + delta < total - 1) range.push('...');

    pages.push(1, ...range);
    if (total > 1) pages.push(total);

    return [...new Set(pages)];
}

export default function Pagination({ page = 1, totalPages = 1, onPageChange, className }) {
    if (totalPages <= 1) return null;

    const pages = getPageNumbers(page, totalPages);

    return (
        <nav aria-label="Pagination" className={cn('flex items-center justify-center gap-1.5', className)}>
            <button
                type="button"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                aria-label="Previous page"
                className="h-9 w-9 flex items-center justify-center rounded-[var(--radius-bmw)] border border-border text-ink-soft hover:border-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>

            {pages.map((p, i) =>
                p === '...' ? (
                    <span key={`ellipsis-${i}`} className="px-1.5 text-muted text-sm">
                        …
                    </span>
                ) : (
                    <button
                        key={p}
                        type="button"
                        onClick={() => onPageChange(p)}
                        aria-label={`Page ${p}`}
                        aria-current={p === page ? 'page' : undefined}
                        className={cn(
                            'h-9 w-9 flex items-center justify-center rounded-[var(--radius-bmw)] text-sm transition-colors',
                            p === page
                                ? 'bg-espresso text-ivory'
                                : 'text-ink-soft border border-border hover:border-gold'
                        )}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                type="button"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                aria-label="Next page"
                className="h-9 w-9 flex items-center justify-center rounded-[var(--radius-bmw)] border border-border text-ink-soft hover:border-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </nav>
    );
}