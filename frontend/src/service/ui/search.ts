import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { QueryParams } from "@/service/type.ts";
import { AppState, useAppDispatch, useAppSelector } from "@/service/app.ts";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";

export const useSearchedData = <T>({ items, search, mapping, sortField, sortDirection }: {
  items: T[],
  search?: string,
  mapping: (data: T) => string[],
  sortField?: keyof T,
  sortDirection?: 'ASC' | 'DESC'
}): T[] => {
  return useMemo(() => {
    let result = items.filter(item => {
      if (!search) return true;
      const searchItems = search.toLowerCase().split(' ')
      return searchItems.reduce((previous, searchItem) => {
        let actual = false;
        for (const str of mapping(item)) {
          actual = actual || str.toLowerCase().includes(searchItem);
        }
        return previous && actual
      }, true)
    })
    if (sortField) {
      result = result.sort((a, b) => {
        let first = a, second = b;
        if (sortDirection == 'DESC') {
          first = b
          second = a
        }
        return `${ first[sortField] }`.toLowerCase().localeCompare(`${ second[sortField] }`.toLowerCase())
      });
    }
    return result
  }, [ mapping, items, search, sortField, sortDirection ])
}

export const useAppSearchParams = <T extends QueryParams>(
  selector: (state: AppState) => T,
  update: ActionCreatorWithPayload<T>,
): {
  updateParams: (update: Partial<T>) => void;
  clearParams: () => void;
  params: T,

} => {
  const [ searchParams, setSearchParams ] = useSearchParams();
  const params = useAppSelector(selector)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(update(toJSON(searchParams)))
  }, [ searchParams ]);

  const toJSON = useCallback((urlSearchParams: URLSearchParams): T => {
    const params = {} as any
    for (const [ key, value ] of urlSearchParams.entries()) {
      try {
        params[key] = JSON.parse(value);
      } catch {
        params[key] = value;
      }
    }
    return params
  }, [])

  const updateParams = useCallback((newParams: Partial<T>) => {
    for (const [ key, value ] of Object.entries(newParams)) {
      if (value !== undefined) searchParams.set(key, value);
      else searchParams.delete(key);
    }
    setSearchParams(searchParams)
    dispatch(update(toJSON(searchParams)))
  }, [ setSearchParams, searchParams, update ])

  const clearParams = useCallback(() => {
    for (const key of searchParams.keys()) {
      searchParams.delete(key);
    }
    setSearchParams(searchParams)
    dispatch(update(toJSON(searchParams)))
  }, [ setSearchParams, searchParams ])

  return { params, updateParams, clearParams }
}
