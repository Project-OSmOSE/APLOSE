import React, { Fragment, useCallback, useMemo } from 'react';
import styles from './styles.module.scss';
import { IonButton, IonIcon } from '@ionic/react';
import { peopleOutline, playOutline, refreshOutline } from 'ionicons/icons/index.js';
import { ActionBar, Button, Link, Progress, TooltipOverlay, useModal } from '@/components/ui';
import { ImportAnnotationsButton } from '@/features/AnnotationPhase';
import { useAllAnnotationTasks, useCurrentPhase } from '@/api';
import { FileRangeProgressModal } from '@/features/AnnotationFileRange';
import { useOpenAnnotator } from '@/features/Annotator/Navigation';
import { analytics } from 'ionicons/icons';
import { Route } from '@/routes/_authenticated/annotation-campaign/$campaignID/_detailLayout/phase.$phaseType';
import { useNavigate } from '@tanstack/react-router';

export const FileRangeActionBar: React.FC = () => {
    const searchParams = Route.useSearch();
    const routeParams = Route.useParams()
    const navigate = useNavigate();
    const { phase } = useCurrentPhase()
    const { allSpectrograms, resumeSpectrogramID } = useAllAnnotationTasks(searchParams)
    const openAnnotator = useOpenAnnotator()

    const updateSearch = useCallback((input: string) => {
        navigate({
            to: Route.to,
            params: routeParams,
            search: (prev) => ({
                ...prev,
                search: input,
                page: 1
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

    const hasFilters = useMemo(() => Object.entries(searchParams).filter(([ k, v ]) => k !== 'page' && v !== undefined).length > 0, [ searchParams ]);

    const resumeBtnTooltip: string = useMemo(() => {
        if (hasFilters) return 'Cannot resume if filters are activated'
        if (!allSpectrograms || allSpectrograms.length === 0) return 'No files to annotate'
        return 'Resume annotation'
    }, [ hasFilters, allSpectrograms ])

    const resume = useCallback(() => {
        if (!resumeSpectrogramID) return;
        openAnnotator(resumeSpectrogramID)
    }, [ resumeSpectrogramID, openAnnotator ])

    const progressModal = useModal(FileRangeProgressModal)

    return <Fragment>
        <ActionBar search={ searchParams.search ?? undefined }
                   searchPlaceholder="Search filename"
                   onSearchChange={ updateSearch }
                   actionButton={ <div className={ styles.filterButtons }>

                       { hasFilters && <IonButton fill="clear" color="medium" size="small" onClick={ clear }>
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

                           <TooltipOverlay tooltipContent={ <p>Annotators progression</p> } anchor="right">
                               <IonButton fill="clear" color="medium" onClick={ progressModal.toggle }
                                          data-testid="progress">
                                   <IonIcon icon={ analytics } slot="icon-only"/>
                               </IonButton>
                           </TooltipOverlay>
                       </div>

                       { phase?.isEditable && phase?.isUserAllowedToManage && <Fragment>
                           {/* Manage annotators */ }
                           <TooltipOverlay tooltipContent={ <p>Manage annotators</p> } anchor="right">
                               <Link fill="outline" color="medium" data-testid="manage"
                                     to="/annotation-campaign/$campaignID/phase/$phaseType/edit-annotators"
                                     params={ routeParams }>
                                   <IonIcon icon={ peopleOutline } slot="icon-only"/>
                               </Link>
                           </TooltipOverlay>

                           {/* Import annotations */ }
                           <ImportAnnotationsButton/>
                       </Fragment> }

                       {/* Resume */ }
                       <TooltipOverlay tooltipContent={ <p>{ resumeBtnTooltip }</p> } anchor="right">
                           <Button color="primary" fill="outline" data-testid="resume"
                                   disabled={ hasFilters || !(allSpectrograms && allSpectrograms.length > 0) || !resumeSpectrogramID }
                                   style={ { pointerEvents: 'unset' } }
                                   onClick={ resume }>
                               <IonIcon icon={ playOutline } slot="icon-only"/>
                           </Button>
                       </TooltipOverlay>
                   </div> }/>

        { progressModal.element }
    </Fragment>
}