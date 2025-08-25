import {
  AnnotationFileRangeAPI,
  AnnotationPhaseAPI,
  GetSpectrogramsFromDatesQuery,
  PhaseType,
  SpectrogramAPI,
  TaskStatus
} from "@/features/gql/api";
import { UserAPI } from "@/service/api/user.ts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSpectrogramFilters } from "@/view/annotation-campaign/[campaignID]/phase/[phaseType]/filter.ts";

type Spectrogram = {
  id: string;
  status: TaskStatus;
  filename: string;
  start: string;
  duration: number;
  annotationsCount: {
    annotator: number;
    other: number;
  }

}

export const usePhaseFileRanges = ({ page, campaignID, phaseType }: {
  page: number,
  campaignID?: string;
  phaseType?: PhaseType
}) => {
  const { params } = useSpectrogramFilters()
  const {
    data: user,
    isFetching: isFetchingUser,
    error: errorUser
  } = UserAPI.endpoints.getCurrentUser.useQuery()
  const {
    data: fileRangeDatesData,
    isFetching: isFetchingFileRanges,
    error: errorFileRangeDates,
  } = AnnotationFileRangeAPI.endpoints.getFileRangeDates.useQuery({
    campaignID: campaignID ?? '',
    phase: phaseType ?? '',
    annotatorID: user?.id.toString() ?? '',
  }, {
    skip: !user || !phaseType || !campaignID
  })
  const [ spectrograms, setSpectrograms ] = useState<NonNullable<GetSpectrogramsFromDatesQuery["allSpectrograms"]>["results"]>([])
  const [ availableSpectrograms, setAvailableSpectrograms ] = useState<number>(0)
  const [ querySpectrograms, {
    isFetching: isFetchingSpectrograms,
    error: errorSpectrograms,
  } ] = SpectrogramAPI.endpoints.getSpectrogramsFromDates.useLazyQuery()
  const {
    data: spectrogramsComplementData,
    isFetching: isFetchingSpectrogramsComplement,
    error: errorSpectrogramsComplement,
  } = SpectrogramAPI.endpoints.getSpectrogramsFromDatesComplement.useQuery({
    campaignID: campaignID ?? '',
    phase: phaseType ?? '',
    annotatorID: user?.id.toString() ?? '',
    spectrogramIDs: spectrograms.map(s => s?.id ?? null)
  }, {
    skip: !user || !phaseType || !campaignID || spectrograms.length < 1
  })

  const {
    data: phaseData,
    isFetching: isFetchingPhase,
    error: errorPhase,
  } = AnnotationPhaseAPI.endpoints.getPhase.useQuery({
    campaignID: campaignID ?? '',
    phaseType: phaseType ?? '',
  }, {
    skip: !phaseType || !campaignID
  })

  useEffect(() => {
    if (fileRangeDatesData?.allAnnotationFileRanges?.results) loadSpectrograms();
  }, [ fileRangeDatesData ])
  const loadSpectrograms = useCallback(async () => {
    if (!fileRangeDatesData?.allAnnotationFileRanges?.results) return;
    if (!phaseType || !user || !campaignID) return;
    const list = []
    const min = params.fromDatetime ? new Date(params.fromDatetime) : undefined;
    const max = params.toDatetime ? new Date(params.toDatetime) : undefined;
    for (const fileRange of fileRangeDatesData.allAnnotationFileRanges.results) {
      if (!fileRange) continue;
      let from = new Date(fileRange.fromDatetime);
      let to = new Date(fileRange.toDatetime);
      if (min) {
        if (to < min) continue;
        if (from < min) from = min;
      }
      if (max) {
        if (from > max) continue;
        if (to > max) to = max;
      }
      const spectrograms = await querySpectrograms({
        ...params,
        fromDatetime: from.toISOString(),
        toDatetime: to.toISOString(),
        campaignID,
        annotatorID: user.id.toString(),
        phase: phaseType,
        offset: 20 * (page - 1),
      }).unwrap()
      if (!spectrograms.allSpectrograms) continue;
      list.push(...spectrograms.allSpectrograms.results ?? [])
      if (spectrograms.allSpectrograms.totalCount)
        setAvailableSpectrograms(spectrograms.allSpectrograms.totalCount)
    }
    setSpectrograms(list)
  }, [ fileRangeDatesData, phaseType, campaignID, user, setSpectrograms, querySpectrograms, page, setAvailableSpectrograms ]);

  return useMemo(() => {
    let list: Spectrogram[] = [];
    if (spectrograms && spectrogramsComplementData) {
      list = spectrograms.filter(s => s !== null).map(s => ({
        id: s.id,
        filename: s.filename,
        duration: s.duration,
        start: s.start,
        status: spectrogramsComplementData.allAnnotationTasks?.results.find(t => t?.spectrogram.id === s.id)?.status ?? TaskStatus.created,
        annotationsCount: {
          annotator: spectrogramsComplementData.annotatorAnnotations?.results.filter(a => a?.spectrogram?.id === s.id)?.length ?? 0,
          other: spectrogramsComplementData.otherAnnotations?.results.filter(a => a?.spectrogram?.id === s.id)?.length ?? 0,
        }
      } as Spectrogram))
    }
    return {
      pageCount: Math.ceil(availableSpectrograms / 20),
      spectrograms: list,
      phase: phaseData?.annotationPhaseForCampaign,
      isFetching: isFetchingUser || isFetchingFileRanges || isFetchingSpectrograms || isFetchingSpectrogramsComplement || isFetchingPhase,
      error: errorUser ?? errorFileRangeDates ?? errorSpectrograms ?? errorSpectrogramsComplement ?? errorPhase,
    }
  }, [
    isFetchingUser, isFetchingFileRanges, isFetchingSpectrograms, isFetchingSpectrogramsComplement, isFetchingPhase,
    errorUser, errorFileRangeDates, errorSpectrograms, errorSpectrogramsComplement, errorPhase,
    availableSpectrograms, spectrograms, spectrogramsComplementData, phaseData,
  ])
}
