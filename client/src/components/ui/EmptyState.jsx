import Button from './Button';

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-4 py-20 px-6">
      {Icon && <Icon className="h-10 w-10 text-muted" strokeWidth={1.2} aria-hidden="true" />}
      <h3 className="font-display text-2xl text-espresso">{title}</h3>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
