import React, { Fragment, useCallback } from "react";
import { PhaseType, TaskStatus } from "@/features/gql/api";
import styles from "@/view/campaign/details/styles.module.scss";
import { Button, Table, TableContent, TableDivider, TableHead, WarningText } from "@/components/ui";
import { IonIcon, IonSpinner } from "@ionic/react";
import { checkmarkCircle, chevronForwardOutline, ellipseOutline } from "ionicons/icons";
import { dateToString, getErrorMessage } from "@/service/function.ts";
import { formatTime } from "@/service/dataset/spectrogram-configuration/scale";
import { useNavigate, useParams } from "react-router-dom";
import { usePhaseFileRanges } from "./hook.ts";
import { StatusFilter } from "./StatusFilter.tsx";
import { AnnotationsFilter } from "./AnnotationsFilter.tsx";
import { DateFilter } from "./DateFilter.tsx";
import { useSpectrogramFilters } from "./filter.ts";


export const SpectrogramTable: React.FC<{ page: number, setPage: (page: number) => void }> = ({ page, setPage }) => {
  const {
    campaignID,
    phaseType
  } = useParams<{ campaignID: string; phaseType: PhaseType }>();
  const navigate = useNavigate()
  const { params } = useSpectrogramFilters()
  const {
    spectrograms,
    isFetching,
    error
  } = usePhaseFileRanges({ page, campaignID, phaseType });

  const onFilterUpdated = useCallback(() => setPage(1), [])

  const accessAnnotator = useCallback((id: string) => {
    const encodedParams = encodeURI(Object.entries(params).map(([ k, v ]) => `${ k }=${ v }`).join('&'));
    navigate(`/annotation-campaign/${ campaignID }/phase/${ phaseType }/file/${ id }?${ encodedParams }`);
  }, [ campaignID, phaseType ])

  if (!phaseType || !campaignID) return <Fragment/>
  if (isFetching) return <IonSpinner/> // TODO: Skeleton loading
  if (error) return <WarningText>{ getErrorMessage(error) }</WarningText>

  return <Table columns={ 12 } className={ styles.filesTable }>
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
      Annotations{ phaseType === PhaseType.verification && <Fragment><br/>to check</Fragment> }
      <AnnotationsFilter onUpdate={ onFilterUpdated }/>
    </TableHead>
    { phaseType === PhaseType.verification && <TableHead topSticky>
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

    { spectrograms?.map(s => <Fragment key={ s.id }>
      <TableContent isFirstColumn={ true } disabled={ s.status === TaskStatus.finished }>{ s.filename }</TableContent>
      <TableContent disabled={ s.status === TaskStatus.finished }>{ dateToString(s.start) }</TableContent>
      <TableContent
        disabled={ s.status === TaskStatus.finished }>{ formatTime(s.duration ?? undefined) }</TableContent>

      { phaseType === PhaseType.annotation &&
          <TableContent
              disabled={ s.status === TaskStatus.finished }>{ s.annotationsCount.annotator }</TableContent> }
      { phaseType === PhaseType.verification && <Fragment>
          <TableContent disabled={ s.status === TaskStatus.finished }>{ s.annotationsCount.other }</TableContent>
          <TableContent disabled={ s.status === TaskStatus.finished }>{ s.annotationsCount.annotator }</TableContent>
      </Fragment> }

      <TableContent disabled={ s.status === TaskStatus.finished }>
        { s.status === TaskStatus.finished ?
          <IonIcon icon={ checkmarkCircle } className={ styles.statusIcon } color='primary'/> :
          <IonIcon icon={ ellipseOutline } className={ styles.statusIcon } color='medium'/> }
      </TableContent>
      <TableContent disabled={ s.status === TaskStatus.finished }>
        <Button color='dark' fill='clear' size='small' className={ styles.submit }
                onClick={ () => accessAnnotator(s.id) }>
          <IonIcon icon={ chevronForwardOutline } color='primary' slot='icon-only'/>
        </Button>
      </TableContent>
      <TableDivider/>
    </Fragment>) }
  </Table>
}
