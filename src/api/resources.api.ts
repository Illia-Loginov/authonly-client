import { axiosInstance as axios } from '../config/api.config';
import { Resource } from '../types/Resource';

export const fetchResources = async ({
  queryKey
}: {
  queryKey: ['resources', { sort: { created_at: 'desc' | 'asc' } }];
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
