const AUTH_KEY = 'orium_auth';
const AUTH_DURATION = 8 * 60 * 60 * 1000;

export function saveAuth(token?: string) {
  localStorage.setItem(AUTH_KEY, JSON.stringify({
    authenticated: true,
    timestamp: Date.now(),
    ...(token ? { token } : {})
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
    // Sessão deslizante: renova o timestamp a cada verificação válida
    localStorage.setItem(AUTH_KEY, JSON.stringify({ ...data, timestamp: Date.now() }));
    return true;
  } catch { return false; }
}

export function getAuthToken(): string | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data.authenticated) return null;
    if (Date.now() - data.timestamp > AUTH_DURATION) {
      localStorage.removeItem(AUTH_KEY);
      return null;
    }
    return data.token ?? null;
  } catch { return null; }
}

export function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}
