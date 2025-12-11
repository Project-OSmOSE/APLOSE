export type Paginated<T> = {
  count: number;
  pageCount: number;
  next: string;
  previous: string;
  results: Array<T>;
}

export const NBSP = '\u00A0'