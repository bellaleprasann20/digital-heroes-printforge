
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, loading, role } = useAuth();
  const location = useLocation();

  // Wait until Supabase restores the session.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)]">
        <div className="text-center">
          <div
            className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-border)] border-t-[var(--color-primary)]"
            role="status"
            aria-label="Loading"
          />

          <p className="mt-4 text-sm text-[var(--color-muted)]">
            Checking your session...
          </p>
        </div>
      </div>
    );
  }

  // Redirect visitors to login.
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Admins should use the admin workspace.
  if (role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Allow authenticated customers.
  return <Outlet />;
}
