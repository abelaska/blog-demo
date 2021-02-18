import React, { ReactNode } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUser } from '@/hooks/useUser';
import { Login } from '@/components/Login';
import { IconButton } from '@/components/Button';
import { IconPlus, IconGlobe, IconLogout } from '@/components/Icons';
import { MenuFilter } from './MenuFilter';
import { PostList } from './PostList';

export type LayoutProps = {
  title?: string;
  children?: ReactNode;
  childrenTitle?: string;
};

export default function Layout({ children, title = 'Blog' }: LayoutProps) {
  const router = useRouter();
  const { token, logout } = useUser();

  const postId = router?.query?.postId as string;

  const filterPublished = ((router.query?.published as string) || 'false').toLocaleLowerCase() === 'true';

  const prioritizeCenter = !!postId;

  const leftColumnClassName = prioritizeCenter
    ? 'hidden md:flex md:flex-col md:w-80 md:shadow-xl'
    : 'flex flex-col w-full md:w-80 md:shadow-xl';
  const centerColumnClassName = prioritizeCenter
    ? 'md:flex md:flex-col min-w-0 flex-1'
    : 'hidden md:flex md:flex-col min-w-0 flex-1';

  const onLogout = () => {
    router.push('/');
    logout();
  };

  if (!token) {
    return (
      <>
        <Head>
          <title>Login</title>
        </Head>
        <Login />
      </>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-white">
      <Head>
        <title>{title}</title>
      </Head>

      <div className={leftColumnClassName}>
        <div className="flex flex-col h-0 flex-1 bg-gray-50">
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="relative flex flex-row justify-between items-center flex-shrink-0 px-8 mt-4 mb-4 z-10">
              <MenuFilter
                menu={[
                  [
                    {
                      label: 'Drafts',
                      href: '/admin/posts?published=false',
                      selected: !filterPublished,
                    },
                    {
                      label: 'Published Posts',
                      href: '/admin/posts?published=true',
                      selected: filterPublished,
                    },
                  ],
                ]}
              />

              <div className="ml-4 -mr-3.5">
                <IconButton
                  data-cy="btn-new-draft"
                  label=""
                  border={false}
                  invert={true}
                  href="/admin/posts/new"
                  leftIcon={<IconPlus className="w-5 h-5" width={2} />}
                />

                <IconButton
                  label=""
                  border={false}
                  invert={true}
                  href="/"
                  leftIcon={<IconGlobe className="w-5 h-5" />}
                />

                <IconButton
                  label=""
                  border={false}
                  invert={true}
                  onClick={onLogout}
                  leftIcon={<IconLogout className="w-5 h-5" />}
                />
              </div>
            </div>

            <div className="flex-1 relative z-0 flex overflow-hidden">
              <nav className="flex-1 overflow-y-auto" aria-label="Sidebar" data-cy="posts-list">
                <PostList />
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className={centerColumnClassName}>{children}</div>
    </div>
  );
}

export const getLayout = (page: React.ReactElement): React.ReactElement => <Layout>{page}</Layout>;
