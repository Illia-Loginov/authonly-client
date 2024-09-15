import { ResourcePageParam, ResourceSort } from '../types/Resource';

export const initialInfiniteQueryParams: ResourcePageParam = {
  offset: 0,
  limit: 25
};

export const initialSort: ResourceSort = {
  created_at: 'desc'
};
