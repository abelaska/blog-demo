import React from 'react';
import Link from 'next/link';
import type { Post } from '@/prisma';
import { fromNow } from '@/common/time';
import { defaultPostTitle } from '@/common/post';

export const PostLinkBlock = ({ post }: { post: Post }) => (
  <Link href={`/${post.slug}`}>
    <div className="space-y-1 py-8 whitespace-nowrap text-xs flex flex-col cursor-pointer group">
      <div className="flex items-baseline">
        <div className="text-gray-500 text-base font-semibold truncate group-hover:underline">
          {post.title || defaultPostTitle}
        </div>
        <div className="ml-3 text-gray-300 text-md font-light">{fromNow(post.updatedAt)}</div>
      </div>
      <div className="text-gray-400 text-sm truncate">{post.excerpt}</div>
    </div>
  </Link>
);
