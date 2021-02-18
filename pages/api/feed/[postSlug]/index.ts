import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/prisma';
import { replyWithError, replyWithSuccess } from '@/server/api';

//
const getPublishedPost = async (req: NextApiRequest, res: NextApiResponse) => {
  const slug = req.query?.postSlug as string;
  const post =
    slug &&
    (await prisma.post.findFirst({
      where: { slug, published: true },
    }));
  if (post) {
    replyWithSuccess(res, { post });
  } else {
    replyWithError(res, 'POST_NOT_FOUND');
  }
};

//
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  try {
    if (method === 'GET') {
      return getPublishedPost(req, res);
    }
  } catch (e) {
    console.error(e);
    return replyWithError(res, 'SERVER_ERROR', e.message);
  }

  // 405 Method Not Allowed
  return res.status(405).end();
};
