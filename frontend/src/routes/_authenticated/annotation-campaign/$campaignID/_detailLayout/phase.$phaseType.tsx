import React, { Fragment, useCallback, useMemo } from 'react';
import { createFileRoute, notFound, useLoaderData, useNavigate } from '@tanstack/react-router';

import { Pagination, Table, Tbody, Th, Thead, Tr, WarningText } from '@/components/ui';

import { AnnotationPhaseType } from '@/api';

import { AnnotationsFilterModal, DateFilterModal, StatusFilterModal } from '@/features/AnnotationTask';
import { FileRangeActionBar } from '@/features/AnnotationFileRange';
import { PhaseComponent } from '@/features/AnnotationPhase';
import { type AllSpectrogramsFilters, SpectrogramRow } from '@/features/AnnotationSpectrogram';

import styles from './phase.$phaseType.module.scss';
import { queryClient } from '@/api/queryClient';
import { AnnotationPhase, AnnotationSpectrogram } from '@/features';
import { useQuery } from '@tanstack/react-query';
import { Note } from '@/components/base/Note';
import { Center } from '@/components/layout/Display';
import { Spinner } from '@/components/base/Spinner';
import { Dialog } from '@/components/base/Dialog';
import { Filter } from '@solar-icons/react';

const PAGE_SIZE = 20

const SpectrogramRows: React.FC = React.memo(() => {
    const { user } = useLoaderData({ from: '/_authenticated' })
    const search = Route.useSearch()
    const { campaignID, phaseType } = Route.useParams()
    const { data } = useQuery(AnnotationSpectrogram.API.allQuery({
        campaignID,
        phaseType,
        annotatorID: user!.id,
        limit: PAGE_SIZE,
        offset: PAGE_SIZE * ((search.page ?? 1) - 1),
        ...search,
    }))
    return data?.spectrograms.map(s => <SpectrogramRow key={ s!.id }
                                                       spectrogram={ s! }
                                                       task={ s!.task }
                                                       userAnnotations={ s!.task?.userAnnotations }
                                                       validAnnotationsToCheck={ s!.task?.validAnnotationsToCheck }
                                                       annotationsToCheck={ s!.task?.annotationsToCheck }/>)
})

const AnnotationCampaignPhaseDetail: React.FC = () => {
    const { user } = useLoaderData({ from: '/_authenticated' })
    const { campaign, phases } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const search = Route.useSearch()
    const { campaignID, phaseType } = Route.useParams()
    const { data, isLoading, isFetching } = useQuery(AnnotationSpectrogram.API.allQuery({
        campaignID,
        phaseType,
        annotatorID: user!.id,
        limit: PAGE_SIZE,
        offset: PAGE_SIZE * ((search.page ?? 1) - 1),
        ...search,
    }))
    const { data: phase } = useQuery(AnnotationPhase.API.getQuery({
        campaignID,
        phase: phaseType,
    }))

    const routeParams = Route.useParams()
    const navigate = useNavigate();

    const isEmpty = useMemo(() => !data || data.spectrograms.length === 0 || campaign.isArchived, [ data, campaign ])

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

    const hasDateFilter = useMemo(() => !!search.to || !!search.from, [ search ]);
    const hasStatusFilter = useMemo(() => search.status !== undefined || search.onlyAssigned !== undefined, [ search ]);

    return <div className={ styles.phase }>

        <div className={ [ styles.tasks, isEmpty ? styles.empty : '' ].join(' ') }>

            <FileRangeActionBar/>

            { phase?.phase === 'Verification' && !phase?.hasAnnotations && phases.find(p => p.phase === AnnotationPhaseType.Verification) &&
                <WarningText message="Your campaign doesn't have any annotations to check"
                             children={ <PhaseComponent.ImportAnnotationsButton/> }/> }

            { !isLoading && <Table spacing="small">
                <Thead>
                    <Tr>
                        <Th scope="col">Filename</Th>
                        <Th scope="col" center>
                            <div className={ styles.filterHead }>
                                Date

                                <Dialog.Root>
                                    <Dialog.Trigger>
                                        { hasDateFilter ? <Filter size={ 16 } weight="Bold"/> : <Filter size={ 16 }/> }
                                    </Dialog.Trigger>
                                    <Dialog.Portal>
                                        <DateFilterModal/>
                                    </Dialog.Portal>
                                </Dialog.Root>
                            </div>
                        </Th>
                        <Th scope="col" center>Duration</Th>
                        <Th scope="col" center>
                            <div className={ styles.filterHead }>
                                Annotations{ phase?.phase === 'Verification' && <Fragment><br/>to check</Fragment> }

                                <Dialog.Root>
                                    <Dialog.Trigger>
                                        { search.withAnnotations ? <Filter size={ 16 } weight="Bold"/> :
                                            <Filter size={ 16 }/> }
                                    </Dialog.Trigger>
                                    <Dialog.Portal>
                                        <AnnotationsFilterModal/>
                                    </Dialog.Portal>
                                </Dialog.Root>
                            </div>
                        </Th>
                        { phase?.phase === 'Verification' && <Th scope="col" center>Validated<br/>annotations</Th> }
                        <Th scope="col" center>
                            <div className={ styles.filterHead }>
                                Status

                                <Dialog.Root>
                                    <Dialog.Trigger>
                                        { hasStatusFilter ? <Filter size={ 16 } weight="Bold"/> :
                                            <Filter size={ 16 }/> }
                                    </Dialog.Trigger>
                                    <Dialog.Portal>
                                        <StatusFilterModal/>
                                    </Dialog.Portal>
                                </Dialog.Root>
                            </div>
                        </Th>
                        <Th scope="col">
                            Access
                        </Th>
                    </Tr>
                </Thead>
                <Tbody><SpectrogramRows/></Tbody>
            </Table> }

            { isFetching && <Center><Spinner/></Center> }

            { data && data.spectrograms.length > 0 &&
                <Pagination currentPage={ search.page ?? 1 }
                            totalPages={ Math.ceil((data.totalCount ?? 0) / PAGE_SIZE) }
                            setCurrentPage={ updatePage }/> }

            { data && data.spectrograms.length === 0 &&
                <p>You have no files to annotate.</p> }
            { campaign.isArchived ? <p>The campaign is archived. No more annotation can be done.</p> :
                (phase?.endedAt && <p>The phase is ended. No more annotation can be done.</p>) }

        </div>
    </div>
}

export const Route = createFileRoute('/_authenticated/annotation-campaign/$campaignID/_detailLayout/phase/$phaseType')({
    validateSearch: (search: Record<string, unknown>) => search as AllSpectrogramsFilters,
    params: {
        parse: rawParams => rawParams as { campaignID: string, phaseType: AnnotationPhaseType },
    },
    loaderDeps: ({ search }) => search as AllSpectrogramsFilters,
    loader: async ({ params: { campaignID, phaseType } }) => {
        const phase = await queryClient.ensureQueryData(AnnotationPhase.API.getQuery({
            campaignID,
            phase: phaseType,
        }))
        if (!phase) throw notFound()
        return { phase }
    },
    component: AnnotationCampaignPhaseDetail,
    pendingComponent: () => <Center><Spinner/></Center>,
    errorComponent: ({ error }) => <Center><WarningText error={ error }/></Center>,
    notFoundComponent: () => <Note color="medium">Phase not found</Note>,
})