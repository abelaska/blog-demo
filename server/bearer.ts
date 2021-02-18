import { NextApiRequest } from 'next';

const REGEX_BEARER_TOKEN = /^Bearer\s+([A-Za-z0-9\-\._~\+\/]+)=*$/;

export const extractBearerToken = (req: NextApiRequest): string | undefined =>
  req.headers?.authorization?.match(REGEX_BEARER_TOKEN)?.[1];
