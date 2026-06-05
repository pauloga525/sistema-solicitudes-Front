import { API_BASE_URL } from './config';

const TOKEN_KEY = 'itf_admin_token';
const USER_KEY = 'itf_admin_user';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return !!getToken();
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
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

  localStorage.setItem(TOKEN_KEY, body.access_token);
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({ username: body.username, role: body.role }),
  );

  return body;
}
