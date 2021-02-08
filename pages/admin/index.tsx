import React from 'react';
import { getLayout } from '@/components/Layout';
import { PrimaryButton } from '@/components/Button';
import { LayoutContent } from '@/components/LayoutContent';
export default function IndexPage() {
  return (
    <LayoutContent>
      <div className="flex items-center justify-center mt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <h2 className="mt-6 text-center text-3xl leading-9 text-gray-900">
            Welcome to <span className="font-bold">Blog</span> administration
          </h2>
          <p className="mt-4 text-md text-gray-500 text-center">
            Everything you{"'"}ve always wanted to know about accounting automation.
          </p>
          <div className="mt-16 text-center">
            <PrimaryButton label="Create new draft" href="/admin/posts/new?state=DRAFT" />
          </div>
        </div>
      </div>
    </LayoutContent>
  );
}

IndexPage.getLayout = getLayout;
