import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from './api/authService';

export default function PrivateRoute() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
