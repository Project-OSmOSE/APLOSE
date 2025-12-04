import { useMemo } from 'react';

export const useFilter = <T>({
                               items,
                               search,
                               itemToStringArray,
                             }: {
  items: T[],
  search?: string,
  itemToStringArray: (data: T) => string[],
}): T[] => {
  return useMemo(() => {
    return items.filter(item => {
      if (!search) return true;
      const searchItems = search.toLowerCase().split(' ')
      return searchItems.reduce((previous: boolean, searchItem: string) => {
        let actual = false;
        for (const str of itemToStringArray(item)) {
          actual = actual || str.toLowerCase().includes(searchItem);
        }
        return previous && actual
      }, true)
    })
  }, [ itemToStringArray, items, search ])
}
