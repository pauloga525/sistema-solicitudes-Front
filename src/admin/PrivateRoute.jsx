import { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from './api/authService';

const INACTIVITY_MS = 5 * 60 * 1000; // 5 minutos

export default function PrivateRoute() {
  const navigate = useNavigate();

  useEffect(() => {
    let timer;

    function reset() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        logout();
        navigate('/admin/login', { replace: true });
      }, INACTIVITY_MS);
    }

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((e) => document.addEventListener(e, reset, { passive: true }));
    reset(); // arranca el contador desde el primer render

    return () => {
      clearTimeout(timer);
      events.forEach((e) => document.removeEventListener(e, reset));
    };
  }, [navigate]);

  return isAuthenticated() ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
