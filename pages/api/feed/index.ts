import { NextApiRequest, NextApiResponse } from 'next';
import { isNotValidRequestQuery, replyWithSuccess, replyWithError } from '@/common/api';
import { maxTake, minTake, defaultTake } from '@/common/client/post';
import { prisma, Prisma, stringToCursor, cursorToString } from '@/prisma';

//
const apiFeedFilterSchema = {
  $id: 'https://blog.example.com/schemas/apiFeedFilterSchema',
  type: 'object',
  properties: {
    take: {
      anyOf: [{ type: 'string', regexp: '/[0-9]+/' }, { type: 'null' }],
    },
    cursor: {
      type: 'string',
      maxLength: 100,
    },
  },
  additionalProperties: false,
};

const feed = async (req: NextApiRequest, res: NextApiResponse) => {
  if (isNotValidRequestQuery(req, res, apiFeedFilterSchema)) {
    return;
  }

  const take = Math.max(minTake, Math.min(maxTake, parseInt((req.query.take as string) || defaultTake + '')));

  const cursor: Prisma.PostWhereUniqueInput | undefined = stringToCursor(req.query.cursor as string);

  const where: Prisma.PostWhereInput = {
    published: true,
  };

  const orderBy = { updatedAt: Prisma.SortOrder.desc };

  // https://github.com/prisma/prisma/issues/2855#issuecomment-673828649
  const skip = cursor ? 1 : undefined; // Skip the cursor

  const posts = await prisma.post.findMany({
    skip,
    take,
    cursor,
    where,
    orderBy,
  });

  const hasMore = posts.length === take;
  const nextCursor = (hasMore && cursorToString({ id: posts[posts.length - 1].id })) || undefined;

  replyWithSuccess(res, { hasMore, nextCursor, posts });
};

//
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  try {
    if (method === 'GET') {
      return await feed(req, res);
    }
  } catch (e) {
    console.error(e);
    return replyWithError(res, 'SERVER_ERROR', e.message);
  }

  // 405 Method Not Allowed
  return res.status(405).end();
};
