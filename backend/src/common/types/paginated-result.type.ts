export type PaginatedResult<T> = {
  results: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    limit: number;
  };
};