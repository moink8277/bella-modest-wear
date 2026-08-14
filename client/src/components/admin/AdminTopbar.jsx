import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, LogOut, ExternalLink, ChevronDown, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

/**
 * Top bar for /admin/* — breadcrumb-ish page title (passed in by each admin
 * page via `title`), a mobile menu toggle (opens AdminSidebar as a drawer
 * on small screens — handled by AdminLayout, this just fires the callback),
 * a link back to the live storefront, and the signed-in admin's account menu.
 */
export default function AdminTopbar({ title, onMenuClick }) {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="h-16 shrink-0 flex items-center justify-between gap-4 px-4 md:px-6 border-b border-border bg-white">
            <div className="flex items-center gap-3 min-w-0">
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-2 rounded-[var(--radius-bmw)] text-ink-soft hover:bg-beige/60"
                    aria-label="Open admin menu"
                >
                    <Menu className="h-5 w-5" strokeWidth={1.5} />
                </button>
                <h1 className="font-display text-lg md:text-xl text-espresso truncate">
                    {title || 'Dashboard'}
                </h1>
            </div>

            <div className="flex items-center gap-2 md:gap-3 shrink-0">
                <Link
                    to="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex items-center gap-1.5 text-xs text-ink-soft hover:text-emerald transition-colors"
                >
                    View store
                    <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
                </Link>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setMenuOpen((v) => !v)}
                        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-[var(--radius-bmw)] hover:bg-beige/60 transition-colors"
                    >
                        <span className="h-8 w-8 rounded-full bg-espresso text-ivory flex items-center justify-center">
                            <User className="h-4 w-4" strokeWidth={1.5} />
                        </span>
                        <span className="hidden md:block text-sm text-ink max-w-[10rem] truncate">
                            {user?.name || 'Admin'}
                        </span>
                        <ChevronDown className="hidden md:block h-3.5 w-3.5 text-ink-soft" strokeWidth={1.5} />
                    </button>

                    {menuOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-[var(--radius-bmw-lg)] shadow-bmw-lg z-20 overflow-hidden">
                                <div className="px-3.5 py-3 border-b border-border">
                                    <p className="text-sm text-ink truncate">{user?.name}</p>
                                    <p className="text-xs text-muted truncate">{user?.email}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        logout();
                                    }}
                                    className="w-full flex items-center gap-2 px-3.5 py-2.5 text-sm text-maroon hover:bg-maroon/5 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" strokeWidth={1.5} />
                                    Sign out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}