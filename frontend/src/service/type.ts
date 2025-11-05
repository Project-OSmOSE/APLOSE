export type ID = string | number;

export type Paginated<T> = {
  count: number;
  pageCount: number;
  next: string;
  previous: string;
  results: Array<T>;
}
