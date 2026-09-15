import { Navigate, Route, Routes } from "react-router-dom";
import AdminPortal from "./pages/admin/AdminPortal";
import CustomerPortal from "./pages/customer/CustomerPortal";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import LoginForm from "./components/LoginForm";
import CustomerLoginPage from "./components/CustomerLoginPage";
import { getSessionUser } from "./api";

function ProtectedRoute({ role, children }) {
  const user = getSessionUser();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const user = getSessionUser();
  if (user) return <Navigate to={`/${user.role}`} replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/admin-login"
        element={
          <PublicRoute>
            <LoginForm />
          </PublicRoute>
        }
      />
      <Route
        path="/customer-login"
        element={
          <PublicRoute>
            <CustomerLoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />
      <Route
        path="/customer"
        element={
          <ProtectedRoute role="customer">
            <CustomerPortal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminPortal />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
