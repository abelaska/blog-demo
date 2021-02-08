import { NextApiRequest } from 'next';
import { JwtSession, validateJwt } from '@/common/token';

const REGEX_BEARER_TOKEN = /^Bearer\s+([A-Za-z0-9\-\._~\+\/]+)=*$/;

const extractBearerToken = (req: NextApiRequest): string | undefined =>
  req.headers?.authorization?.match(REGEX_BEARER_TOKEN)?.[1];

export const requestToSession = (req: NextApiRequest): JwtSession | null => {
  const token = extractBearerToken(req);
  return (token && validateJwt(token)) || null;
};
