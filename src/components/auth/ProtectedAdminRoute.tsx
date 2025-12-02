import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * Protected route wrapper for Admin-only sections.
 * Redirects to login if no user is authenticated,
 * or to home if the authenticated user is not ADMIN.
 */
type Props = {
    children: React.ReactElement;
};

const ProtectedAdminRoute: React.FC<Props> = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        // Redirect to login, preserving the targeted location (optional)
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

const userRole = (user?.role ?? '').toString().toUpperCase();
    if (userRole !== 'ADMIN') {
        // Redirect non-admin users to home
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedAdminRoute;
