import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchResources, FetchResourcesQueryKey } from '../api/resources.api';
import { fetchCurrentUser } from '../api/users.api';
import ResourceCard from './ResourceCard';
import { useErrorContext } from '../context/ErrorContext';
import { initialInfiniteQueryParams } from '../config/resources.config';
import IntersectionTrigger from './IntersectionTrigger';
import SortToggle from './SortToggle';
import { useResourceSortContext } from '../context/ResourceSortContext';

const ResourcesList = () => {
  const { dispatch: errorDispatch } = useErrorContext();
  const { sort } = useResourceSortContext();

  const user = useQuery({
    queryKey: ['users'],
    queryFn: fetchCurrentUser,
    throwOnError: (error, _) => {
      errorDispatch({ type: 'throw', error });

      return false;
    }
  });

  const queryKey: FetchResourcesQueryKey = ['resources', { sort }];

  const resourcePages = useInfiniteQuery({
    queryKey,
    queryFn: fetchResources,
    initialPageParam: initialInfiniteQueryParams,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.isLast) {
        return undefined;
      }

      return {
        offset: lastPageParam.offset + initialInfiniteQueryParams.limit,
        limit: initialInfiniteQueryParams.limit
      };
    },
    getPreviousPageParam: (_, __, currentPageParam) => {
      if (currentPageParam.offset === 0) {
        return undefined;
      }

      return {
        offset: currentPageParam.offset - initialInfiniteQueryParams.limit,
        limit: initialInfiniteQueryParams.limit
      };
    },
    throwOnError: (error, _) => {
      errorDispatch({ type: 'throw', error });

      return false;
    }
  });

  const resources = [];
  for (const page of resourcePages.data?.pages || []) {
    resources.push(...page.resources);
  }

  let nextElements = <></>;
  if (resourcePages.isPending) {
    nextElements = <h2 className="text-xl">Loading resources...</h2>;
  } else if (resourcePages.hasNextPage) {
    nextElements = (
      <IntersectionTrigger onVisible={() => resourcePages.fetchNextPage()} />
    );
  }

  return (
    <section>
      <h1 className="text-3xl">Resources</h1>
      <SortToggle />
      {resources.map((resource) => (
        <ResourceCard
          key={resource.id}
          id={resource.id}
          value={resource.value}
          owner_id={resource.owner_id}
          owner_username={resource.owner_username}
          isOwner={!user.isPending && user.data?.id === resource.owner_id}
          created_at={resource.created_at}
        />
      ))}
      {nextElements}
    </section>
  );
};

export default ResourcesList;
