import React, { Fragment, useCallback, useMemo } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { IonSpinner } from '@ionic/react';

import { GraphQLErrorText, Pagination, Table, Tbody, Th, Thead, Tr, useModal, WarningText } from '@/components/ui';

import {
    type AllTasksFilters,
    AnnotationPhaseType,
    useAllAnnotationTasks,
    useCurrentCampaign,
    useCurrentPhase,
} from '@/api';

import { AnnotationsFilterModal, DateFilterModal, StatusFilterModal } from '@/features/AnnotationTask';
import { FileRangeActionBar } from '@/features/AnnotationFileRange';
import { ImportAnnotationsButton } from '@/features/AnnotationPhase';
import { SpectrogramRow } from '@/features/AnnotationSpectrogram';

import styles from './phase.$phaseType.module.scss';

const AnnotationCampaignPhaseDetail: React.FC = () => {
    const { campaign, verificationPhase } = useCurrentCampaign()
    const { phase } = useCurrentPhase()

    const search = Route.useSearch();
    const routeParams = Route.useParams()
    const navigate = useNavigate();

    const {
        allSpectrograms,
        pageCount,
        isFetching,
        error,
    } = useAllAnnotationTasks(search, { refetchOnMountOrArgChange : true })

    const isEmpty = useMemo(() => error || !allSpectrograms || allSpectrograms.length === 0 || campaign?.isArchived, [ error, allSpectrograms, campaign ])

    const updatePage = useCallback((page?: number) => {
        navigate({
            to: Route.to,
            params: routeParams,
            search: (prev) => ({
                ...prev,
                page: page ?? 1,
            }),
            replace: true,
        })
    }, [ navigate, routeParams ])

    const annotationFilterModal = useModal(AnnotationsFilterModal, {
        onUpdate: updatePage,
    })

    const hasDateFilter = useMemo(() => !!search.to || !!search.from, [ search ]);
    const dateFilterModal = useModal(DateFilterModal, {
        onUpdate: updatePage,
    })

    const statusFilterModal = useModal(StatusFilterModal, {
        onUpdate: updatePage,
    })

    return useMemo(() => {
        if (!campaign || !phase) return <IonSpinner/>
        return <div className={ styles.phase }>

            <div className={ [ styles.tasks, isEmpty ? styles.empty : '' ].join(' ') }>

                <FileRangeActionBar/>

                { phase.phase === 'Verification' && !phase.hasAnnotations && verificationPhase &&
                    <WarningText message="Your campaign doesn't have any annotations to check"
                                 children={ <ImportAnnotationsButton/> }/> }

                { isFetching ? <IonSpinner/> : <Table spacing="small">
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
                                isFiltered={ search.withAnnotations ?? false }
                                onFilterClick={ annotationFilterModal.open }>
                                Annotations{ phase.phase === 'Verification' && <Fragment><br/>to check</Fragment> }
                            </Th>
                            { phase.phase === 'Verification' && <Th scope="col" center>Validated<br/>annotations</Th> }
                            <Th scope="col" center filterable
                                isFiltered={ search.status !== undefined }
                                onFilterClick={ statusFilterModal.open }>
                                Status
                            </Th>
                            <Th scope="col">
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
                </Table> }

                { allSpectrograms && allSpectrograms.length > 0 &&
                    <Pagination currentPage={ search.page ?? 1 } totalPages={ pageCount }
                                setCurrentPage={ updatePage }/> }

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
    }, [ campaign, phase, isEmpty, verificationPhase, hasDateFilter, dateFilterModal, search, annotationFilterModal,
        statusFilterModal, allSpectrograms, pageCount, updatePage, error, isFetching ]);
}

export const Route = createFileRoute('/_authenticated/annotation-campaign/$campaignID/_detailLayout/phase/$phaseType')({
    validateSearch: (search: Record<string, unknown>) => search as AllTasksFilters,
    params: {
        parse: rawParams => rawParams as { campaignID: string, phaseType: AnnotationPhaseType },
    },
    component: AnnotationCampaignPhaseDetail,
})