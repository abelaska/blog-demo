import { NextApiRequest, NextApiResponse } from 'next';
import { createJwt } from '@/common/token';
import { isNotValidRequestBody, replyWithError, replyWithSuccess } from '@/common/api';

const adminPassword = process.env.ADMIN_PASSWORD || 'password';

const apiAuthTokenSchema = {
  $id: 'https://blog.example.com/schemas/apiAuthTokenSchema',
  type: 'object',
  properties: {
    password: {
      type: 'string',
      minLength: 0,
      maxLength: 100,
    },
  },
  required: ['password'],
  additionalProperties: false,
};

const exchangePasswordForToken = async (req: NextApiRequest, res: NextApiResponse) => {
  if (isNotValidRequestBody(req, res, apiAuthTokenSchema)) {
    return;
  }

  const { password } = req.body;

  if (adminPassword !== password) {
    return replyWithError(res, 'INVALID_PASSWORD');
  }

  const jwt = createJwt({ username: 'admin' });

  replyWithSuccess(res, { access_token: jwt });
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      return exchangePasswordForToken(req, res);
    }
  } catch (e) {
    console.error(e);
    return replyWithError(res, 'SERVER_ERROR', e.message);
  }

  // 405 Method Not Allowed
  return res.status(405).end();
};
