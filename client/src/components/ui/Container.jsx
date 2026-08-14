import { cn } from '@/utils/cn';

/**
 * Centralized max-width wrapper. Use instead of repeating
 * `max-w-7xl mx-auto px-...` throughout pages.
 */
export default function Container({ as: Tag = 'div', className, children, ...props }) {
  return (
    <Tag
      className={cn('mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12', className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
