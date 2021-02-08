import React from 'react';
import escapeHtml from 'escape-html';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Post } from '@/prisma';
import { fetcher } from '@/common/client';
import { apiFeedPostUrl } from '@/common/urls';
import { fromNow } from '@/common/time';
import { defaultPostTitle } from '@/common/post';
import { Block, BlockType } from '@/common/editor';
import { LoadingBlock } from '@/components/LoadingBlock';
import { IconButton } from '@/components/Button';
import { IconPencil } from '@/components/Icons';
import { getLayout } from '@/components/LayoutPublic';

const blockToJSX = (block: Block): JSX.Element => {
  const children = block?.children.map(({ text }) => escapeHtml(text)) || null;
  switch (block.type) {
    case BlockType.PARAGRAPH:
      return <p className="mb-6">{children}</p>;
  }
};

const postToJSX = (post: Post): Array<JSX.Element> => JSON.parse(post.body).map(blockToJSX);

export default function PublicPostPage(props: any) {
  const router = useRouter();
  const postSlug = router?.query?.postSlug as string;

  const { data: postData, error: postError } = useSWR(apiFeedPostUrl(postSlug), fetcher);

  const loading = !postData && !postError;
  const post = postData?.post;

  if (loading) {
    return (
      <div className=" max-w-4xl mx-auto mt-6 px-8">
        <LoadingBlock />
      </div>
    );
  }

  return (
    <div className=" max-w-4xl mx-auto mt-6 px-8">
      <div className="flex justify-between">
        <div className="flex items-baseline">
          <div className="text-gray-500 text-lg font-semibold truncate group-hover:underline">
            {post.title || defaultPostTitle}
          </div>
          <div className="ml-3 text-gray-300 text-xs font-light">{fromNow(post.updatedAt)}</div>
        </div>
        <IconButton
          label=""
          border={false}
          invert={false}
          href={`/admin/posts/${post.id}?published=true`}
          leftIcon={<IconPencil className="w-5 h-5 text-gray-500" />}
        />
      </div>
      <div className="mt-4 text-gray-400 text-base">{postToJSX(post)}</div>
    </div>
  );
}

PublicPostPage.getLayout = getLayout;
