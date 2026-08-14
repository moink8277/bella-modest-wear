import { cn } from '@/utils/cn';

/**
 * Consistent editorial heading used to open every homepage/section block.
 * eyebrow: small uppercase label above the heading (optional, only when it adds meaning)
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className
      )}
    >
      {eyebrow && (
        <span className="tracking-label text-xs uppercase text-gold-dark font-body">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-xl text-muted font-body text-sm sm:text-base leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
