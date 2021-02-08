import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      await prisma.$queryRaw('SELECT 1');
      return res.status(200).end();
    }
  } catch (e) {
    return res.status(500).end();
  }

  // 405 Method Not Allowed
  return res.status(405).end();
};
