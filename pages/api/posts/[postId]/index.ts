import { prisma, Prisma } from '@/prisma';
import {
  isNotValidRequestBody,
  sessionProtected,
  SessionContext,
  replyWithError,
  replyWithSuccess,
} from '@/server/api';
import { extractMeta } from '@/server/post';
import { maxPostBodyLength } from '@/common/post';

type PostContext = SessionContext & {
  postId: number;
};

//
const apiUpdatePostSchema = {
  $id: 'https://blog.example.com/schemas/apiUpdatePostSchema',
  type: 'object',
  properties: {
    body: {
      anyOf: [
        {
          type: 'string',
          minLength: 1,
          maxLength: maxPostBodyLength,
        },
        { type: 'null' },
      ],
    },
    published: {
      anyOf: [{ type: 'boolean' }, { type: 'null' }],
    },
  },
  required: [],
  additionalProperties: false,
};

const updatePost = async ({ req, res, postId: id }: PostContext) => {
  if (isNotValidRequestBody(req, res, apiUpdatePostSchema)) {
    return;
  }

  const { body, published } = req.body;

  const data: Prisma.PostUpdateInput = {};

  if (body) {
    const { title, excerpt, slug } = extractMeta(body);
    data.body = body;
    data.title = title;
    data.excerpt = excerpt;
    data.slug = slug;
  }

  if (published !== null && published !== undefined) {
    data.published = published;
    data.publishedAt = data.published ? new Date() : null;
  }

  const post = await prisma.post.update({
    data,
    where: { id },
  });

  replyWithSuccess(res, { post });
};

//
const getPost = async ({ res, postId: id }: PostContext) => {
  const post = await prisma.post.findUnique({
    where: { id },
  });
  if (post) {
    replyWithSuccess(res, { post });
  } else {
    replyWithError(res, 'POST_NOT_FOUND');
  }
};

//
const deletePost = async ({ res, postId: id }: PostContext) => {
  await prisma.post.delete({ where: { id } });
  replyWithSuccess(res);
};

//
export default sessionProtected(async (ctx: SessionContext) => {
  const { method } = ctx.req;

  const queryPostId = ctx.req.query?.postId;
  if (!queryPostId) {
    return replyWithError(ctx.res, 'POST_NOT_FOUND');
  }

  const postId = parseInt(queryPostId as string, 10);

  const postCtx: PostContext = { ...ctx, postId };

  if (method === 'GET') {
    return getPost(postCtx);
  }

  if (method === 'PUT') {
    return updatePost(postCtx);
  }

  if (method === 'DELETE') {
    return deletePost(postCtx);
  }

  // 405 Method Not Allowed
  return ctx.res.status(405).end();
});
