import React, { Fragment, useCallback, useMemo } from 'react';
import { createFileRoute, notFound, useLoaderData, useNavigate } from '@tanstack/react-router';

import { Pagination, Table, Tbody, Th, Thead, Tr, useModal, WarningText } from '@/components/ui';

import { AnnotationPhaseType } from '@/api';

import { AnnotationsFilterModal, DateFilterModal, StatusFilterModal } from '@/features/AnnotationTask';
import { FileRangeActionBar } from '@/features/AnnotationFileRange';
import { ImportAnnotationsButton } from '@/features/AnnotationPhase';
import { type AllSpectrogramsFilters, SpectrogramRow } from '@/features/AnnotationSpectrogram';

import styles from './phase.$phaseType.module.scss';
import { AnnotationPhase, AnnotationSpectrogram } from '@/features';
import { IonNote, IonSpinner } from '@ionic/react';
import { useQuery } from '@tanstack/react-query';
import { ensureValidQueryData } from '@/api/utils';

const PAGE_SIZE = 20

const AnnotationCampaignPhaseDetail: React.FC = () => {
    const { campaign, phases, user } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const { campaignID, phaseType } = Route.useParams()
    const search = Route.useSearch()
    const { data, isFetching } = useQuery(AnnotationSpectrogram.API.allQuery({
        campaignID,
        phaseType,
        annotatorID: user.id,
        limit: PAGE_SIZE,
        offset: PAGE_SIZE * ((search.page ?? 1) - 1),
        ...search,
    }))
    const { data: phase } = useQuery(AnnotationPhase.API.getQuery({
        campaignID,
        phase: phaseType,
    }))

    const navigate = useNavigate();

    const isEmpty = useMemo(() => data && data.spectrograms.length === 0 || campaign.isArchived, [ data, campaign ])

    const updatePage = useCallback((page?: number) => {
        navigate({
            to: Route.to,
            params: { campaignID, phaseType },
            search: (prev) => ({
                ...prev,
                page: page ?? 1,
            }),
            replace: true,
        })
    }, [ navigate, campaignID, phaseType ])

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

    return <div className={ styles.phase }>

        <div className={ [ styles.tasks, isEmpty ? styles.empty : '' ].join(' ') }>

            <FileRangeActionBar isPending={ isFetching }/>

            { phase?.phase === 'Verification' && !phase?.hasAnnotations && phases.find(p => p.phase === AnnotationPhaseType.Verification) &&
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
                            Annotations{ phase?.phase === 'Verification' && <Fragment><br/>to check</Fragment> }
                        </Th>
                        { phase?.phase === 'Verification' && <Th scope="col" center>Validated<br/>annotations</Th> }
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
                    { data && data.spectrograms.map(s => <SpectrogramRow key={ s!.id }
                                                                         spectrogram={ s! }
                                                                         task={ s!.task }
                                                                         userAnnotations={ s!.task?.userAnnotations }
                                                                         validAnnotationsToCheck={ s!.task?.validAnnotationsToCheck }
                                                                         annotationsToCheck={ s!.task?.annotationsToCheck }/>) }
                </Tbody>
            </Table>

            { data && data.spectrograms.length > 0 &&
                <Pagination currentPage={ search.page ?? 1 }
                            totalPages={ Math.ceil((data.totalCount ?? 0) / PAGE_SIZE) }
                            setCurrentPage={ updatePage }/> }

            { data && data.spectrograms.length === 0 &&
                <p>You have no files to annotate.</p> }
            { campaign.isArchived ? <p>The campaign is archived. No more annotation can be done.</p> :
                (phase?.endedAt && <p>The phase is ended. No more annotation can be done.</p>) }

        </div>

        { annotationFilterModal.element }
        { dateFilterModal.element }
        { statusFilterModal.element }
    </div>
}

export const Route = createFileRoute('/_authenticated/annotation-campaign/$campaignID/_detailLayout/phase/$phaseType')({
    validateSearch: (search: Record<string, unknown>) => search as AllSpectrogramsFilters,
    params: {
        parse: rawParams => rawParams as { campaignID: string, phaseType: AnnotationPhaseType },
    },
    loaderDeps: ({ search }) => search as AllSpectrogramsFilters,
    loader: async ({ params: { campaignID, phaseType }, deps, parentMatchPromise }) => {
        const { user } = (await parentMatchPromise).loaderData!

        const [
            phase,
            { spectrograms, resumeId },
        ] = await Promise.all([
            ensureValidQueryData(AnnotationPhase.API.getQuery({
                campaignID,
                phase: phaseType,
            })),
            ensureValidQueryData(AnnotationSpectrogram.API.allQuery({
                campaignID,
                phaseType,
                annotatorID: user!.id,
                limit: PAGE_SIZE,
                offset: PAGE_SIZE * ((deps.page ?? 1) - 1),
                ...deps,
            })),
        ])
        if (!phase) throw notFound()
        return {
            phase,
            spectrograms,
            resumeSpectrogramId: resumeId,
        }
    },
    component: AnnotationCampaignPhaseDetail,
    pendingComponent: IonSpinner,
    notFoundComponent: () => <IonNote color="medium">Phase not found</IonNote>,
})