import { API_BASE_URL } from './config';

const TOKEN_KEY = 'itf_admin_token';
const USER_KEY  = 'itf_admin_user';

// Borra la sesión si la página fue recargada (F5 / Ctrl+R)
(function clearOnReload() {
  const nav = performance.getEntriesByType?.('navigation')?.[0];
  if (nav?.type === 'reload') {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  }
})();

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return !!getToken();
}

export function logout() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export async function login(username, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  let body = null;
  try {
    body = await res.json();
  } catch {
    /* sin body */
  }

  if (!res.ok) {
    throw new Error(body?.message ?? 'Usuario o contraseña incorrectos');
  }

  sessionStorage.setItem(TOKEN_KEY, body.access_token);
  sessionStorage.setItem(
    USER_KEY,
    JSON.stringify({ username: body.username, role: body.role }),
  );

  return body;
}
