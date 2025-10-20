import { useMemo } from 'react';

export const useSort = <T>({
                             items,
                             itemToSortString,
                             sortDirection,
                           }: {
  items: T[],
  itemToSortString: (data: T) => string,
  sortDirection?: 'ASC' | 'DESC'
}): T[] => {
  return useMemo(() => {
    return items.sort((a, b) => {
      let first = a, second = b;
      if (sortDirection == 'DESC') {
        first = b
        second = a
      }
      return `${ itemToSortString(first) }`.toLowerCase().localeCompare(`${ itemToSortString(second) }`.toLowerCase())
    });
  }, [ items, itemToSortString, sortDirection ])
}
