import { useEffect, useMemo } from 'react';

import { useAppSelector } from '@/features/App';

import { API } from './api'
import { Slice } from './Slice'


export const useBrowse = (path: string = '') => {
    const record = useAppSelector(Slice.selectors.selectRecord)
    const parents = useAppSelector(Slice.selectors.selectParents)
    const invalidatedListPaths = useAppSelector(Slice.selectors.selectInvalidatedListPath)
    const children = useMemo(() => {
        const children = parents[path]
        if (children === undefined) return undefined;
        return Object.values(record).filter(r => children?.includes(r.path))
    }, [ record, path, parents ]);

    const [ browse, info ] = API.endpoints.browseStorage.useLazyQuery()
    useEffect(() => {
        if (invalidatedListPaths.includes(path)) browse({ path })
        if (children === undefined) browse({ path })
    }, [ invalidatedListPaths, path, children ]);

    return { children, ...info }
}

export const useSearch = (path: string = '') => {
    const item = useAppSelector(state => Slice.selectors.selectItem(state, path))
    const invalidatedPath = useAppSelector(Slice.selectors.selectInvalidatedPath)

    const [ search, info ] = API.endpoints.searchStorage.useLazyQuery()
    useEffect(() => {
        if (invalidatedPath.includes(path)) search({ path })
        if (!item) search({ path })
    }, [ invalidatedPath, path, item ]);

    return { item, ...info }
}
