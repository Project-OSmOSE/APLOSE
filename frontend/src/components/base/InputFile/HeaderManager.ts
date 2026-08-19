import { useCallback, useMemo, useState } from 'react';

export type HeaderManager<Key extends string> = {
    // Raw
    allRaws: string[],
    selectedRaws: string[],
    availableRaws: string[],
    selectRaw: (raw: string) => void,
    selectRaws: (raw: string[]) => void,
    unselectRaw: (raw: string) => void,

    // Key
    selectedKeys: Key[]
    availableKeys: Key[]

    // Raw <> Key
    getKeyForRaw: (raw: string) => Key | undefined,
    setKeyForRaw: (raw: string, key: Key | null) => void,
    readonly mapRawToKey: Map<string, Key>
}

export const useHeaderManager = <Key extends string, >(
    allKeys: Key[],
    multipleKeys: Key[],
    rawHeaders: string[],
): HeaderManager<Key> => {
    const [ mapRawToKey, setMapRawToKey ] = useState<Map<string, Key>>(new Map());
    const [ selectedRaw, setSelectedRaw ] = useState<string[]>([]);

    const selectedKeys = useMemo(() => {
        return [ ...new Set([ ...mapRawToKey.values() ]) ]
    }, [ mapRawToKey ])

    return {
        // Raw
        allRaws: rawHeaders,
        selectedRaws: selectedRaw,
        availableRaws: useMemo(() => {
            return rawHeaders.filter(header => !selectedRaw.includes(header))
        }, [ rawHeaders, selectedRaw ]),
        selectRaw: useCallback((raw) => {
            setSelectedRaw(prev => [ ...new Set([ ...prev, raw ]) ])
        }, [ setSelectedRaw ]),
        selectRaws: useCallback((raws) => {
            setSelectedRaw(prev => [ ...new Set([ ...prev, ...raws ]) ])
        }, [ setSelectedRaw ]),
        unselectRaw: useCallback((raw) => {
            setSelectedRaw(prev => prev.filter(r => r !== raw))
        }, [ setSelectedRaw ]),

        // Key
        selectedKeys,
        availableKeys: useMemo(() => {
            return [ ...new Set([
                ...allKeys.filter(k => multipleKeys.includes(k as unknown as Key)),
                ...allKeys.filter(key => !selectedKeys.includes(key)),
            ]) ] as Key[]
        }, [ allKeys, multipleKeys, selectedKeys ]),

        // Raw <> Key
        getKeyForRaw: useCallback((raw: string): Key | undefined => {
            return mapRawToKey.get(raw)
        }, [ mapRawToKey ]),
        setKeyForRaw: useCallback((raw: string, key: Key | null) => {
            setMapRawToKey(prev => {
                if (key === null) prev.delete(raw)
                else prev.set(raw, key)
                return new Map(prev)
            })
        }, [ setMapRawToKey ]),
        mapRawToKey,
    }
}