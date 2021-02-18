import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getLayout } from '@/components/layout/admin/Layout';
import { PrimaryButton } from '@/components/Button';
import { IconChevronLeft } from '@/components/Icons';
import { LayoutContent } from '@/components/layout/admin';

export default function PostsPage() {
  const router = useRouter();

  const filterPublished = ((router.query?.published as string) || 'false').toLocaleLowerCase() === 'true';

  return (
    <LayoutContent
      renderHeader={() => (
        <div className="flex p-6 items-center justify-between">
          <div className="flex inline-flex items-center">
            <Link href="/admin">
              <a className="flex items-center text-gray-500 hover:text-gray-900 pr-3 md:hidden">
                <IconChevronLeft className="flex-shrink-0 h-6 w-6 -ml-1" width={2} />
                <div className="text-normal font-semibold">Back</div>
              </a>
            </Link>
          </div>
        </div>
      )}
    >
      <div className="flex items-center justify-center mt-20 px-8">
        <div className="max-w-md w-full">
          <h2 className="mt-6 text-center text-3xl leading-9 text-gray-900">Posts</h2>
          <p className="mt-4 text-md text-gray-500 text-center">Don{"'"}t forget to create at least one post a day!</p>

          <div className="mt-16 text-center">
            {filterPublished ? (
              <PrimaryButton label="Visit blog" href="/" />
            ) : (
              <PrimaryButton label="Create new draft" href="/admin/posts/new?state=DRAFT" />
            )}
          </div>
        </div>
      </div>
    </LayoutContent>
  );
}

PostsPage.getLayout = getLayout;
