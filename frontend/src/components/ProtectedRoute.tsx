import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { UserRole } from "../AuthContext";
import LoadingSpinner from "./LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = "/login",
}) => {
  const { user, userProfile, loading } = useAuth();
  const location = useLocation();

  // Debug logging
  console.log("ProtectedRoute - Auth State:", {
    user: !!user,
    userProfile: !!userProfile,
    loading,
    userEmail: user?.email,
    userRole: userProfile?.role,
    path: location.pathname,
  });

  // Show simple loading while auth state is being determined
  if (loading) {
    return (
      <div className="auth-loading">
        <LoadingSpinner
          size="small"
          variant="primary"
          showMessage={false}
          useLottie={false}
        />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log("ProtectedRoute - No user, redirecting to login", {
      path: location.pathname,
      authStateLoading: loading,
    });
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If user exists but profile is still loading, show simple loading
  if (!userProfile) {
    console.log("ProtectedRoute - User exists but no profile, showing loading");
    return (
      <div className="auth-loading">
        <LoadingSpinner
          size="small"
          variant="primary"
          showMessage={false}
          useLottie={false}
        />
      </div>
    );
  }

  // Check role-based access if allowedRoles is specified
  if (allowedRoles && !allowedRoles.includes(userProfile.role)) {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <p>Your role: {userProfile.role}</p>
        <p>Required roles: {allowedRoles.join(", ")}</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
