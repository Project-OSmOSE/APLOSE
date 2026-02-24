import React, { Fragment, useCallback, useMemo } from 'react';
import styles from './styles.module.scss'
import { IonIcon, IonSpinner } from '@ionic/react';
import { Pagination, Table, TableDivider, TableHead, useModal, WarningText } from '@/components/ui';
import { AnnotationsFilterModal, DateFilter, StatusFilter } from '@/features/AnnotationTask';
import { ImportAnnotationsButton } from '@/features/AnnotationPhase';
import { useAllAnnotationTasks, useAllTasksFilters, useCurrentCampaign, useCurrentPhase } from '@/api';
import { FileRangeActionBar } from '@/features/AnnotationFileRange';
import { SpectrogramRow } from '@/features/AnnotationSpectrogram';
import { funnel, funnelOutline } from 'ionicons/icons';

export const AnnotationCampaignPhaseDetail: React.FC = () => {
    const { campaign, verificationPhase } = useCurrentCampaign()
    const { phase } = useCurrentPhase()

    const { params, updatePage } = useAllTasksFilters({ clearOnLoad: true })

    const {
        allSpectrograms,
        pageCount,
        isFetching,
        error,
    } = useAllAnnotationTasks(params, { refetchOnMountOrArgChange: true })

    const isEmpty = useMemo(() => error || !allSpectrograms || allSpectrograms.length === 0 || campaign?.isArchived, [ error, allSpectrograms, campaign ])

    const onFilterUpdated = useCallback(() => {
        updatePage(1)
    }, [ updatePage ])

    const annotationFilterModal = useModal(AnnotationsFilterModal, {
        onUpdate: onFilterUpdated,
    })

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
                    { params.withAnnotations ?
                        <IonIcon onClick={ annotationFilterModal.open } color="primary" icon={ funnel }/> :
                        <IonIcon onClick={ annotationFilterModal.open } color="dark" icon={ funnelOutline }/> }
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

                { !isFetching && allSpectrograms?.map(s => <SpectrogramRow key={ s!.id }
                                                                           spectrogram={ s! }
                                                                           task={ s!.task }
                                                                           userAnnotations={ s!.task?.userAnnotations }
                                                                           validAnnotationsToCheck={ s!.task?.validAnnotationsToCheck }
                                                                           annotationsToCheck={ s!.task?.annotationsToCheck }/>) }
                { isFetching && <IonSpinner/> }

            </Table>

            { allSpectrograms && allSpectrograms.length > 0 &&
                <Pagination currentPage={ params.page ?? 1 } totalPages={ pageCount } setCurrentPage={ updatePage }/> }

            { error && <WarningText error={ error }/> }
            { !isFetching && !error && (!allSpectrograms || allSpectrograms.length === 0) &&
                <p>You have no files to annotate.</p> }
            { campaign?.isArchived ? <p>The campaign is archived. No more annotation can be done.</p> :
                (phase?.endedAt && <p>The phase is ended. No more annotation can be done.</p>) }

        </div>

        { annotationFilterModal.element }
    </div>
}

export default AnnotationCampaignPhaseDetail
