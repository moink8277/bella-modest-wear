import { formatPrice, calcDiscountPercent } from '@/utils/formatPrice';
import Badge from './Badge';
import { cn } from '@/utils/cn';

const SIZES = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
};

export default function PriceDisplay({ price, salePrice, size = 'md', className }) {
    const hasDiscount = salePrice != null && Number(salePrice) < Number(price);
    const discountPercent = hasDiscount ? calcDiscountPercent(price, salePrice) : 0;

    return (
        <div className={cn('flex items-center gap-2 flex-wrap', className)}>
            <span className={cn('font-body font-medium text-espresso', SIZES[size])}>
                {formatPrice(hasDiscount ? salePrice : price)}
            </span>

            {hasDiscount && (
                <>
                    <span className={cn('text-muted line-through', SIZES[size === 'lg' ? 'sm' : 'sm'])}>
                        {formatPrice(price)}
                    </span>
                    <Badge tone="maroon">{discountPercent}% off</Badge>
                </>
            )}
        </div>
    );
}