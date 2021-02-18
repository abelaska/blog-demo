import React from 'react';
import Head from 'next/head';
import { NotificationsProvider } from '@/components/Notifications';
import { NextPageWithLayout } from '@/components/layout';
import { UserProvider } from '@/hooks/useUser';

import '@/styles/index.css';

type Props = {
  Component: NextPageWithLayout;
  pageProps: any;
};

export default function BlogApp({ Component, pageProps }: Props) {
  const getLayout = Component.getLayout || ((children) => <>{children}</>);
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="manifest.json" />
      </Head>
      <NotificationsProvider>
        <UserProvider>{getLayout(<Component {...pageProps} />)}</UserProvider>
      </NotificationsProvider>
    </>
  );
}
