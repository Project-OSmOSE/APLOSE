import React, { Fragment, useCallback, useMemo } from 'react';
import styles from './styles.module.scss'
import { IonSpinner } from '@ionic/react';
import { GraphQLErrorText, Table, Pagination, Tbody, Th, Thead, Tr, useModal, WarningText } from '@/components/ui';
import { AnnotationsFilterModal, DateFilterModal, StatusFilterModal } from '@/features/AnnotationTask';
import { ImportAnnotationsButton } from '@/features/AnnotationPhase';
import { useAllAnnotationTasks, useAllTasksFilters, useCurrentCampaign, useCurrentPhase } from '@/api';
import { FileRangeActionBar } from '@/features/AnnotationFileRange';
import { SpectrogramRow } from '@/features/AnnotationSpectrogram';

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

    const hasDateFilter = useMemo(() => !!params.to || !!params.from, [ params ]);
    const dateFilterModal = useModal(DateFilterModal, {
        onUpdate: onFilterUpdated,
    })

    const statusFilterModal = useModal(StatusFilterModal, {
        onUpdate: onFilterUpdated,
    })

    if (!campaign || !phase) return <IonSpinner/>
    return <div className={ styles.phase }>

        <div className={ [ styles.tasks, isEmpty ? styles.empty : '' ].join(' ') }>

            <FileRangeActionBar/>

            { phase.phase === 'Verification' && !phase.hasAnnotations && verificationPhase &&
                <WarningText message="Your campaign doesn't have any annotations to check"
                             children={ <ImportAnnotationsButton/> }/> }

            <Table spacing='small'>
                <Thead>
                    <Tr>
                        <Th scope="col">Filename</Th>
                        <Th scope="col" center filterable
                            isFiltered={ hasDateFilter }
                            onFilterClick={ dateFilterModal.open }>
                            Date
                        </Th>
                        <Th scope="col" center>Duration</Th>
                        <Th scope="col" center filterable
                            isFiltered={ params.withAnnotations ?? false }
                            onFilterClick={ annotationFilterModal.open }>
                            Annotations{ phase.phase === 'Verification' && <Fragment><br/>to check</Fragment> }
                        </Th>
                        { phase.phase === 'Verification' && <Th scope='col' center>Validated<br/>annotations</Th> }
                        <Th scope='col' center filterable
                            isFiltered={params.status !== undefined}
                            onFilterClick={statusFilterModal.open}>
                            Status
                        </Th>
                        <Th scope='col'>
                            Access
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    { allSpectrograms?.map(s => <SpectrogramRow key={ s!.id }
                                                                               spectrogram={ s! }
                                                                               task={ s!.task }
                                                                               userAnnotations={ s!.task?.userAnnotations }
                                                                               validAnnotationsToCheck={ s!.task?.validAnnotationsToCheck }
                                                                               annotationsToCheck={ s!.task?.annotationsToCheck }/>) }
                </Tbody>
            </Table>

            { allSpectrograms && allSpectrograms.length > 0 &&
                <Pagination currentPage={ params.page ?? 1 } totalPages={ pageCount } setCurrentPage={ updatePage }/> }

            { error && <GraphQLErrorText error={ error }/> }
            { !isFetching && !error && (!allSpectrograms || allSpectrograms.length === 0) &&
                <p>You have no files to annotate.</p> }
            { campaign?.isArchived ? <p>The campaign is archived. No more annotation can be done.</p> :
                (phase?.endedAt && <p>The phase is ended. No more annotation can be done.</p>) }

        </div>

        { annotationFilterModal.element }
        { dateFilterModal.element }
        { statusFilterModal.element }
    </div>
}

export default AnnotationCampaignPhaseDetail
