import qs from 'querystring';
import { isProd } from '@/common/env';

export const productionUrl = process.env.PUBLIC_URL || 'https://blog.example.com';
export const developmentUrl = `http://localhost:3000`;

export const rootUrl = isProd ? productionUrl : developmentUrl;

export const apiUrl = `${rootUrl}/api`;

export const apiFeedUrl = `${apiUrl}/feed`;
export const apiFeedPostUrl = (postSlug: string): string => `${apiFeedUrl}/${postSlug}`;

export const apiPostsUrl = `${apiUrl}/posts`;
export const apiPostUrl = (postId: string | number): string => `${apiPostsUrl}/${postId}`;

export const apiAuthUrl = `${apiUrl}/auth`;
export const apiAuthTokenUrl = `${apiAuthUrl}/token`;

export const urlWithQuery = (url: string, query: { [key: string]: any }) => {
  const q = qs.stringify(query);
  return `${url}${q ? `?${q}` : ''}`;
};
