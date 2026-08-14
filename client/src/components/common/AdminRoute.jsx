import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Loader from '@/components/ui/Loader';

export default function AdminRoute() {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
        return <Loader label="Checking access" className="min-h-[50vh]" />;
    }

    if (!isAuthenticated || user?.role !== 'ADMIN') {
        return <Navigate to="/secure-panel" replace />;
    }

    return <Outlet />;
}