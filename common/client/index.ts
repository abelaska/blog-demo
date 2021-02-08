export * from '@/common/client/common';
export * from '@/common/client/errors';

import * as post from '@/common/client/post';
import * as auth from '@/common/client/auth';
import * as token from '@/common/client/token';

export const client = {
  post,
  auth,
  token,
};
