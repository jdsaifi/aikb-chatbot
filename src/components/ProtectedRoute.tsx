import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/authService';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, user, token, logout } = useAuthStore();
    const location = useLocation();
    const [isValidating, setIsValidating] = useState(true);

    useEffect(() => {
        const validateAuth = async () => {
            // If no user or token, clear session and stop validation
            if (!token || !user || !isAuthenticated) {
                logout(); // Clear any stale session data
                setIsValidating(false);
                return;
            }

            try {
                // Validate token by calling /v1/users/me endpoint
                await authService.validateToken(token);
                setIsValidating(false);
            } catch (error) {
                // Token is invalid, logout and clear state
                console.error('Token validation failed:', error);
                logout();
                setIsValidating(false);
            }
        };

        validateAuth();
    }, [isAuthenticated, user, token, logout]);

    // Show loading state while validating
    if (isValidating) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                    <p className="mt-4 text-sm text-muted-foreground">
                        Verifying authentication...
                    </p>
                </div>
            </div>
        );
    }

    // If not authenticated, no user, or no token, clear session and redirect to auth page
    if (!isAuthenticated || !user || !token) {
        // Ensure session is cleared before redirecting
        logout();
        // Redirect to auth page with the current location as state
        // so we can redirect back after login
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
