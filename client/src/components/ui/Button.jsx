import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

const VARIANTS = {
  primary:
    'bg-espresso text-ivory hover:bg-ink border border-espresso',
  gold:
    'bg-gold text-ivory hover:bg-gold-dark border border-gold',
  outline:
    'bg-transparent text-espresso border border-espresso hover:bg-espresso hover:text-ivory',
  outlineLight:
    'bg-transparent text-ivory border border-ivory/70 hover:bg-ivory hover:text-espresso',
  ghost:
    'bg-transparent text-espresso border border-transparent hover:bg-beige/50',
  danger:
    'bg-maroon text-ivory hover:bg-maroon-light border border-maroon',
};

const SIZES = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-sm',
};

/**
 * Bella Modest Wear primary Button.
 * variant: primary | gold | outline | outlineLight | ghost | danger
 */
/**
 * Polymorphic: renders a <button> by default, or any component passed
 * via `as` (e.g. React Router's Link) so buttons and links share one
 * visual system instead of duplicating styles.
 */
const Button = forwardRef(function Button(
  {
    as: Tag = 'button',
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    className,
    children,
    type,
    ...props
  },
  ref
) {
  const isButtonTag = Tag === 'button';

  return (
    <Tag
      ref={ref}
      type={isButtonTag ? type || 'button' : undefined}
      disabled={isButtonTag ? disabled || loading : undefined}
      aria-disabled={!isButtonTag && (disabled || loading) ? true : undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-body uppercase tracking-label',
        'transition-colors duration-300 ease-[var(--ease-luxury)]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'rounded-[var(--radius-bmw)]',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </Tag>
  );
});

export default Button;
