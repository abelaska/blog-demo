import { NextApiRequest, NextApiResponse } from 'next';
import { JwtSession, validateJwt } from '@/server/jwt';
import { extractBearerToken } from '@/server/bearer';
import { replyWithError } from '@/server/api/response';

export type SessionContext = {
  session: JwtSession;
  req: NextApiRequest;
  res: NextApiResponse;
};

export type SessionRequestHandler = (context: SessionContext) => Promise<void>;

export const requestToSession = (req: NextApiRequest): JwtSession | null => {
  const token = extractBearerToken(req);
  return (token && validateJwt(token)) || null;
};

export const sessionProtected = (handler: SessionRequestHandler) => async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = requestToSession(req);
  if (!session) {
    return replyWithError(res, 'UNAUTHORIZED');
  }

  const context = { session, req, res };

  try {
    return await handler(context);
  } catch (e) {
    console.error(e);
    return replyWithError(res, 'SERVER_ERROR', e.message);
  }
};
