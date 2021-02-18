import React, { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser } from '@/hooks/useUser';
import { WhiteButton, IconButton } from '@/components/Button';
import { IconLogout } from '@/components/Icons';

export type LayoutProps = {
  title?: string;
  children?: ReactNode;
  childrenTitle?: string;
};

export default function Layout({ children, title = 'Blog' }: LayoutProps) {
  const router = useRouter();
  const { token, logout } = useUser();
  const loggedIn = !!token;

  const onLogout = () => {
    router.push('/');
    logout();
  };

  return (
    <div className="min-h-screen overflow-hidden bg-white">
      <Head>
        <title>{title}</title>
      </Head>

      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 flex flex-col">
        <div className="flex items-center justify-between h-16">
          <div className="text-lg font-bold hover:underline">
            <Link href="/">
              <a>Blog</a>
            </Link>
          </div>
          <div className="flex items-center justify-center space-x-4">
            <WhiteButton label="Administration" href="/admin" data-cy="btn-admin" />
            {loggedIn ? (
              <IconButton
                data-cy="btn-logout"
                label=""
                border={false}
                invert={false}
                onClick={onLogout}
                leftIcon={<IconLogout className="w-5 h-5" />}
              />
            ) : null}
          </div>
        </div>
        <div className="">{children}</div>
      </div>
    </div>
  );
}

export const getLayout = (page: React.ReactElement): React.ReactElement => <Layout>{page}</Layout>;
