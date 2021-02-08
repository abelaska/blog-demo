import React, { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Menu, Transition } from '@headlessui/react';
import { Post } from '@/prisma';
import { useUser } from '@/hooks/useUser';
import { usePosts } from '@/hooks/usePosts';
import { timeOrDay } from '@/common/time';
import { defaultPostTitle } from '@/common/post';
import { Login } from '@/components/Login';
import { LoadingBlock } from '@/components/LoadingBlock';
import { WhiteButton, IconButton } from '@/components/Button';
import { IconSelector, IconPlus, IconGlobe, IconLogout } from '@/components/Icons';

type GetLayoutFunc = (page: React.ReactElement) => React.ReactElement;

export type NextPageWithLayout = NextPage & {
  getLayout: GetLayoutFunc;
};

type Props = {
  title?: string;
  children?: ReactNode;
  childrenTitle?: string;
};

type MenuItemProps = {
  label: string;
  href?: string;
  selected: boolean;
};

const MenuItem = ({ label, href, selected = false }: MenuItemProps) => {
  const router = useRouter();
  return (
    <Menu.Item>
      {({ active }) => (
        <div
          onClick={() => router.push(href)}
          className={`${selected ? 'font-semibold text-gray-900' : ''} ${
            active ? 'bg-gray-100 text-gray-900' : 'text-gray-600'
          }
          flex justify-between w-full px-4 py-2 text-sm leading-5 text-left cursor-pointer`}
        >
          {label}
        </div>
      )}
    </Menu.Item>
  );
};

const MenuFilter = ({ menu }: { menu: Array<Array<MenuItemProps>> }) => {
  const title = menu.reduce((r, v) => r.concat(v), []).find((i) => i.selected)?.label;
  return (
    <span className="block relative">
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button
              as="div"
              className="no-button -ml-px relative group block border-none focus:outline-none"
              aria-label="User menu"
              aria-haspopup="true"
            >
              <div className="text-gray-600 flex items-center cursor-pointer">
                <div>{title}</div>
                <IconSelector className="ml-0.5 -mb-0.5 w-4 h-4 text-gray-500" width={2} />
              </div>
            </Menu.Button>
            <Transition
              show={open}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="absolute z-30 left-0 w-56 mt-1 origin-top-right bg-white border border-gray-100 rounded-md shadow-lg outline-none divide-y divide-gray-100"
              >
                {menu.map((g, gi) => (
                  <div className="py-1" key={`menu-group-${gi}`}>
                    {g.map((i, ii) => (
                      <MenuItem {...i} key={`menu-group-${gi}-${ii}`} />
                    ))}
                  </div>
                ))}
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </span>
  );
};

const PostMenuItem = ({ post, selected = false }: { post: Post; selected?: boolean }) => (
  <Link href={`/admin/posts/${post.id}?published=${post.published}`}>
    <div
      className={`space-y-1 px-8 py-3 whitespace-nowrap text-xs flex flex-col cursor-pointer ${
        selected ? 'bg-gray-200' : 'hover:bg-gray-100'
      }`}
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

const PostList = () => {
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

export default function Layout({ children, title = 'Blog' }: Props) {
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
              <nav className="flex-1 overflow-y-auto" aria-label="Sidebar">
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
