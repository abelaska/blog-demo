const tokenKey = 'token';

const isBrowser = typeof window !== 'undefined';

export const loadToken = (): string | null => isBrowser && window.sessionStorage.getItem(tokenKey);

export const saveToken = (token: string | null) =>
  isBrowser && (token ? window.sessionStorage.setItem(tokenKey, token) : window.sessionStorage.removeItem(tokenKey));
