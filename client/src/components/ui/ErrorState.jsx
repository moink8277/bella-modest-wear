import { AlertTriangle } from 'lucide-react';
import Button from './Button';

export default function ErrorState({ message = 'Something went wrong. Please try again.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-4 py-20 px-6" role="alert">
      <AlertTriangle className="h-10 w-10 text-maroon" strokeWidth={1.2} aria-hidden="true" />
      <p className="max-w-sm text-sm text-ink-soft">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
