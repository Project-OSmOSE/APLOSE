import { useCallback, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { AppState, useAppDispatch, useAppSelector } from '@/features';
import { AnnotationPhaseType } from '@/api';

type BaseType = string | number | boolean | null
type QueryParams = { [key in string]: BaseType | Array<BaseType> }

export const useQueryParams = <T extends QueryParams>(
  selector: (state: AppState) => T,
  update: ActionCreatorWithPayload<T>,
) => {
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

export const useNavParams = () => {
  return useParams<{
    type?: 'source' | 'sound', // For ontology
    id?: string; // For ontology
    datasetID?: string;
    campaignID?: string;
    spectrogramID?: string;
    phaseType?: AnnotationPhaseType;
  }>()
}
