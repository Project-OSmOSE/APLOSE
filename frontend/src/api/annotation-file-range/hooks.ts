import { AnnotationFileRangeGqlAPI } from './api'
import { type AnnotationFileRangeInput } from '@/api';
import { useCallback, useMemo } from 'react';
import { useParams } from '@tanstack/react-router';

const {
    updateFileRanges,
} = AnnotationFileRangeGqlAPI.endpoints

export const useUpdateFileRanges = () => {
    const { campaignID, phaseType } = useParams({ strict: false });
    const [ method, info ] = updateFileRanges.useMutation();

    const update = useCallback(async ({
                                          fileRanges,
                                          force,
                                      }: {
        fileRanges: Array<AnnotationFileRangeInput>;
        force?: boolean;
    }) => {
        if (!phaseType || !campaignID) return;
        await method({
            campaignID,
            phaseType,
            fileRanges: fileRanges.map(fr => ({
                id: (fr.id && +fr.id > -1) ? fr.id : undefined,
                annotatorId: fr.annotatorId,
                lastFileIndex: fr.lastFileIndex - 1,
                firstFileIndex: fr.firstFileIndex - 1,
            } as AnnotationFileRangeInput)),
            force,
        }).unwrap()
    }, [ method, campaignID, phaseType ])

    return {
        updateFileRanges: update,
        ...useMemo(() => {
            const formErrors = info.data?.updateAnnotationPhaseFileRanges?.errors ?? []
            return {
                ...info,
                isSuccess: info.isSuccess && formErrors.length === 0,
                formErrors,
            }
        }, [ info ]),
    }

}