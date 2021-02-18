import React from 'react';
import { useRouter } from 'next/router';
import { usePosts } from '@/hooks/usePosts';
import { LoadingBlock } from '@/components/LoadingBlock';
import { WhiteButton } from '@/components/Button';
import { PostMenuItem } from './PostMenuItem';

export const PostList = () => {
  const router = useRouter();
  const postId = router?.query?.postId as string;

  const { posts, isMore, isLoading, isRefreshing, loadMore } = usePosts();
  const inProgress = isLoading || isRefreshing;

  if (isLoading) {
    return <LoadingBlock />;
  }

  return (
    <>
      {posts.length ? (
        posts.map((post) => <PostMenuItem key={post.id} post={post} selected={post.id + '' === postId} />)
      ) : (
        <div className="text-center text-gray-200">No post found</div>
      )}
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
};
