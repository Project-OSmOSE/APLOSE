import React, { Fragment, useCallback, useMemo } from 'react';
import styles from './styles.module.scss'
import { IonSpinner } from '@ionic/react';
import { Pagination, Table, TableDivider, TableHead, WarningText } from '@/components/ui';
import { AnnotationsFilter, DateFilter, StatusFilter, TaskRow } from '@/features/AnnotationTask';
import { ImportAnnotationsButton } from '@/features/AnnotationPhase';
import { useAllAnnotationTasks, useAllTasksFilters, useCurrentCampaign, useCurrentPhase } from '@/api';
import { FileRangeActionBar } from '@/features/AnnotationFileRange';

export const AnnotationCampaignPhaseDetail: React.FC = () => {
  const { campaign, verificationPhase } = useCurrentCampaign()
  const { phase } = useCurrentPhase()

  const { params, updatePage } = useAllTasksFilters({ clearOnLoad: true })

  useAllAnnotationTasks({ page: 1 }, { refetchOnMountOrArgChange: true })
  const { allTasks, pageCount, isFetching, error } = useAllAnnotationTasks(params)

  const isEmpty = useMemo(() => error || !allTasks || allTasks.length === 0 || campaign?.isArchived, [ error, allTasks, campaign ])

  const onFilterUpdated = useCallback(() => {
    updatePage(1)
  }, [ updatePage ])

  if (!campaign || !phase) return <IonSpinner/>
  return <div className={ styles.phase }>

    <div className={ [ styles.tasks, isEmpty ? styles.empty : '' ].join(' ') }>

      <FileRangeActionBar/>

      { phase.phase === 'Verification' && !phase.hasAnnotations && verificationPhase &&
          <WarningText message="Your campaign doesn't have any annotations to check"
                       children={ <ImportAnnotationsButton/> }/> }

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

        { allTasks
          ?.filter(t => t && t.annotations && t.validatedAnnotations)
          .map(t => <TaskRow key={ t!.spectrogram.id }
                             task={ t! }
                             spectrogram={ t!.spectrogram! }
                             annotations={ t!.annotations! }
                             validatedAnnotations={ t!.validatedAnnotations! }/>) }
      </Table>

      { allTasks && allTasks.length > 0 &&
          <Pagination currentPage={ params.page } totalPages={ pageCount } setCurrentPage={ updatePage }/> }

      { isFetching && <IonSpinner/> }
      { error && <WarningText error={ error }/> }
      { allTasks && allTasks.length === 0 && <p>You have no files to annotate.</p> }
      { campaign?.isArchived ? <p>The campaign is archived. No more annotation can be done.</p> :
        (phase?.endedAt && <p>The phase is ended. No more annotation can be done.</p>) }

    </div>
  </div>
}