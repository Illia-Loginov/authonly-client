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
