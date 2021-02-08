const tokenKey = 'token';

export const loadToken = (): string | null => typeof window !== 'undefined' && window.sessionStorage.getItem(tokenKey);

export const saveToken = (token: string | null) =>
  typeof window !== 'undefined' &&
  (token ? window.sessionStorage.setItem(tokenKey, token) : window.sessionStorage.removeItem(tokenKey));
