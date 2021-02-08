import ky from 'ky-universal';
import { ErrorCode } from '@/common/client/errors';
import { loadToken } from '@/common/client/token';

export type Response<T> = {
  ok: boolean;
  error?: {
    code: ErrorCode;
    message?: string;
  };
} & T;

export type NoPayload = void;

export type ResponseWithNoPayload = Response<NoPayload>;

export const fetch = async <T>(method: string, url: string, body: any = undefined): Promise<Response<T>> => {
  const token = loadToken();
  return ky(url, {
    method,
    ...(body ? { body: JSON.stringify(body) } : null),
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      ...(token ? { authorization: `Bearer ${token}` } : null),
    },
  }).then((r) => r.json());
};

export const fetcher = (url: string): Promise<any> => fetch('GET', url);
