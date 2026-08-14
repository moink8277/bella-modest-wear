import { cn } from '@/utils/cn';

/**
 * Generic surface container. Base for ProductCard, admin stat cards,
 * form panels, etc. Keep visual rules (border/shadow/radius) here only —
 * don't repeat them ad-hoc in other components.
 *
 * padding: 'none' | 'sm' | 'md' | 'lg'
 * hoverable: adds a subtle lift/shadow on hover (use for clickable cards)
 */
const PADDING = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  as: Tag = 'div',
  padding = 'md',
  hoverable = false,
  className,
  children,
  ...props
}) {
  return (
    <Tag
      className={cn(
        'bg-white border border-border rounded-[var(--radius-bmw-lg)]',
        'shadow-[var(--shadow-bmw)]',
        hoverable &&
          'transition-all duration-300 ease-[var(--ease-luxury)] hover:shadow-[var(--shadow-bmw-lg)] hover:-translate-y-0.5',
        PADDING[padding],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
