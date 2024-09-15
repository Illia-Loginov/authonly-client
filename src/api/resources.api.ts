import { InfiniteData } from '@tanstack/react-query';
import { axiosInstance as axios } from '../config/api.config';
import {
  Resource,
  ResourcePage,
  ResourcePageParam,
  ResourceSort
} from '../types/Resource';
import { initialInfiniteQueryParams } from '../config/resources.config';

export type FetchResourcesQueryKey = ['resources', { sort: ResourceSort }];

export type FetchResourcesQueryUpdate = (
  oldResourceData: InfiniteData<ResourcePage, ResourcePageParam> | undefined
) => InfiniteData<ResourcePage, ResourcePageParam> | undefined;

export const fetchResources = async ({
  queryKey,
  pageParam
}: {
  queryKey: FetchResourcesQueryKey;
  pageParam: {
    offset: number;
    limit: number;
  };
}) => {
  const { sort } = queryKey[1];
  const { offset, limit } = pageParam;

  const response = await axios.get<ResourcePage>('resources', {
    params: {
      sort,
      offset,
      limit
    }
  });

  return response.data;
};

export const createResource = async (payload: Pick<Resource, 'value'>) => {
  const response = await axios.post<{
    resource: Pick<Resource, 'id' | 'value' | 'created_at'>;
  }>('resources', payload);

  return response.data.resource;
};

export const editResource = async (
  payload: Pick<Resource, 'value'>,
  id: Resource['id']
) => {
  const response = await axios.patch<{
    resource: Pick<Resource, 'id' | 'value' | 'created_at'>;
  }>(`resources/${id}`, payload);

  return response.data.resource;
};

export const deleteResource = async (id: Resource['id']) => {
  const response = await axios.delete<{
    resource: Pick<Resource, 'id' | 'value' | 'created_at'>;
  }>(`resources/${id}`);

  return response.data.resource;
};

const dechunkResourceData = (
  resourceData: InfiniteData<ResourcePage, ResourcePageParam>
): [Resource[], boolean] => {
  return [
    resourceData.pages.map((page) => page.resources).flat(),
    resourceData.pages[resourceData.pages.length - 1].isLast
  ];
};

const rechunkResourceData = (
  resources: Resource[],
  isLast: boolean,
  limit: number = initialInfiniteQueryParams.limit
) => {
  const resourceData: InfiniteData<ResourcePage, ResourcePageParam> = {
    pages: [],
    pageParams: []
  };

  for (let offset = 0; offset < resources.length; offset += limit) {
    const page = resources.slice(offset, offset + limit);

    resourceData.pages.push({
      resources: page,
      isLast: offset + limit >= resources.length && isLast
    });

    resourceData.pageParams.push({ offset, limit });
  }

  return resourceData;
};

export const deleteCachedResource = (
  deletedId: Resource['id'],
  sort: ResourceSort
): [FetchResourcesQueryKey, FetchResourcesQueryUpdate] => [
  ['resources', { sort }],
  (
    oldResourceData: InfiniteData<ResourcePage, ResourcePageParam> | undefined
  ) => {
    if (!oldResourceData) {
      return undefined;
    }

    const [resources, isLast] = dechunkResourceData(oldResourceData);

    return rechunkResourceData(
      resources.filter((resource) => resource.id !== deletedId),
      isLast
    );
  }
];

export const addCachedResource = (
  newResource: Resource,
  sort: ResourceSort
): [FetchResourcesQueryKey, FetchResourcesQueryUpdate] => [
  ['resources', { sort }],
  (
    oldResourceData: InfiniteData<ResourcePage, ResourcePageParam> | undefined
  ) => {
    if (!oldResourceData) {
      return undefined;
    }

    const [resources, isLast] = dechunkResourceData(oldResourceData);

    if (sort.created_at === 'asc' && !isLast) {
      return oldResourceData;
    }

    if (sort.created_at === 'desc') {
      resources.unshift(newResource);
    } else {
      resources.push(newResource);
    }

    return rechunkResourceData(resources, isLast);
  }
];

export const editCachedResource = (
  newResource: Resource,
  sort: ResourceSort
): [FetchResourcesQueryKey, FetchResourcesQueryUpdate] => [
  ['resources', { sort }],
  (
    oldResourceData: InfiniteData<ResourcePage, ResourcePageParam> | undefined
  ) => {
    if (!oldResourceData) {
      return undefined;
    }

    const [resources, isLast] = dechunkResourceData(oldResourceData);

    return rechunkResourceData(
      resources.map((resource) =>
        resource.id === newResource.id ? newResource : resource
      ),
      isLast
    );
  }
];

export const deleteCachedResourcesByUser = (
  userId: Resource['owner_id'],
  sort: ResourceSort
): [FetchResourcesQueryKey, FetchResourcesQueryUpdate] => [
  ['resources', { sort }],
  (
    oldResourceData: InfiniteData<ResourcePage, ResourcePageParam> | undefined
  ) => {
    if (!oldResourceData) {
      return undefined;
    }

    const [resources, isLast] = dechunkResourceData(oldResourceData);

    return rechunkResourceData(
      resources.filter((resource) => resource.owner_id !== userId),
      isLast
    );
  }
];
