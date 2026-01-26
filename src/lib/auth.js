const API_BASE = "http://127.0.0.1:8000";

const TOKEN_KEY = "gf_access_token";
const REFRESH_KEY = "gf_refresh_token";
const USER_KEY = "gf_user";

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return Boolean(getAccessToken());
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Auth-aware fetch helper for protected endpoints.
 * Adds `Authorization: Bearer <access>` automatically.
 */
export async function authFetch(url, options = {}) {
  const token = getAccessToken();

  // normalize headers to a plain object so we can merge safely
  const inHeaders = options.headers || {};
  const headers =
    inHeaders instanceof Headers
      ? Object.fromEntries(inHeaders.entries())
      : { ...inHeaders };

  if (token) headers.Authorization = `Bearer ${token}`;

  return fetch(url, { ...options, headers });
}

export async function register(payload) {
  const res = await fetch(`${API_BASE}/api/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Register failed (${res.status}) ${text}`.trim());
  }

  return await res.json();
}

export async function login({ email, password }) {
  const res = await fetch(`${API_BASE}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Login failed (${res.status}) ${text}`.trim());
  }

  const tokens = await res.json(); // { access, refresh }
  localStorage.setItem(TOKEN_KEY, tokens.access);
  localStorage.setItem(REFRESH_KEY, tokens.refresh);

  // Load profile (role/garageName)
  const meRes = await fetch(`${API_BASE}/api/auth/me/`, {
    headers: { Authorization: `Bearer ${tokens.access}` },
  });

  if (meRes.ok) {
    const me = await meRes.json();
    localStorage.setItem(USER_KEY, JSON.stringify(me));
    return me;
  }

  return null;
}