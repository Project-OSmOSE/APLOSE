import { AnnotationFileRangeGqlAPI } from './api'
import { type AnnotationFileRangeInput, AnnotationPhaseType } from '@/api';
import { useCallback, useMemo } from 'react';
import { type AploseNavParams } from '@/features/UX';
import { useParams } from 'react-router-dom';

const {
  listFileRanges,
  updateFileRanges,
} = AnnotationFileRangeGqlAPI.endpoints

export const useAllFileRanges = () => {
  const { campaignID, phaseType } = useParams<AploseNavParams>();
  const info = listFileRanges.useQuery({
    campaignID: campaignID ?? '',
    phaseType: phaseType ?? AnnotationPhaseType.Annotation,
  }, {
    skip: !campaignID || !phaseType,
  })
  return useMemo(() => ({
    ...info,
    allFileRanges: info.data?.allAnnotationFileRanges?.results.filter(r => r !== null).map(r => ({
      ...r!,
      firstFileIndex: r.firstFileIndex + 1,
      lastFileIndex: r.lastFileIndex + 1,
    })),
  }), [ info ])
}

export const useUpdateFileRanges = () => {
  const { campaignID, phaseType } = useParams<AploseNavParams>();
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