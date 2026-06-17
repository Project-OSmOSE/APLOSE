import React, { Fragment, useCallback, useMemo } from 'react';
import styles from './styles.module.scss';
import { IonButton, IonIcon } from '@ionic/react';
import { refreshOutline } from 'ionicons/icons/index.js';
import { ActionBar, Progress, useModal } from '@/components/ui';
import { ImportAnnotationsButton } from '@/features/AnnotationPhase';
import { FileRangeProgressModal } from '@/features/AnnotationFileRange';
import { useOpenAnnotator } from '@/features/Annotator/Navigation';
import { Route } from '@/routes/_authenticated/annotation-campaign/$campaignID/_detailLayout/phase.$phaseType';
import { useLoaderData, useNavigate } from '@tanstack/react-router';
import { Button, Link } from '@/components/base/Button';
import { CourseUp, Play, UsersGroupRounded } from '@solar-icons/react';
import { Popover } from '@/components/base/Popover';

export const FileRangeActionBar: React.FC = () => {
    const searchParams = Route.useSearch();
    const routeParams = Route.useParams()
    const navigate = useNavigate();
    const {
        phase,
        spectrograms,
        resumeSpectrogramId,
    } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/_detailLayout/phase/$phaseType' })
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
        if (!spectrograms || spectrograms.length === 0) return 'No files to annotate'
        return 'Resume annotation'
    }, [ hasFilters, spectrograms ])

    const resume = useCallback(() => {
        if (!resumeSpectrogramId) return;
        openAnnotator(resumeSpectrogramId, { resume: true })
    }, [ resumeSpectrogramId, openAnnotator ])

    const progressModal = useModal(FileRangeProgressModal)

    return <Fragment>
        <ActionBar search={ searchParams.search ?? undefined }
                   searchPlaceholder="Search filename"
                   onSearchChange={ updateSearch }
                   actionButton={ <div className={ styles.filterButtons }>

                       { (hasFilters || searchParams.onlyAssigned) &&
                           <IonButton fill="clear" color="medium" size="small" onClick={ clear }>
                               <IonIcon icon={ refreshOutline } slot="start"/>
                               Reset
                           </IonButton> }

                       <div className={ styles.progress }>
                           { phase && phase.userTasksCount && phase.userTasksCount > 0 ?
                               <Progress label="My progress"
                                         color="primary"
                                         value={ phase.userCompletedTasksCount ?? 0 }
                                         total={ phase.userTasksCount }/> : <Fragment/> }
                           { phase && phase.tasksCount && phase.tasksCount > 0 ?
                               <Progress label="Global progress"
                                         value={ phase.completedTasksCount ?? 0 }
                                         total={ phase.tasksCount }/> : <Fragment/> }

                           <Popover.Root>
                               <Popover.Trigger openOnHover>
                                   <Button onClick={ progressModal.toggle } data-testid="progress">
                                       <CourseUp weight="Linear" size={ 24 }/>
                                   </Button>
                               </Popover.Trigger>
                               <Popover.Content>Annotators progression</Popover.Content>
                           </Popover.Root>
                       </div>

                       { phase?.isEditable && phase?.isUserAllowedToManage && <Fragment>
                           {/* Manage annotators */ }
                           <Popover.Root>
                               <Popover.Trigger openOnHover>
                                   <Link data-testid="manage"
                                         to="/annotation-campaign/$campaignID/phase/$phaseType/edit-annotators"
                                         params={ routeParams }>
                                       <UsersGroupRounded weight="Linear" size={ 24 }/>
                                   </Link>
                               </Popover.Trigger>
                               <Popover.Content>Manage annotators</Popover.Content>
                           </Popover.Root>

                           {/* Import annotations */ }
                           <ImportAnnotationsButton/>
                       </Fragment> }

                       {/* Resume */ }
                       <Popover.Root>
                           <Popover.Trigger openOnHover>
                               <Button color="primary" data-testid="resume"
                                       disabled={ hasFilters || !(spectrograms && spectrograms.length > 0) || !resumeSpectrogramId }
                                       style={ { pointerEvents: 'unset' } }
                                       onClick={ resume }>
                                   <Play weight="Bold" size={ 24 }/>
                               </Button>
                           </Popover.Trigger>
                           <Popover.Content>{ resumeBtnTooltip }</Popover.Content>
                       </Popover.Root>
                   </div> }/>

        { progressModal.element }
    </Fragment>
}