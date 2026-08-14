import { useState, useEffect } from 'react';
import { Outlet, useMatches } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';

/**
 * Shell for every /admin/* route. Deliberately NOT wrapped in MainLayout —
 * no storefront Navbar/Footer, own sidebar+topbar visual system (Part 5:
 * "premium SaaS/business dashboard" feel, distinct from the customer site).
 * Auth/role gating already happens one level up in AdminRoute — this
 * component assumes it's only ever reached by a signed-in ADMIN.
 *
 * Each admin page can set its topbar title via the route's handle:
 *   { path: 'products', element: <AdminProducts />, handle: { title: 'Products' } }
 */
export default function AdminLayout() {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const matches = useMatches();
    const pageTitle = [...matches].reverse().find((m) => m.handle?.title)?.handle?.title;

    // Close the mobile sidebar automatically on route change.
    const location = matches[matches.length - 1]?.pathname;
    useEffect(() => {
        setMobileNavOpen(false);
    }, [location]);

    return (
        <div className="h-screen flex bg-cream overflow-hidden">
            {/* Desktop sidebar */}
            <AdminSidebar className="hidden lg:flex" />

            {/* Mobile sidebar overlay */}
            <AnimatePresence>
                {mobileNavOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-espresso/50 z-40 lg:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileNavOpen(false)}
                            aria-hidden="true"
                        />
                        <motion.div
                            className="fixed inset-y-0 left-0 z-50 lg:hidden"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <AdminSidebar />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col min-w-0">
                <AdminTopbar title={pageTitle} onMenuClick={() => setMobileNavOpen(true)} />
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}