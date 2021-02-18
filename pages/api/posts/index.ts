import { prisma, Prisma, stringToCursor, cursorToString } from '@/prisma';
import {
  isNotValidRequestBody,
  isNotValidRequestQuery,
  replyWithSuccess,
  sessionProtected,
  SessionContext,
} from '@/server/api';
import { maxPostBodyLength } from '@/common/post';
import { maxTake, minTake, defaultTake } from '@/browser/client/post';
import { extractMeta } from '@/server/post';

//
const apiCreatePostSchema = {
  $id: 'https://blog.example.com/schemas/apiCreatePostSchema',
  type: 'object',
  properties: {
    body: {
      type: 'string',
      minLength: 1,
      maxLength: maxPostBodyLength,
    },
  },
  required: ['body'],
  additionalProperties: false,
};

const createPost = async ({ req, res }: SessionContext) => {
  if (isNotValidRequestBody(req, res, apiCreatePostSchema)) {
    return;
  }

  const { body } = req.body;

  const { title, excerpt, slug } = extractMeta(body);

  const data: Prisma.PostCreateInput = {
    slug,
    body,
    title,
    excerpt,
  };

  const post = await prisma.post.create({ data });

  replyWithSuccess(res, { post });
};

//
const apiListPostsFilterSchema = {
  $id: 'https://blog.example.com/schemas/apiListPostsFilterSchema',
  type: 'object',
  properties: {
    take: {
      anyOf: [{ type: 'string', regexp: '/[0-9]+/' }, { type: 'null' }],
    },
    published: {
      anyOf: [{ enum: ['true', 'false'] }, { type: 'null' }],
    },
    cursor: {
      type: 'string',
      maxLength: 100,
    },
  },
  additionalProperties: false,
};

const listPosts = async ({ req, res }: SessionContext) => {
  if (isNotValidRequestQuery(req, res, apiListPostsFilterSchema)) {
    return;
  }

  const take = Math.max(minTake, Math.min(maxTake, parseInt((req.query.take as string) || defaultTake + '')));

  const cursor: Prisma.PostWhereUniqueInput | undefined = stringToCursor(req.query.cursor as string);

  const where: Prisma.PostWhereInput = {
    published: ((req.query.published as string) || '').toLowerCase() === 'true',
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
export default sessionProtected(async (ctx: SessionContext) => {
  const { method } = ctx.req;

  if (method === 'GET') {
    return listPosts(ctx);
  }

  if (method === 'POST') {
    return createPost(ctx);
  }

  // 405 Method Not Allowed
  return ctx.res.status(405).end();
});
