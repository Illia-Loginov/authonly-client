export interface Resource {
  id: string;
  value: string;
  created_at: Date;
  owner_id: string;
  owner_username: string;
}

export interface ResourceSort {
  created_at: 'asc' | 'desc';
}
