import { NavLink, Outlet } from 'react-router-dom';
import { LayoutGrid, Package, Heart, User, MapPin, ShieldCheck, Bell, LogOut } from 'lucide-react';
import Container from '@/components/ui/Container';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';

const NAV_ITEMS = [
    { to: '/account', label: 'Overview', icon: LayoutGrid, end: true },
    { to: '/account/orders', label: 'Orders', icon: Package },
    { to: '/account/wishlist', label: 'Wishlist', icon: Heart },
    { to: '/account/profile', label: 'Profile', icon: User },
    { to: '/account/addresses', label: 'Addresses', icon: MapPin },
    { to: '/account/security', label: 'Password & Security', icon: ShieldCheck },
    { to: '/account/notifications', label: 'Notifications', icon: Bell },
];

export default function AccountLayout() {
    const { user, logout } = useAuth();

    return (
        <Container className="py-10 sm:py-14">
            <div className="flex flex-col gap-1 mb-8">
                <h1 className="font-display text-3xl text-espresso">My Account</h1>
                {user?.name && <p className="text-sm text-muted">Welcome back, {user.name}</p>}
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                <aside className="lg:w-56 shrink-0">
                    <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={end}
                                className={({ isActive }) =>
                                    cn(
                                        'flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius-bmw)] text-sm whitespace-nowrap shrink-0 transition-colors',
                                        isActive
                                            ? 'bg-espresso text-ivory'
                                            : 'text-ink-soft hover:bg-cream'
                                    )
                                }
                            >
                                <Icon className="h-4 w-4" strokeWidth={1.5} />
                                {label}
                            </NavLink>
                        ))}

                        <button
                            onClick={logout}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius-bmw)] text-sm whitespace-nowrap shrink-0 text-maroon hover:bg-maroon/5 transition-colors mt-0 lg:mt-2"
                        >
                            <LogOut className="h-4 w-4" strokeWidth={1.5} />
                            Sign Out
                        </button>
                    </nav>
                </aside>

                <div className="flex-1 min-w-0">
                    <Outlet />
                </div>
            </div>
        </Container>
    );
}