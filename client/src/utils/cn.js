import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge conditional class names + resolve Tailwind conflicts.
 * Usage: cn('px-4', condition && 'px-6') -> 'px-6'
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
