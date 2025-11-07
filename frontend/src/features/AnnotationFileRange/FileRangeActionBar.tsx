import React, { Fragment, useCallback, useMemo } from 'react';
import styles from './styles.module.scss';
import { IonButton, IonIcon } from '@ionic/react';
import { peopleOutline, playOutline, refreshOutline } from 'ionicons/icons/index.js';
import { ActionBar, Button, Link, Progress, TooltipOverlay } from '@/components/ui';
import { ImportAnnotationsButton } from '@/features/AnnotationPhase';
import { useAllAnnotationTasks, useAllTasksFilters, useCurrentPhase } from '@/api';
import { FileRangeProgressModalButton } from '@/features/AnnotationFileRange';
import { type AploseNavParams } from '@/features/UX';
import { useOpenAnnotator } from '@/features/Annotator/Navigation';
import { useParams } from 'react-router-dom';

export const FileRangeActionBar: React.FC = () => {
  const { campaignID, phaseType } = useParams<AploseNavParams>();
  const { params, updateParams, clearParams } = useAllTasksFilters({ clearOnLoad: true })
  const { phase } = useCurrentPhase()
  const { allSpectrograms, resumeSpectrogramID } = useAllAnnotationTasks(params)
  const { openAnnotator } = useOpenAnnotator()

  const updateSearch = useCallback((search: string) => {
    updateParams({ search })
  }, [ updateParams ])

  const hasFilters = useMemo(() => Object.entries(params).filter(([ k, v ]) => k !== 'page' && v !== undefined).length > 0, [ params ]);

  const resumeBtnTooltip: string = useMemo(() => {
    if (hasFilters) return 'Cannot resume if filters are activated'
    if (!allSpectrograms || allSpectrograms.length === 0) return 'No files to annotate'
    return 'Resume annotation'
  }, [ hasFilters, allSpectrograms ])

  const resume = useCallback(() => {
    if (!resumeSpectrogramID) return;
    openAnnotator(resumeSpectrogramID)
  }, [ resumeSpectrogramID, openAnnotator ])

  return <ActionBar search={ params.search ?? undefined }
                    searchPlaceholder="Search filename"
                    onSearchChange={ updateSearch }
                    actionButton={ <div className={ styles.filterButtons }>

                      { hasFilters && <IonButton fill="clear" color="medium" size="small" onClick={ clearParams }>
                          <IonIcon icon={ refreshOutline } slot="start"/>
                          Reset
                      </IonButton> }

                      <div className={ styles.progress }>
                        { phase && phase.userCompletedTasksCount && phase.userCompletedTasksCount > 0 &&
                            <Progress label="My progress"
                                      color="primary"
                                      value={ phase.userTasksCount ?? 0 }
                                      total={ phase.userCompletedTasksCount }/> }
                        { phase && phase.completedTasksCount && phase.completedTasksCount > 0 &&
                            <Progress label="Global progress"
                                      value={ phase.tasksCount ?? 0 }
                                      total={ phase.completedTasksCount }/> }
                        <FileRangeProgressModalButton/>
                      </div>

                      { phase?.canManage && <Fragment>
                        {/* Manage annotators */ }
                          <TooltipOverlay tooltipContent={ <p>Manage annotators</p> } anchor="right">
                              <Link fill="outline" color="medium" data-testid="manage"
                                    appPath={ `/annotation-campaign/${ campaignID }/phase/${ phaseType }/edit-annotators` }>
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
}