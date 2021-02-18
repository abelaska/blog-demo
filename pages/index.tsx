import React from 'react';
import { useFeed } from '@/hooks/useFeed';
import { getLayout } from '@/components/layout/public';
import { LoadingBlock } from '@/components/LoadingBlock';
import { WhiteButton, PrimaryButton } from '@/components/Button';
import { PostLinkBlock } from '@/components/PostLinkBlock';
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
            <PostLinkBlock key={post.id} post={post} />
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
