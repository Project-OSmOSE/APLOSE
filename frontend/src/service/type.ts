export type ID = string | number;

export type Optionable<T> = {
  [P in keyof T]?: T[P];
}

export type Paginated<T> = {
  count: number;
  pageCount: number;
  next: string;
  previous: string;
  results: Array<T>;
}
