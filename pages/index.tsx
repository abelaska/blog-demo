import React from 'react';
import Link from 'next/link';
import type { Post } from '@/prisma';
import { useFeed } from '@/hooks/useFeed';
import { fromNow } from '@/common/time';
import { defaultPostTitle } from '@/common/post';
import { getLayout } from '@/components/LayoutPublic';
import { LoadingBlock } from '@/components/LoadingBlock';
import { WhiteButton, PrimaryButton } from '@/components/Button';

const PostMenuItem = ({ post }: { post: Post }) => (
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

export default function IndexPage() {
  const { posts, isMore, isLoading, isRefreshing, loadMore } = useFeed();
  const inProgress = isLoading || isRefreshing;

  if (isLoading) {
    return <LoadingBlock />;
  }

  if (posts.length < 1) {
    return (
      <div className="flex flex-col space-y-4 items-center">
        <div className="text-gray-300 text-lg my-16">No post found</div>
        <PrimaryButton label="Create first post" href="/admin/posts/new?state=DRAFT" />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto px-8">
        <div className="flex flex-col">
          {posts.map((post) => (
            <PostMenuItem key={post.id} post={post} />
          ))}
        </div>
      </div>

      {isMore ? (
        <div className="my-10 p-4 flex items-center justify-center">
          <WhiteButton
            label={inProgress ? 'Loading more...' : 'Load more'}
            className="border-none"
            progress={inProgress}
            onClick={loadMore}
          />
        </div>
      ) : null}
    </>
  );
}

IndexPage.getLayout = getLayout;
