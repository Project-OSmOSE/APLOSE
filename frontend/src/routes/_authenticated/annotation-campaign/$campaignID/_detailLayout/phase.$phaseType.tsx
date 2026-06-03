import React, { Fragment, useCallback, useMemo } from 'react';
import { createFileRoute, notFound, useLoaderData, useNavigate } from '@tanstack/react-router';

import { Pagination, Table, Tbody, Th, Thead, Tr, useModal, WarningText } from '@/components/ui';

import { AnnotationPhaseType } from '@/api';

import { AnnotationsFilterModal, DateFilterModal, StatusFilterModal } from '@/features/AnnotationTask';
import { FileRangeActionBar } from '@/features/AnnotationFileRange';
import { ImportAnnotationsButton } from '@/features/AnnotationPhase';
import { type AllSpectrogramsFilters, SpectrogramRow } from '@/features/AnnotationSpectrogram';

import styles from './phase.$phaseType.module.scss';
import { queryClient } from '@/api/queryClient';
import { AnnotationPhase, AnnotationSpectrogram, User } from '@/features';
import { IonNote, IonSpinner } from '@ionic/react';

const AnnotationCampaignPhaseDetail: React.FC = () => {
    const { campaign, phases } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const { phase, spectrograms, spectrogramsPageCount } = Route.useLoaderData()

    const search = Route.useSearch();
    const routeParams = Route.useParams()
    const navigate = useNavigate();

    const isEmpty = useMemo(() => spectrograms.length === 0 || campaign.isArchived, [ spectrograms, campaign ])

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
        return <div className={ styles.phase }>

            <div className={ [ styles.tasks, isEmpty ? styles.empty : '' ].join(' ') }>

                <FileRangeActionBar/>

                { phase.phase === 'Verification' && !phase.hasAnnotations && phases.find(p => p.phase === AnnotationPhaseType.Verification) &&
                    <WarningText message="Your campaign doesn't have any annotations to check"
                                 children={ <ImportAnnotationsButton/> }/> }

                <Table spacing="small">
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
                                isFiltered={ search.status !== undefined || search.onlyAssigned !== undefined }
                                onFilterClick={ statusFilterModal.open }>
                                Status
                            </Th>
                            <Th scope="col">
                                Access
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        { spectrograms.map(s => <SpectrogramRow key={ s!.id }
                                                                 spectrogram={ s! }
                                                                 task={ s!.task }
                                                                 userAnnotations={ s!.task?.userAnnotations }
                                                                 validAnnotationsToCheck={ s!.task?.validAnnotationsToCheck }
                                                                 annotationsToCheck={ s!.task?.annotationsToCheck }/>) }
                    </Tbody>
                </Table>

                { spectrograms.length > 0 &&
                    <Pagination currentPage={ search.page ?? 1 } totalPages={ spectrogramsPageCount }
                                setCurrentPage={ updatePage }/> }

                { spectrograms.length === 0 &&
                    <p>You have no files to annotate.</p> }
                { campaign.isArchived ? <p>The campaign is archived. No more annotation can be done.</p> :
                    (phase?.endedAt && <p>The phase is ended. No more annotation can be done.</p>) }

            </div>

            { annotationFilterModal.element }
            { dateFilterModal.element }
            { statusFilterModal.element }
        </div>
    }, [ campaign, phase, isEmpty, phases, hasDateFilter, dateFilterModal, search, annotationFilterModal,
        statusFilterModal, spectrograms, spectrogramsPageCount, updatePage,  ]);
}

export const Route = createFileRoute('/_authenticated/annotation-campaign/$campaignID/_detailLayout/phase/$phaseType')({
    validateSearch: (search: Record<string, unknown>) => search as AllSpectrogramsFilters,
    params: {
        parse: rawParams => rawParams as { campaignID: string, phaseType: AnnotationPhaseType },
    },
    loaderDeps: ({ search }) => search as AllSpectrogramsFilters,
    loader: async ({ params: { campaignID, phaseType }, deps }) => {
        const PAGE_SIZE = 20
        const user = await queryClient.ensureQueryData(User.API.currentQuery)
        const [
            phase,
            { spectrograms, totalCount, resumeId },
        ] = await Promise.all([
            queryClient.ensureQueryData(AnnotationPhase.API.getQuery({
                campaignID,
                phase: phaseType,
            })),
            queryClient.ensureQueryData(AnnotationSpectrogram.API.allQuery({
                campaignID,
                phaseType,
                annotatorID: user.id,
                limit: PAGE_SIZE,
                offset: PAGE_SIZE * ((deps.page ?? 1) - 1),
                ...deps,
            })),
        ])
        if (!phase) throw notFound()
        return { phase, spectrograms, spectrogramsPageCount: Math.ceil((totalCount ?? 0) / PAGE_SIZE), resumeSpectrogramId: resumeId }
    },
    component: AnnotationCampaignPhaseDetail,
    pendingComponent: IonSpinner,
    notFoundComponent: () => <IonNote color='medium'>Phase not found</IonNote>
})