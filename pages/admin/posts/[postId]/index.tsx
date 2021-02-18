import React, { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Descendant } from 'slate';
import { ReactEditor } from 'slate-react';
import useSWR, { mutate as mutateSWR } from 'swr';
import { usePosts } from '@/hooks/usePosts';
import { apiPostUrl } from '@/common/urls';
import { cloneDeep } from '@/common/utils';
import { EMPTY, Document, MetaBlock, BlockType } from '@/common/editor';
import { client, fetcher, errorToMessage } from '@/browser/client';
import { getLayout } from '@/components/layout/admin/Layout';
import { useNotify } from '@/components/Notifications';
import { LayoutContent } from '@/components/layout/admin';
import { createPostEditor } from '@/components/PostEditor';
import { IconButton, PrimaryButton } from '@/components/Button';
import { IconSpiner, IconChevronLeft, IconTrash } from '@/components/Icons';
import type { Post } from '@/prisma';

type ProgressType = 'SAVING' | 'DELETING';

// https://github.com/ianstormtaylor/slate/issues/3621
const PostEditor = dynamic(() => import('@/components/PostEditor'), {
  ssr: false,
});

let saveTimer;
export default function PostPage(props: any) {
  const router = useRouter();
  const queryPostId = router?.query?.postId as string;
  const isCreate = queryPostId && queryPostId.toLocaleLowerCase() === 'new';
  const postId = !isCreate && queryPostId;

  const { data: dataPosts, mutate: mutatePosts } = usePosts();

  const { data: postData, error: postError } = useSWR(postId && apiPostUrl(postId), fetcher);
  const isLoadingPost = !!(postId && !postData && !postError);
  const loading = isLoadingPost;
  const post = postData?.post;

  const [progress, setProgress] = useState<ProgressType | false>(false);

  const { notifyError } = useNotify();

  const [value, setValue] = useState<Descendant[]>(cloneDeep(EMPTY));
  const editor = useMemo(() => createPostEditor(), []);

  const focusEditor = () => {
    try {
      ReactEditor.focus(editor);
    } catch (ignore) {}

    editor.selection = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    };
  };

  useEffect(() => {
    const metaBlock = (value as Document).find((v) => v.type === BlockType.META) as MetaBlock;
    const valueId = metaBlock?.id;

    if (postId && post && post?.id !== valueId) {
      setValue([...JSON.parse(post.body), { type: BlockType.META, id: post.id, children: [{ text: '' }] }]);

      focusEditor();
    } else if (isCreate && !post) {
      setValue(cloneDeep(EMPTY));

      focusEditor();
    }
  }, [post]);

  const createOrUpdatePost = async ({
    body,
    published,
  }: {
    body?: string;
    published?: boolean;
  }): Promise<{ ok: boolean; post?: Post }> => {
    setProgress('SAVING');
    try {
      const isNew = !post?.id;
      const reply = isNew ? await client.post.create({ body }) : await client.post.update(post.id, { body, published });
      if (reply.ok) {
        const { post } = reply;

        let updatedData = dataPosts || [];

        if (isNew) {
          updatedData = updatedData.map((g) => ({
            ...g,
            posts: g.posts.map((t) => (t.id === post.id ? post : t)),
          }));

          if (updatedData.length < 1) {
            updatedData.push({ ok: true, hasMore: false, posts: [post] });
          } else {
            updatedData[0].posts.unshift(post);
          }
        } else {
          updatedData = updatedData.map((g) => ({
            ...g,
            posts: g.posts.map((t) => (t.id === post.id ? post : t)),
          }));
        }

        mutatePosts(updatedData, false);
        mutateSWR(apiPostUrl(post.id), { ...reply }, false);

        return { ok: true, post };
      } else {
        notifyError(errorToMessage(reply.error.code), 'Post not saved!');
      }
    } catch (e) {
      notifyError(e, 'Post not saved!');
    } finally {
      setProgress(false);
    }

    return { ok: false };
  };

  const save = async (saveValue: Document) => {
    const isNew = !post?.id;

    const body = JSON.stringify(saveValue.filter((v) => v.type !== BlockType.META));

    const { ok, post: replyPost } = await createOrUpdatePost({ body });
    if (ok && isNew) {
      router.push(`/admin/posts/${replyPost.id}`, `/admin/posts/${replyPost.id}`, {
        shallow: true,
      });
    }
  };

  const publishPost = async () => {
    const { ok } = await createOrUpdatePost({ published: true });
    if (ok) {
      router.push('/admin/posts?published=true');
    }
  };

  const unpublishPost = async () => {
    const { ok } = await createOrUpdatePost({ published: false });
    if (ok) {
      router.push('/admin/posts?published=false');
    }
  };

  const deletePost = async () => {
    setProgress('DELETING');
    try {
      const reply = await client.post.remove(post.id);
      if (reply.ok) {
        const updatedData = (dataPosts || []).map((g) => ({
          ...g,
          posts: g.posts.filter((t) => t.id !== post.id),
        }));

        mutatePosts(updatedData, false);

        router.push('/admin/posts/new');
      } else {
        notifyError(errorToMessage(reply.error.code), 'Post not deleted!');
      }
    } catch (e) {
      notifyError(e, 'Post not deleted!');
    } finally {
      setProgress(false);
    }
  };

  const onValueChange = (newValue) => {
    setValue(newValue);

    if (value !== newValue) {
      if (saveTimer) {
        clearTimeout(saveTimer);
      }
      saveTimer = setTimeout(() => save(newValue), 1000);
    }
  };

  const onDeletePost = async () => deletePost();

  const onPublishOrUnpublish = async () => (post.published ? unpublishPost() : publishPost());

  return (
    <LayoutContent
      renderHeader={() => (
        <div className="flex px-8 py-6 items-center justify-between">
          <div className="flex inline-flex items-center">
            <Link href="/">
              <a className="flex items-center text-gray-500 hover:text-gray-900 pr-3 md:hidden">
                <IconChevronLeft className="flex-shrink-0 h-6 w-6 -ml-1" width={2} />
                <div className="text-normal font-semibold">Back</div>
              </a>
            </Link>
            <div className="text-gray-300 flex inline-flex items-center capitalize pl-3 md:pl-0 md:border-l-0 border-l border-gray-200">
              {progress || loading ? (
                <>
                  <IconSpiner className={`h-5 w-5`} />
                  <div className="ml-2">
                    {progress === 'SAVING' ? 'Saving...' : progress === 'DELETING' ? 'Deleting...' : 'Loading...'}
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {post ? (
            <div className="flex items-center justify-center space-x-6">
              <IconButton
                label=""
                border={false}
                invert={false}
                onClick={onDeletePost}
                leftIcon={<IconTrash className="w-5 h-5" />}
              />
              <PrimaryButton label={post.published ? 'Unpublish' : 'Publish'} onClick={onPublishOrUnpublish} />
            </div>
          ) : null}
        </div>
      )}
    >
      <main>
        <div className=" max-w-4xl mx-auto mt-6 px-8">
          {loading ? null : (
            <PostEditor
              editor={editor}
              value={value}
              onChange={onValueChange}
              className="text-gray-700 text-xl font-serif flex-grow w-full mb-16"
            />
          )}
        </div>
      </main>
    </LayoutContent>
  );
}

PostPage.getLayout = getLayout;
