export * from '@/browser/client/common';
export * from '@/browser/client/errors';

import * as post from '@/browser/client/post';
import * as auth from '@/browser/client/auth';

export const client = {
  post,
  auth,
};
