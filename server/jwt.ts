import { sign, verify } from 'jsonwebtoken';

const secret = process.env.TOKEN_SECRET || 'secret';

const issuer = process.env.TOKEN_ISSUER || 'blog.example.com';

const algorithm = 'HS256';

const expiresIn = '30d';

export type JwtSession = {
  username: string;
};

export const createJwt = (session: JwtSession): string => sign(session, secret, { issuer, algorithm, expiresIn });

export const validateJwt = (jwt: string): JwtSession | null => {
  try {
    return verify(jwt, secret, {
      issuer,
      algorithms: [algorithm],
    }) as JwtSession;
  } catch (e) {
    console.error(e);
    return null;
  }
};
