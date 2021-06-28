export interface CategoryState {
  results?: categoryResponse[];
  loading?: boolean;
  error?: Error;
}

export interface categoryResponse {
  name: string;
  id: string;
}
