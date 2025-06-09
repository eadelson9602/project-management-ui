export interface ResponseFilter<T> {
  data: T;
  meta: Meta;
}

export interface Meta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}
