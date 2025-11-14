export interface Item {
  value: number | string;
  label: string;
  img?: string;
}

export interface SearchItem {
  value: string;
  searchable: string[];
  label: string;
  img?: string;
}
