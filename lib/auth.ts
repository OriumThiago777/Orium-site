const AUTH_KEY = 'orium_auth';
const AUTH_DURATION = 60 * 60 * 1000;

export function saveAuth() {
  localStorage.setItem(AUTH_KEY, JSON.stringify({
    authenticated: true,
    timestamp: Date.now()
  }));
}

export function isAuthenticated(): boolean {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!data.authenticated) return false;
    if (Date.now() - data.timestamp > AUTH_DURATION) {
      localStorage.removeItem(AUTH_KEY);
      return false;
    }
    return true;
  } catch { return false; }
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}
