import { useCallback, useMemo, useRef } from 'react';
import { SpectrogramRestAPI } from './api'
import { useAppDispatch, useAppSelector } from '@/features/App';
import { AnnotationSpectrogramNode, SpectrogramAnalysisNode } from '@/api';
import { SpectrogramDisplaySlice } from './slice';
import type { SpectrogramMode } from '@/features/Spectrogram/Display';
import type { FetchArgs, QueryActionCreatorResult, QueryDefinition } from '@reduxjs/toolkit/query';

const {
    getTile,
} = SpectrogramRestAPI.endpoints

type Params = {
    spectrogram: Pick<AnnotationSpectrogramNode, 'id' | 'filename'>,
    analysis: Pick<SpectrogramAnalysisNode, 'id' | 'legacy'>,
    mode: SpectrogramMode,
    spectrogramPath: string,
    zoom: number,
    tile: number,
}

export const useLazyGetTile = () => {
    const [ method, info ] = getTile.useLazyQuery()

    const spectrogramDisplay = useAppSelector(state => state.spectrogramDisplay)
    const dispatch = useAppDispatch()

    const spectrogramIDRef = useRef<string | undefined>()
    const analysisIDRef = useRef<string | undefined>()

    const _method = useCallback(({ spectrogram, analysis, mode, zoom, tile, spectrogramPath }: Params): QueryActionCreatorResult<QueryDefinition<FetchArgs, any, any, string, any>> | string => {
        if (spectrogramIDRef.current !== spectrogram.id || analysisIDRef.current !== analysis.id) {
            dispatch(SpectrogramDisplaySlice.actions.reset())
            spectrogramIDRef.current = spectrogram.id
            analysisIDRef.current = analysis.id
        }

        const source = SpectrogramDisplaySlice.selectors.imageSrc({ spectrogramDisplay }, { mode, zoom, tile })
        if (source) return source;

        let query: QueryActionCreatorResult<QueryDefinition<FetchArgs, any, any, string, any>>
        switch (mode) {
            case 'png':
                if (analysis.legacy) {
                    const p = spectrogramPath
                    const f = spectrogram.filename
                    query = method({
                        url: `${ p.split(f)[0] }${ f }_${ zoom + 1 }_${ tile }${ p.split(f)[1] }`,
                    })
                } else {
                    query = method({ url: spectrogramPath })
                }
                break;
            default:
                query = method({
                    url: `/api/data/analysis/${ analysis.id }/spectrogram/${ spectrogram.id }/`,
                    params: { mode, zoom, tile },
                })
                break;
        }
        query.unwrap().then(src => dispatch(SpectrogramDisplaySlice.actions.saveTile({ mode, zoom, tile, src })))
        return query
    }, [ method, spectrogramDisplay, dispatch ])

    return useMemo(() => [ _method, info ] as const, [ _method, info ]);
}