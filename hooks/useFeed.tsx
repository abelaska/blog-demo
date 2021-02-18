import { useSWRInfinite } from 'swr';
import { fetcher, errorToMessage } from '@/browser/client';
import { apiFeedUrl, urlWithQuery } from '@/common/urls';
import { useNotify } from '@/components/Notifications';

export const useFeed = ({ take } = { take: 5 }) => {
  const { notifyError } = useNotify();
  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite((pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.posts) {
      return null;
    }
    const cursor = pageIndex > 0 && previousPageData?.nextCursor;
    const url = urlWithQuery(apiFeedUrl, {
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

  if (error) {
    notifyError(errorToMessage(error.code), 'Failed to load published posts');
  }

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
