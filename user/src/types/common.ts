export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}
export interface PaginationParams {
  page: number;
  limit: number;
}