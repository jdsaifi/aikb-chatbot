import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, user } = useAuthStore();
    const location = useLocation();

    if (!isAuthenticated || !user) {
        // Redirect to auth page with the current location as state
        // so we can redirect back after login
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
