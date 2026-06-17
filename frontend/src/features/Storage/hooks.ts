import type { StorageItemFragment } from '@/features/Storage/api';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import * as API from './api';
import { Slice } from './slice';
import { createSelector } from '@reduxjs/toolkit';

const selectRecord = createSelector(state => state, Slice.selectors.selectRecord)
const selectParents = createSelector(state => state, Slice.selectors.selectParents)
const selectInvalidatedPath = createSelector(state => state, Slice.selectors.selectInvalidatedPath)
const selectInvalidatedListPath = createSelector(state => state, Slice.selectors.selectInvalidatedListPath)


export const useStorageSearch = (path: string): StorageItemFragment | undefined => {
    const record = useAppSelector(selectRecord)
    const invalidatedPath = useAppSelector(selectInvalidatedPath)

    const dispatch = useAppDispatch()

    const {
        refetch: search,
        data: item,
    } = useQuery({
        ...API.searchQuery({ path }),
        enabled: false,
    })

    useEffect(() => {
        if (invalidatedPath.includes(path)) search()
        if (!record[path]) search()
    }, [ invalidatedPath, path, record ]);

    useEffect(() => {
        if (!item) return
        dispatch(Slice.actions.setRecord(item))
        dispatch(Slice.actions.validatePath(item?.path))
    }, [ item ]);

    return useMemo(() => record[path], [ record, path ]);
}

export const useStorageBrowse = (path: string = '') => {
    const record = useAppSelector(selectRecord)
    const parents = useAppSelector(selectParents)
    const invalidatedListPaths = useAppSelector(selectInvalidatedListPath)
    const children = useMemo(() => {
        const children = parents[path]
        if (children === undefined) return undefined;
        return Object.values(record).filter(r => children?.includes(r.path))
    }, [ record, path, parents ]);

    const dispatch = useAppDispatch()

    const {
        refetch: browse,
        data,
    } = useQuery({
        ...API.browseQuery({ path }),
        enabled: false,
    })

    useEffect(() => {
        if (invalidatedListPaths.includes(path)) browse()
        if (children === undefined) browse()
    }, [ invalidatedListPaths, path, children ]);

    useEffect(() => {
        if (!data) return
        for (const item of data) {
            if (!item) continue
            dispatch(Slice.actions.setRecord(item))
        }
        dispatch(Slice.actions.setParents({
            parent: path,
            children: data.map(d => d.path),
        }))
        dispatch(Slice.actions.validatePath(path))
    }, [ data ]);

    return children
}

