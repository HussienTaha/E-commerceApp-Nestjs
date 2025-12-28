export interface PaginatedResult<T> {
  docs: T[];
  currentPage: number;
  count: number;
  numberOfPages: number;
}
