import React, { Fragment, useCallback, useMemo } from 'react';
import styles from './styles.module.scss';
import { ActionBar } from '@/components/ui';
import { ImportAnnotationsButton } from '@/features/AnnotationPhase';
import { FileRangeDialog } from '@/features/AnnotationFileRange';
import { useOpenAnnotator } from '@/features/Annotator/Navigation';
import { Route } from '@/routes/_authenticated/annotation-campaign/$campaignID/_detailLayout/phase.$phaseType';
import { useLoaderData, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/base/Button';
import { CourseUp, Play, Restart, UsersGroupRounded } from '@solar-icons/react';
import { Popover } from '@/components/base/Popover';
import { Progress } from '@/components/base/Progress';
import { Dialog } from '@/components/base/Dialog';
import { useQuery } from '@tanstack/react-query';
import { AnnotationSpectrogram } from '@/features';

const PAGE_SIZE = 20

export const FileRangeActionBar: React.FC = () => {
    const searchParams = Route.useSearch();
    const routeParams = Route.useParams()
    const navigate = useNavigate();
    const {
        phase,
    } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/_detailLayout/phase/$phaseType' })
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
    const openAnnotator = useOpenAnnotator()

    const updateSearch = useCallback((input: string) => {
        navigate({
            to: Route.to,
            params: routeParams,
            search: (prev) => ({
                ...prev,
                search: input,
                page: 1,
            }),
            replace: true,
        })
    }, [ navigate, routeParams ])

    const clear = useCallback(() => {
        navigate({
            to: Route.to,
            params: routeParams,
            search: { page: 1 },
            replace: true,
        })
    }, [ navigate, routeParams ])

    const hasFilters = useMemo(() => Object.entries(searchParams).filter(([ k, v ]) => k !== 'page' && k !== 'onlyAssigned' && v !== undefined).length > 0, [ searchParams ]);

    const resumeBtnTooltip: string = useMemo(() => {
        if (hasFilters) return 'Cannot resume if filters are activated'
        if (!data || data.spectrograms.length === 0) return 'No files to annotate'
        return 'Resume annotation'
    }, [ hasFilters, data ])

    const resume = useCallback(() => {
        if (!data || !data.resumeId) return;
        openAnnotator(data.resumeId, { resume: true })
    }, [ data, openAnnotator ])

    return <Fragment>
        <ActionBar search={ searchParams.search ?? undefined }
                   searchPlaceholder="Search filename"
                   onSearchChange={ updateSearch }
                   actionButton={ <div className={ styles.filterButtons }>

                       { (hasFilters || searchParams.onlyAssigned) &&
                           <Button color="medium" onClick={ clear }>
                               <Restart weight="Linear" size={ 20 }/>
                               Reset
                           </Button> }

                       <div className={ styles.progress }>
                           <Progress color="primary"
                                     value={ phase.userCompletedTasksCount ?? 0 }
                                     max={ phase.userTasksCount ?? 0 }>
                               My progress
                           </Progress>
                           <Progress color="medium"
                                     value={ phase.completedTasksCount ?? 0 }
                                     max={ phase.tasksCount ?? 0 }>
                               Global progress
                           </Progress>

                           <Dialog.Root>
                               <Dialog.Trigger render={ <div/> } nativeButton={ false }>
                                   <Popover.Root>
                                       <Popover.Trigger data-testid="progress">
                                           <CourseUp weight="Linear" size={ 24 }/>
                                       </Popover.Trigger>
                                       <Popover.Content>Annotators progression</Popover.Content>
                                   </Popover.Root>
                               </Dialog.Trigger>
                               <Dialog.Portal>
                                   <FileRangeDialog.Progress/>
                               </Dialog.Portal>
                           </Dialog.Root>
                       </div>

                       { phase?.isEditable && phase?.isUserAllowedToManage && <Fragment>
                           {/* Manage annotators */ }
                           <Popover.Root>
                               <Popover.TriggerLink data-testid="manage"
                                                    to="/annotation-campaign/$campaignID/phase/$phaseType/edit-annotators"
                                                    params={ routeParams }>
                                   <UsersGroupRounded weight="Linear" size={ 24 }/>
                               </Popover.TriggerLink>
                               <Popover.Content>Manage annotators</Popover.Content>
                           </Popover.Root>

                           {/* Import annotations */ }
                           <ImportAnnotationsButton/>
                       </Fragment> }

                       {/* Resume */ }
                       <Popover.Root>
                           <Popover.Trigger color="primary" data-testid="resume"
                                            disabled={ hasFilters || !data || data.spectrograms.length === 0 || !data.resumeId }
                                            style={ { pointerEvents: 'unset' } }
                                            onClick={ resume }>
                               <Play weight="Bold" size={ 24 }/>
                           </Popover.Trigger>
                           <Popover.Content>{ resumeBtnTooltip }</Popover.Content>
                       </Popover.Root>
                   </div> }/>
    </Fragment>
}