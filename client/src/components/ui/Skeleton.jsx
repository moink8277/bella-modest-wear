import { cn } from '@/utils/cn';

export default function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-[var(--radius-bmw)] bg-beige/60', className)} />;
}
