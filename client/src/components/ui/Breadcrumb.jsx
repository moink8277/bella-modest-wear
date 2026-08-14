import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function Breadcrumb({ items = [], className }) {
    return (
        <nav aria-label="Breadcrumb" className={cn('w-full', className)}>
            <ol className="flex items-center flex-wrap gap-1.5 text-xs text-muted">
                <li>
                    <Link to="/" className="hover:text-gold-dark transition-colors">
                        Home
                    </Link>
                </li>
                {items.map((item, i) => {
                    const isLast = i === items.length - 1;
                    return (
                        <li key={item.label} className="flex items-center gap-1.5">
                            <ChevronRight className="h-3 w-3" aria-hidden="true" />
                            {isLast || !item.to ? (
                                <span className="text-ink-soft" aria-current="page">
                                    {item.label}
                                </span>
                            ) : (
                                <Link to={item.to} className="hover:text-gold-dark transition-colors">
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}