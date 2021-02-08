import { NextApiRequest, NextApiResponse } from 'next';
import { JwtSession } from '@/common/token';
import { requestToSession } from '@/common/api/token';
import { replyWithError } from '@/common/api/response';

export type SessionContext = {
  session: JwtSession;

  // http
  req: NextApiRequest;
  res: NextApiResponse;
};

export type SessionRequestHandler = (context: SessionContext) => Promise<void>;

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
