import { axiosInstance as axios } from '../config/api.config';
import { Resource, ResourceSort } from '../types/Resource';

export type FetchResourcesQueryKey = ['resources', { sort: ResourceSort }];

export type FetchResourcesQueryUpdate = (
  oldResources: Resource[] | undefined
) => Resource[] | undefined;

export const fetchResources = async ({
  queryKey
}: {
  queryKey: FetchResourcesQueryKey;
}) => {
  const { sort } = queryKey[1];

  const response = await axios.get<{
    resources: Resource[];
  }>('resources', {
    params: {
      sort
    }
  });

  return response.data.resources;
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

export const deleteCachedResource = (
  deletedId: Resource['id'],
  sort: ResourceSort = { created_at: 'desc' }
): [FetchResourcesQueryKey, FetchResourcesQueryUpdate] => {
  return [
    ['resources', { sort }],
    (oldResources: Resource[] | undefined) =>
      oldResources?.filter((resource) => resource.id !== deletedId)
  ];
};

export const addCachedResource = (
  newResource: Resource,
  sort: ResourceSort = { created_at: 'desc' }
): [FetchResourcesQueryKey, FetchResourcesQueryUpdate] => {
  return [
    ['resources', { sort }],
    (oldResources: Resource[] | undefined) =>
      oldResources &&
      (sort.created_at === 'desc'
        ? [newResource, ...oldResources]
        : [...oldResources, newResource])
  ];
};

export const editCachedResource = (
  newResource: Resource,
  sort: ResourceSort = { created_at: 'desc' }
): [FetchResourcesQueryKey, FetchResourcesQueryUpdate] => {
  return [
    ['resources', { sort }],
    (oldResources: Resource[] | undefined) =>
      oldResources?.map((resource) =>
        resource.id === newResource.id ? newResource : resource
      )
  ];
};
