import { API_BASE_URL } from './config';
import { getToken, logout } from './authService';

async function apiFetch(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (res.status === 401) {
    logout();
    window.location.href = '/admin/login';
    return;
  }

  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(body?.message ?? 'Error desconocido');
  return body;
}

export function getConfig(requestType) {
  return apiFetch(`/solicitud-config/${requestType}`);
}

export function updateCourse(requestType, name, active) {
  return apiFetch(`/solicitud-config/${requestType}/courses`, {
    method: 'PATCH',
    body: JSON.stringify({ name, active }),
  });
}

export function updateSubject(requestType, name, active) {
  return apiFetch(`/solicitud-config/${requestType}/subjects`, {
    method: 'PATCH',
    body: JSON.stringify({ name, active }),
  });
}
