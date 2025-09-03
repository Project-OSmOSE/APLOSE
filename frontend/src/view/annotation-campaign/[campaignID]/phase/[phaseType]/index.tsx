import React, { Fragment, useCallback, useMemo, useState } from "react";
import styles from './styles.module.scss'
import { IonIcon, IonSpinner } from "@ionic/react";
import { checkmarkCircle, chevronForwardOutline, ellipseOutline } from "ionicons/icons";
import { Button, Pagination, Table, TableContent, TableDivider, TableHead, WarningText } from "@/components/ui";
import { getErrorMessage } from "@/service/function.ts";
import { AnnotationsFilter } from "./AnnotationsFilter.tsx";
import { StatusFilter } from "./StatusFilter.tsx";
import { DateFilter } from "./DateFilter.tsx";
import { useRetrieveCurrentCampaign } from "@/service/api/campaign.ts";
import { AnnotationFile, AnnotationPhase } from "@/service/types";
import { AnnotationFileRangeAPI } from "@/service/api/annotation-file-range.ts";
import { useListPhasesForCurrentCampaign, useRetrieveCurrentPhase } from "@/service/api/campaign-phase.ts";
import { useSpectrogramFilters } from "@/service/slices/filter.ts";
import { SpectrogramActionBar } from "@/features/AnnotationPhase/SpectrogramActionBar.tsx";
import { ImportAnnotationsButton } from "@/features/AnnotationPhase/ImportAnnotationsButton.tsx";
import { useAnnotatorNavigation } from "@/features/Annotator";

export const AnnotationCampaignPhaseDetail: React.FC = () => {
  const { params } = useSpectrogramFilters(true)

  const { campaign } = useRetrieveCurrentCampaign()
  const { annotationPhase } = useListPhasesForCurrentCampaign()
  const { phase } = useRetrieveCurrentPhase()
  const [ page, setPage ] = useState<number>(1);

  AnnotationFileRangeAPI.endpoints.listFilesWithPagination.useQuery({
    page: 1,
    phaseID: phase?.id ?? -1,
  }, { refetchOnMountOrArgChange: true, skip: !phase || !!campaign?.archive });
  const { currentData: files, isFetching, error } = AnnotationFileRangeAPI.endpoints.listFilesWithPagination.useQuery({
    phaseID: phase?.id ?? -1,
    ...params
  }, { skip: !phase || !!campaign?.archive });
  const isEmpty = useMemo(() => error || !files || files.count === 0 || campaign?.archive, [ error, files, campaign ])

  const onFilterUpdated = useCallback(() => {
    setPage(1)
  }, [])

  if (!campaign || !phase) return <IonSpinner/>
  return <div className={ styles.phase }>

    <div className={ [ styles.tasks, isEmpty ? styles.empty : '' ].join(' ') }>

      <SpectrogramActionBar/>

      { phase.phase === 'Verification' && !phase.has_annotations && annotationPhase &&
          <WarningText>
              Your campaign doesn't have any annotations to check
              <ImportAnnotationsButton/>
          </WarningText> }

      <Table columns={ phase.phase === 'Verification' ? 7 : 6 } className={ styles.filesTable }>
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
          Annotations{ phase.phase === 'Verification' && <Fragment><br/>to check</Fragment> }
          <AnnotationsFilter onUpdate={ onFilterUpdated }/>
        </TableHead>
        { phase.phase === 'Verification' && <TableHead topSticky>
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

        { files?.results?.map(file => <TaskItem key={ file.id }
                                                file={ file }
                                                phase={ phase }/>) }
      </Table>

      { files?.results && files.results.length > 0 &&
          <Pagination currentPage={ page } totalPages={ files.pageCount } setCurrentPage={ setPage }/> }

      { isFetching && <IonSpinner/> }
      { error && <WarningText>{ getErrorMessage(error) }</WarningText> }
      { files && files.count === 0 && <p>You have no files to annotate.</p> }
      { campaign?.archive ? <p>The campaign is archived. No more annotation can be done.</p> :
        (phase?.ended_by && <p>The phase is ended. No more annotation can be done.</p>) }

    </div>
  </div>
}

const TaskItem: React.FC<{
  phase: AnnotationPhase;
  file: AnnotationFile;
}> = ({ phase, file }) => {
  const startDate = useMemo(() => new Date(file.start), [ file.start ]);
  const duration = useMemo(() => new Date(new Date(file.end).getTime() - startDate.getTime()), [ file.end, file.start ]);
  const { openAnnotator } = useAnnotatorNavigation()

  return <Fragment>
    <TableContent isFirstColumn={ true } disabled={ file.is_submitted }>{ file.filename }</TableContent>
    <TableContent disabled={ file.is_submitted }>{ startDate.toUTCString() }</TableContent>
    <TableContent disabled={ file.is_submitted }>{ duration.toUTCString().split(' ')[4] }</TableContent>
    <TableContent disabled={ file.is_submitted }>{ file.results_count }</TableContent>
    { phase.phase == 'Verification' &&
        <TableContent disabled={ file.is_submitted }>{ file.validated_results_count }</TableContent> }
    <TableContent disabled={ file.is_submitted }>
      { file.is_submitted &&
          <IonIcon icon={ checkmarkCircle } className={ styles.statusIcon } color='primary'/> }
      { !file.is_submitted &&
          <IonIcon icon={ ellipseOutline } className={ styles.statusIcon } color='medium'/> }
    </TableContent>
    <TableContent disabled={ file.is_submitted }>
      <Button color='dark' fill='clear' size='small' className={ styles.submit }
              onClick={ () => openAnnotator(file.id) }>
        <IonIcon icon={ chevronForwardOutline } color='primary' slot='icon-only'/>
      </Button>
    </TableContent>
    <TableDivider/>
  </Fragment>
}
