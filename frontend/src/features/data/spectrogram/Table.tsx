import React, { Fragment, useCallback, useMemo, useState } from "react";
import { SpectrogramAPI, SpectrogramForCampaign } from "./api";
import { UserAPI } from "@/service/api/user.ts";
import { PhaseType, TaskStatus } from "@/features/gql/api";
import styles from "@/view/campaign/details/styles.module.scss";
import { Button, Table, TableContent, TableDivider, TableHead, WarningText } from "@/components/ui";
import { DateFilter } from "@/view/annotation-campaign/[campaignID]/phase/[phaseType]/DateFilter.tsx";
import { AnnotationsFilter } from "@/view/campaign/details/filters/AnnotationsFilter.tsx";
import { StatusFilter } from "@/view/annotation-campaign/[campaignID]/phase/[phaseType]/StatusFilter.tsx";
import { IonIcon, IonSpinner } from "@ionic/react";
import { checkmarkCircle, chevronForwardOutline, ellipseOutline } from "ionicons/icons";
import { dateToString, getErrorMessage } from "@/service/function.ts";
import { formatTime } from "@/service/dataset/spectrogram-configuration/scale";
import { useNavigate } from "react-router-dom";
import { useSpectrogramFilters } from "@/service/slices/filter.ts";
import { AnnotationFileRangeAPI } from "@/features/annotation/annotationFileRange";

const useSpectrogramsForCampaign = ({
                                      campaignID: _campaignID, phaseType
                                    }: {
  campaignID?: string;
  phaseType?: PhaseType;
}) => {
  const campaignID = useMemo(() => _campaignID ?? '', [ _campaignID ])
  const phase = useMemo(() => phaseType ?? '', [ phaseType ])
  const { data: user } = UserAPI.endpoints.getCurrentUser.useQuery()
  const annotatorID = useMemo(() => user?.id ?? '', [ user ])
  const { data: fileRangeDates } = AnnotationFileRangeAPI.endpoints.getFileRangeDates.useQuery({
    campaignID, phase, annotatorID,
  }, {
    skip: !annotatorID || !phase || !campaignID
  })


}

export const SpectrogramForCampaignTable: React.FC<{ campaignID?: string, phase?: string }> = ({
                                                                                                 campaignID,
                                                                                                 phase
                                                                                               }) => {
  const [ page, setPage ] = useState<number>(1);
  const { data: user } = UserAPI.endpoints.getCurrentUser.useQuery()
  const { data: fileRangeDates } = AnnotationFileRangeAPI.endpoints.getFileRangeDates.useQuery({
    campaignID: campaignID ?? '',
    phase: phase ?? '',
    annotatorID: user?.id ?? '',
  }, {
    skip: !user || !phase || !campaignID
  })

  const { data: spectrograms, isLoading, error } = SpectrogramAPI.endpoints.getSpectrogramsForCampaign.useQuery({
    campaignID,
    annotatorID: user?.id ?? '',
    offset: (page - 1) * 20,
    phase: phase ?? ''
  }, {
    skip: !user || !phase || !campaignID
  });

  const onFilterUpdated = useCallback(() => {
    setPage(1)
  }, [])

  if (!phase || !campaignID) return <Fragment/>
  if (isLoading) return <IonSpinner/> // TODO: Skeleton loading
  if (error) return <WarningText>{ getErrorMessage(error) }</WarningText>

  return <Fragment>
    <Table columns={ 12 } className={ styles.filesTable }>
      <TableHead topSticky isFirstColumn={ true }>
        Filename
      </TableHead>
      <TableHead topSticky>
        Date
        <DateFilter onUpdate={ onFilterUpdated }/>
      </TableHead>
      <TableHead topSticky>
        Duration
      </TableHead>
      <TableHead topSticky>
        Annotations{ phase === PhaseType.verification && <Fragment><br/>to check</Fragment> }
        <AnnotationsFilter onUpdate={ onFilterUpdated }/>
      </TableHead>
      { phase === PhaseType.verification && <TableHead topSticky>
          Validated<br/>annotations
      </TableHead> }
      <TableHead topSticky>
        Status
        <StatusFilter onUpdate={ onFilterUpdated }/>
      </TableHead>
      <TableHead topSticky>
        Access
      </TableHead>
      <TableDivider/>

      { spectrograms?.map(s => <SpectrogramRow key={ s.id }
                                               { ...s }
                                               phase={ phase }
                                               campaignID={ campaignID }/>) }
    </Table>

  </Fragment>
}

const SpectrogramRow: React.FC<SpectrogramForCampaign & { phase: string, campaignID: string }> = ({
                                                                                                    id,
                                                                                                    taskStatus,
                                                                                                    filename,
                                                                                                    start,
                                                                                                    duration,
                                                                                                    annotatorAnnotations,
                                                                                                    otherAnnotations,
                                                                                                    campaignID,
                                                                                                    phase,
                                                                                                  }) => {
  const navigate = useNavigate()
  const { params } = useSpectrogramFilters() // TODO: redo this fileFilters hook as for campaign
  const isFinished = useMemo(() => taskStatus === TaskStatus.finished, [ taskStatus ]);

  const access = useCallback(() => {
    const encodedParams = encodeURI(Object.entries(params).map(([ k, v ]) => `${ k }=${ v }`).join('&'));
    navigate(`/annotation-campaign/${ campaignID }/phase/${ phase }/file/${ id }?${ encodedParams }`);
  }, [ id, campaignID, phase ])

  return <Fragment>
    <TableContent isFirstColumn={ true } disabled={ isFinished }>{ filename }</TableContent>
    <TableContent disabled={ isFinished }>{ dateToString(start) }</TableContent>
    <TableContent disabled={ isFinished }>{ formatTime(duration ?? undefined) }</TableContent>

    { phase === PhaseType.annotation &&
        <TableContent disabled={ isFinished }>{ annotatorAnnotations?.totalCount }</TableContent> }
    { phase === PhaseType.verification && <Fragment>
        <TableContent disabled={ isFinished }>{ otherAnnotations?.totalCount }</TableContent>
        <TableContent disabled={ isFinished }>{ annotatorAnnotations?.totalCount }</TableContent>
    </Fragment> }

    <TableContent disabled={ isFinished }>
      { isFinished ?
        <IonIcon icon={ checkmarkCircle } className={ styles.statusIcon } color='primary'/> :
        <IonIcon icon={ ellipseOutline } className={ styles.statusIcon } color='medium'/> }
    </TableContent>
    <TableContent disabled={ isFinished }>
      <Button color='dark' fill='clear' size='small' className={ styles.submit } onClick={ access }>
        <IonIcon icon={ chevronForwardOutline } color='primary' slot='icon-only'/>
      </Button>
    </TableContent>
    <TableDivider/>
  </Fragment>
}