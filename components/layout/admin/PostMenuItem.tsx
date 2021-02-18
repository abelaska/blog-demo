import React from 'react';
import Link from 'next/link';
import { Post } from '@/prisma';
import { timeOrDay } from '@/common/time';
import { defaultPostTitle } from '@/common/post';

export const PostMenuItem = ({ post, selected = false }: { post: Post; selected?: boolean }) => (
  <Link href={`/admin/posts/${post.id}?published=${post.published}`}>
    <div
      className={`space-y-1 px-8 py-3 whitespace-nowrap text-xs flex flex-col cursor-pointer ${
        selected ? 'bg-gray-200' : 'hover:bg-gray-100'
      }`}
      data-cy="post-menu-item"
    >
      <div className="text-gray-400 font-semibold flex justify-between items-center">
        <div className="truncate">{post.title || defaultPostTitle}</div>
        <div className="ml-3">{timeOrDay(post.updatedAt)}</div>
      </div>
      <div className="text-gray-300 flex justify-between items-center">
        <div className="truncate">{post.excerpt}</div>
      </div>
    </div>
  </Link>
);
