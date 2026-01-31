const API_BASE = "http://127.0.0.1:8000";

const TOKEN_KEY = "gf_access_token";
const REFRESH_KEY = "gf_refresh_token";
const USER_KEY = "gf_user";

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY) || "";
}

export function setAccessToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function setRefreshToken(token) {
  localStorage.setItem(REFRESH_KEY, token);
}

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  // FIX: correct refresh endpoint
  const res = await fetch(`${API_BASE}/api/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) return null;

  const json = await res.json();
  if (json?.access) setAccessToken(json.access);
  return json?.access || null;
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

  // clean up old keys if they exist from previous code
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

/**
 * Auth-aware fetch helper for protected endpoints.
 * Adds `Authorization: Bearer <access>` automatically.
 */
export async function authFetch(url, options = {}) {
  const opts = { ...options, headers: { ...(options.headers || {}) } };

  const token = getAccessToken();
  if (token) opts.headers.Authorization = `Bearer ${token}`;

  let res = await fetch(url, opts);

  // If access token expired, try refresh ONCE
  if (res.status === 401) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      const retryOpts = {
        ...opts,
        headers: { ...opts.headers, Authorization: `Bearer ${newAccess}` },
      };
      res = await fetch(url, retryOpts);
    } else {
      logout();
    }
  }

  return res;
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
  setAccessToken(tokens.access);
  setRefreshToken(tokens.refresh);

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