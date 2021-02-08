import { NextApiResponse } from 'next';
import { ErrorCode } from '@/common/client/errors';

export const replyWithError = (res: NextApiResponse, code: ErrorCode, message?: string) =>
  res.json({ ok: false, error: { code, message } });

export const replyWithSuccess = (res: NextApiResponse, payload?: any) => res.json({ ...payload, ok: true });
