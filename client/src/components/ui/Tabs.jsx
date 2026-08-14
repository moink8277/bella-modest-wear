import { useState, useId } from 'react';
import { cn } from '@/utils/cn';

export default function Tabs({ tabs = [], defaultTab, className }) {
    const [active, setActive] = useState(defaultTab || tabs[0]?.id);
    const baseId = useId();

    const activeTab = tabs.find((t) => t.id === active) || tabs[0];

    return (
        <div className={className}>
            <div role="tablist" aria-label="Content tabs" className="flex gap-6 border-b border-border">
                {tabs.map((tab) => {
                    const selected = tab.id === active;
                    return (
                        <button
                            key={tab.id}
                            role="tab"
                            id={`${baseId}-tab-${tab.id}`}
                            aria-selected={selected}
                            aria-controls={`${baseId}-panel-${tab.id}`}
                            onClick={() => setActive(tab.id)}
                            className={cn(
                                'relative pb-3 text-xs uppercase tracking-label transition-colors',
                                selected ? 'text-espresso' : 'text-muted hover:text-ink-soft'
                            )}
                        >
                            {tab.label}
                            {selected && (
                                <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-gold" aria-hidden="true" />
                            )}
                        </button>
                    );
                })}
            </div>

            {tabs.map((tab) => (
                <div
                    key={tab.id}
                    role="tabpanel"
                    id={`${baseId}-panel-${tab.id}`}
                    aria-labelledby={`${baseId}-tab-${tab.id}`}
                    hidden={tab.id !== active}
                    className="pt-6"
                >
                    {tab.id === activeTab?.id && tab.content}
                </div>
            ))}
        </div>
    );
}