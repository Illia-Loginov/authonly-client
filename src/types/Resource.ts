export interface Resource {
  id: string;
  value: string;
  created_at: string;
  owner_id: string;
  owner_username: string;
}

export interface ResourceSort {
  created_at: 'asc' | 'desc';
}

export interface ResourcePageParam {
  offset: number;
  limit: number;
}

export interface ResourcePage {
  resources: Resource[];
  isLast: boolean;
}
