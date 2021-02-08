import { useRouter } from 'next/router';
import { useSWRInfinite } from 'swr';
import { fetcher } from '@/common/client';
import { apiPostsUrl, urlWithQuery } from '@/common/urls';

const take = 20;

export const usePosts = () => {
  const router = useRouter();

  const published = ((router.query?.published as string) || 'false').toLocaleLowerCase() === 'true';

  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite((pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.posts) {
      return null;
    }
    const cursor = pageIndex > 0 && previousPageData?.nextCursor;
    const url = urlWithQuery(apiPostsUrl, {
      published,
      take,
      ...(cursor && { cursor }),
    });
    return url;
  }, fetcher);

  const refresh = () => mutate();

  const loadMore = () => {
    setSize(size + 1);
  };

  const isError = !!error;
  const isMore = data?.[data.length - 1]?.hasMore;
  const isRefreshing = isValidating && data && data.length === size;
  const isLoading = !error && !data;

  const posts =
    data
      ?.map((d) => d.posts)
      .filter((p) => p?.length)
      .reduce((r, v) => r.concat(v), []) || [];

  // FIXME handle error

  return {
    posts,
    error,
    data,
    isMore,
    isRefreshing,
    isLoading,
    isError,
    mutate,
    refresh,
    loadMore,
  };
};
