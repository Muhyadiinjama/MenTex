import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <div className="flex-center full-h">Loading...</div>;
    }

    return currentUser ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
