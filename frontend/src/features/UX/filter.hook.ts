import { useCallback, useMemo } from 'react';

export const useFilter = <T>({
                               items,
                               search,
                               itemToStringArray,
                             }: {
  items: T[],
  search?: string,
  itemToStringArray: (data: T) => string[],
}): T[] => {
  const isFiltered = useIsFiltered({ search })

  return useMemo(() =>
      items.filter(item => isFiltered(itemToStringArray(item)))
    , [ itemToStringArray, items, isFiltered ])
}

const useIsFiltered = ({ search }: { search?: string }) => {
  return useCallback((items: string[]) => {
    if (!search) return true;
    const searchItems = search.toLowerCase().split(' ')
    return searchItems.reduce((previous: boolean, searchItem: string) => {
      let actual = false;
      for (const str of items) {
        actual = actual || str.toLowerCase().includes(searchItem);
      }
      return previous && actual
    }, true)
  }, [ search ])
}