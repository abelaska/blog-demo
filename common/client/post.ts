import { fetch, Response, ResponseWithNoPayload } from '@/common/client/common';
import { apiPostUrl, apiPostsUrl } from '@/common/urls';
import { Post } from '@/prisma';

export const maxTake = 100;
export const minTake = 1;
export const defaultTake = 20;

export const maxPostBodyLength = 60000;

type PostCreateRequest = {
  body: string;
};

type PostCreateResponse = {
  post: Post;
};

type PostUpdateRequest = {
  body?: string;
  published?: boolean;
};

type PostUpdateResponse = {
  post: Post;
};

export type ListPostsFilter = {
  published?: boolean;
  take?: number;
  cursor?: string;
};

export const create = async (payload: PostCreateRequest): Promise<Response<PostCreateResponse>> =>
  fetch('POST', apiPostsUrl, payload);

export const update = async (postId: string, payload: PostUpdateRequest): Promise<Response<PostUpdateResponse>> =>
  fetch('PUT', apiPostUrl(postId), payload);

export const remove = async (postId: string): Promise<ResponseWithNoPayload> => fetch('DELETE', apiPostUrl(postId));
