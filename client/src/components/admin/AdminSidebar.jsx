import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    FolderTree,
    Boxes,
    ShoppingBag,
    Users,
    Star,
    Ticket,
    Image,
    Sparkles,
    Newspaper,
    Mail,
    FileQuestion,
    Send,
    Settings,
    ScrollText,
} from 'lucide-react';
import { cn } from '@/utils/cn';

const NAV_GROUPS = [
    {
        label: 'Overview',
        items: [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true }],
    },
    {
        label: 'Catalog',
        items: [
            { to: '/admin/products', label: 'Products', icon: Package },
            { to: '/admin/categories', label: 'Categories', icon: FolderTree },
            { to: '/admin/inventory', label: 'Inventory', icon: Boxes },
        ],
    },
    {
        label: 'Sales',
        items: [
            { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
            { to: '/admin/customers', label: 'Customers', icon: Users },
            { to: '/admin/coupons', label: 'Coupons', icon: Ticket },
        ],
    },
    {
        label: 'Content',
        items: [
            { to: '/admin/reviews', label: 'Reviews', icon: Star },
            { to: '/admin/banners', label: 'Banners', icon: Image },
            { to: '/admin/lookbooks', label: 'Lookbooks', icon: Sparkles },
            { to: '/admin/blog', label: 'Blog', icon: Newspaper },
        ],
    },
    {
        label: 'Inbox',
        items: [
            { to: '/admin/messages', label: 'Messages', icon: Mail },
            { to: '/admin/quotations', label: 'Quotations', icon: FileQuestion },
            { to: '/admin/newsletter', label: 'Newsletter', icon: Send },
        ],
    },
    {
        label: 'System',
        items: [
            { to: '/admin/settings', label: 'Settings', icon: Settings },
            { to: '/admin/audit-logs', label: 'Audit Logs', icon: ScrollText },
        ],
    },
];

/**
 * Fixed dark sidebar for /admin/*. Deliberately a different visual system
 * from the customer storefront (Part 5: "premium SaaS/business dashboard"
 * feel) — espresso background, gold active-state accent, no lattice motif.
 * Rendered by AdminLayout.jsx; not used anywhere in the customer-facing UI.
 */
export default function AdminSidebar({ className }) {
    return (
        <aside
            className={cn(
                'w-64 shrink-0 bg-espresso text-ivory/80 flex flex-col h-full overflow-y-auto',
                className
            )}
        >
            <div className="px-6 py-6 border-b border-ivory/10">
                <span className="font-display text-xl text-ivory tracking-wide">Bella Modest Wear</span>
                <span className="block text-[11px] uppercase tracking-[0.15em] text-gold-light mt-0.5">
                    Admin Panel
                </span>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-6">
                {NAV_GROUPS.map((group) => (
                    <div key={group.label}>
                        <p className="px-3 mb-1.5 text-[11px] uppercase tracking-[0.12em] text-ivory/40">
                            {group.label}
                        </p>
                        <div className="space-y-0.5">
                            {group.items.map(({ to, label, icon: Icon, end }) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    end={end}
                                    className={({ isActive }) =>
                                        cn(
                                            'flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-bmw)] text-sm transition-colors',
                                            isActive
                                                ? 'bg-gold/15 text-gold-light'
                                                : 'text-ivory/70 hover:bg-ivory/5 hover:text-ivory'
                                        )
                                    }
                                >
                                    <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                                    {label}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>
        </aside>
    );
}