import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  superAdminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly, superAdminOnly }) => {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">Carregando...</div>
    </div>;
  }

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  if (adminOnly && userProfile?.role !== 'admin' && userProfile?.role !== 'superadmin') {
    return <Navigate to="/user" replace />;
  }

  if (superAdminOnly && userProfile?.role !== 'superadmin') {
    return <Navigate to="/user" replace />;
  }

  return <>{children}</>;
};

const RootRedirect: React.FC = () => {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-xl font-semibold">Carregando...</div>
    </div>;
  }

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  console.log('=== RootRedirect Debug ===');
  console.log('Current User UID:', currentUser?.uid);
  console.log('Current User Email:', currentUser?.email);
  console.log('User Profile:', userProfile);
  console.log('User Role:', userProfile?.role);
  console.log('========================');

  // SuperAdmin goes to role selection
  if (userProfile?.role === 'superadmin') {
    console.log('✅ Redirecting to select-role (SuperAdmin)');
    return <Navigate to="/select-role" replace />;
  }

  // Admin goes to admin panel
  if (userProfile?.role === 'admin') {
    console.log('✅ Redirecting to admin (Admin)');
    return <Navigate to="/admin" replace />;
  }

  // Regular user goes to user page
  console.log('✅ Redirecting to user (Regular User)');
  return <Navigate to="/user" replace />;
};

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/select-role"
              element={
                <ProtectedRoute superAdminOnly>
                  <RoleSelectionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <UserPage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<RootRedirect />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;